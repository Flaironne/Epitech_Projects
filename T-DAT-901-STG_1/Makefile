DOCKER_COMPOSE = docker compose

APP = app
API = api
KAFKA = kafka
KAFKA2 = kafka2

.PHONY: install
install:
	$(DOCKER_COMPOSE) up -d --build
	$(DOCKER_COMPOSE) run --rm $(API) pnpm install
	$(DOCKER_COMPOSE) run --rm $(APP) pnpm install


.PHONY: start
start:
	$(DOCKER_COMPOSE) up -d
	$(DOCKER_COMPOSE) exec $(API) pnpm install
	$(DOCKER_COMPOSE) exec $(APP) pnpm install

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down

# Voir la liste des topics Kafka
.PHONY: kafka-topics
kafka-topics:
	$(DOCKER_COMPOSE) exec $(KAFKA) kafka-topics --bootstrap-server kafka:9092 --list
	$(DOCKER_COMPOSE) exec $(KAFKA2) kafka-topics --bootstrap-server kafka2:9093 --list

# Lire les messages d’un topic (TOPIC=crypto.raw par exemple)
.PHONY: kafka-read
kafka-read:
	@if [ -z "$(TOPIC)" ]; then \
		echo "❌ Veuillez préciser un topic : make kafka-read TOPIC=xxx"; \
	else \
		$(DOCKER_COMPOSE) exec $(KAFKA) kafka-console-consumer --bootstrap-server kafka:9092 --topic $(TOPIC) --from-beginning; \
		$(DOCKER_COMPOSE) exec $(KAFKA2) kafka-console-consumer --bootstrap-server kafka2:9093 --topic $(TOPIC) --from-beginning; \
	fi

.PHONY: console-api
console-api:
	$(DOCKER_COMPOSE) exec $(API) sh

.PHONY: console-app
console-app:
	$(DOCKER_COMPOSE) exec $(APP) sh

.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f