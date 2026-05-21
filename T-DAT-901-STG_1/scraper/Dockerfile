FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    wget curl unzip git \
    chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 6066
CMD ["faust", "-A", "src.main", "worker", "-l", "info"]
