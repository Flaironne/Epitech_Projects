from __future__ import annotations

import sys
import json
import uuid
import select
from pathlib import Path
from urllib.request import urlopen

from app.services.predictor import Predictor


predictor = Predictor()

OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)


def stdin_has_data() -> bool:
    return bool(select.select([sys.stdin], [], [], 0.0)[0])


def predict_line(line: str):
    try:
        sentence_id, sentence = line.split(",", 1)
    except ValueError:
        return f"{line},INVALID", None

    result = predictor.predict(sentence, measure_emissions=True)
    if not result["is_valid"]:
        return f"{sentence_id},INVALID", result

    return f"{sentence_id},{result['departure']},{result['arrival']}", {
        "sentence_id": sentence_id,
        **result
    }


def generate_outputs(lines: list[str]):
    output_txt = []
    output_json = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        txt, details = predict_line(line)
        output_txt.append(txt)
        if details:
            output_json.append(details)

    run_id = uuid.uuid4().hex
    txt_path = OUTPUT_DIR / f"{run_id}.txt"
    json_path = OUTPUT_DIR / f"{run_id}.json"

    txt_path.write_text("\n".join(output_txt), encoding="utf-8")
    json_path.write_text(
        json.dumps(output_json, indent=4, ensure_ascii=False),
        encoding="utf-8"
    )

    print("Generated outputs:")
    print(f"- {txt_path}")
    print(f"- {json_path}")


def read_source(source: str) -> list[str]:
    if source.startswith(("http://", "https://")):
        with urlopen(source) as f:
            return [line.decode("utf-8") for line in f]

    path = Path(source)
    if not path.exists():
        print(f"File not found: {source}", file=sys.stderr)
        sys.exit(1)

    return path.read_text(encoding="utf-8").splitlines()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        generate_outputs(read_source(sys.argv[1]))

    elif not sys.stdin.isatty() and stdin_has_data():
        generate_outputs(list(sys.stdin))

    else:
        print("Tape une phrase (vide pour quitter)")
        while True:
            sys.stdout.write("> ")
            sys.stdout.flush()
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                break
            print(json.dumps(predictor.predict(line, measure_emissions=True), indent=4, ensure_ascii=False))