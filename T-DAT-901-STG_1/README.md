# Projet Crypto-Viz

Crypto Viz est une application web en temps réel destinée aux passionnés et analystes de cryptomonnaies. Elle collecte automatiquement des données financières, les traite pour générer des analyses, et les visualise dynamiquement pour suivre l’évolution des marchés.

## Installation

Installer le projet à l'aide de docker

```bash
  make install
```

Note: le scraper peut mettre plusieurs minutes à s'executer la première fois

Visualiser les topics kafka 

```bash
  make kafka-topics
```

Visualiser les données d'un topic kafka 

```bash
  make kafka-read TOPIC=***
```

Consulter les logs

```bash
  make logs
```

# Architecture

```mermaid
flowchart LR
    %% Styles
    classDef service fill:#D5E8FF,stroke:#2A76DD,stroke-width:2px,color:#000
    classDef kafka fill:#FFE4B5,stroke:#D88A00,stroke-width:2px,color:#000
    classDef topic fill:#FFF7D6,stroke:#C2A200,stroke-width:1.5px,color:#000
    classDef frontend fill:#E8FFD5,stroke:#58A000,stroke-width:2px,color:#000
    classDef websocket fill:#E3E3FF,stroke:#6A6AD8,stroke-width:1.5px,color:#000

    %% --- SERVICES ---
    A[Scraper\nPython + Selenium]:::service
    C[Cleaner\nPython Processing]:::service
    E[Backend\nAPI REST + WebSocket]:::service
    F[Frontend\nWebApp]:::frontend

    %% --- KAFKA ZONE ---
    subgraph KZ[Kafka Cluster]
        direction TB
        B((Producer → raw_topic)):::kafka
        T1[raw_topic]:::topic
        C2((Producer → cleaned_topic)):::kafka
        T2[cleaned_topic]:::topic
    end

    %% --- FLOWS ---
    A -->|Produce Raw Data| B
    B --> T1
    T1 -->|Consume Raw Data| C
    C -->|Produce Cleaned Data| C2
    C2 --> T2
    T2 -->|Consume Clean Data| E
    E -->|WebSocket\nLive Updates| F:::websocket

```
