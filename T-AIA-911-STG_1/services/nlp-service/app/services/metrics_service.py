import psutil
from codecarbon import EmissionsTracker

def collect_metrics(tracker: EmissionsTracker) -> dict:
    last = tracker.final_emissions_data

    if last is None:
        raise RuntimeError("Carbon tracker has no emission data")

    return {
        "cpu_percent": psutil.cpu_percent(interval=None),
        "ram_mb": psutil.virtual_memory().used / 1024 / 1024,
        "cpu_energy": last.cpu_energy or 0.0,
        "ram_energy": last.ram_energy or 0.0,
        "emissions_kg": last.emissions or 0.0,
        "execution_time_seconds": last.duration or 0.0,
    }
