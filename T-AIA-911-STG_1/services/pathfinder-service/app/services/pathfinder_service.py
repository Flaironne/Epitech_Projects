import time
import os
from neo4j import GraphDatabase
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_AUTH_USERNAME = os.environ.get("NEO4J_AUTH_USERNAME")
NEO4J_AUTH_PASSWORD = os.environ.get("NEO4J_AUTH_PASSWORD")

AUTH = (NEO4J_AUTH_USERNAME, NEO4J_AUTH_PASSWORD)

def build_trip_options(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Transforme les records Neo4j (record.data()) en objets TripOption exploitables.
    """
    options: List[Dict[str, Any]] = []

    for idx, rec in enumerate(records):
        raw_path = rec["path"]
        duree_minutes = int(round(rec["duree_minutes"]))

        stops = []
        rel_types = []

        for i, item in enumerate(raw_path):
            if isinstance(item, dict):
                stops.append(item)
            elif isinstance(item, str):
                rel_types.append(item)

        timeline = []
        for s_i in range(len(stops) - 1):
            timeline.append({
                "from": {
                    "id": stops[s_i].get("id"),
                    "name": stops[s_i].get("name"),
                    "lat": stops[s_i].get("lat"),
                    "lon": stops[s_i].get("lon"),
                },
                "to": {
                    "id": stops[s_i + 1].get("id"),
                    "name": stops[s_i + 1].get("name"),
                    "lat": stops[s_i + 1].get("lat"),
                    "lon": stops[s_i + 1].get("lon"),
                },
                "relationship_type": rel_types[s_i] if s_i < len(rel_types) else None,
            })

        segments_count = len(timeline)
        transfers_count = max(0, segments_count - 1)

        option = {
            "rank": idx + 1,
            "duration_minutes": duree_minutes,
            "duration_seconds": duree_minutes * 60,
            "segments_count": segments_count,
            "transfers_count": transfers_count,
            "departure": stops[0] if stops else None,
            "destination": stops[-1] if stops else None,
            "stops": stops,
            "timeline": timeline,
            "neo4j_meta": {
                "raw_path_length": len(raw_path),
                "relationship_types": rel_types,
            },
        }

        options.append(option)

    options.sort(key=lambda o: o["duration_seconds"])
    for i, o in enumerate(options):
        o["rank"] = i + 1

    return options

def run_pathfinder(departure, destination) -> dict:
    with GraphDatabase.driver(NEO4J_URI, auth=AUTH) as driver:
        driver.verify_connectivity()

        records, summary, keys = driver.execute_query("""
            MATCH (s:Stop) WHERE s.name CONTAINS $departure
            MATCH (p:Stop) WHERE p.name CONTAINS $destination
            MATCH path = shortestPath((s)-[:RELIÉ_À*..20]->(p))
            RETURN path, 
                reduce(total = 0, r IN relationships(path) | total + r.temps) AS duree_minutes
            """,
            departure=departure.title(),
            destination=destination.title(),
            database_="neo4j",
        )

        print(f"Query executed in {summary.result_available_after} ms, returned {len(records)} records.")

        raw_records = [r.data() for r in records]
        trip_options = build_trip_options(raw_records)

    if not trip_options:
        print("No trip options found.")
        raise ValueError(f"No trip options found for departure='{departure}' and destination='{destination}'")

    print(f"Built {len(trip_options)} trip options.")

    bestOption = trip_options[0] if trip_options else None

    return {
        "departure": bestOption.get("departure") if bestOption else None,
        "destination": bestOption.get("destination") if bestOption else None,
        "options_count": len(trip_options),
        "options": trip_options,
    }
