IMAGE_NAME := nlp_service
PORT := 8000
APP_DIR := /app
HOST_APP_DIR := $(CURDIR)

.PHONY: docker-build docker-run docker-shell api api-dev cli split train

docker-build:
	docker build -t $(IMAGE_NAME) .

docker-run:
	docker run --rm -p $(PORT):$(PORT) $(IMAGE_NAME)

docker-shell:
	docker run --rm -it -p $(PORT):$(PORT) $(IMAGE_NAME) /bin/sh

api: docker-build docker-run

api-dev: docker-build
	docker run --rm -it \
		-p $(PORT):$(PORT) \
		-v $(HOST_APP_DIR)/app:$(APP_DIR)/app \
		-v $(HOST_APP_DIR)/app/data:$(APP_DIR)/app/data \
		-v $(HOST_APP_DIR)/app/output:$(APP_DIR)/app/output \
		-v $(HOST_APP_DIR)/app/models:$(APP_DIR)/app/models \
		$(IMAGE_NAME) \
		python3 -m uvicorn app.main:app --host 0.0.0.0 --port $(PORT) --reload --reload-dir $(APP_DIR)/app

cli: docker-build
	docker run --rm -i \
		-v $(HOST_APP_DIR)/app/data:/app/data \
		-v $(HOST_APP_DIR)/app/output:/app/output \
		-v $(HOST_APP_DIR)/app/models:/app/models \
		$(IMAGE_NAME) \
		python3 -m app.cli.main $(ARGS)

split: docker-build
	docker run --rm -it \
		-w /app \
		-v $(HOST_APP_DIR):/app \
		-v $(HOST_APP_DIR)/app/output:/app/output \
		-v $(HOST_APP_DIR)/app/data:/app/data \
		-v $(HOST_APP_DIR)/app/models:/app/models \
		$(IMAGE_NAME) \
		python3 -m app.cli.split_chargeur

train: docker-build
	docker run --rm -it \
		-w /app \
		-v $(HOST_APP_DIR):/app \
		-v $(HOST_APP_DIR)/app/output:/app/output \
		-v $(HOST_APP_DIR)/app/data:/app/data \
		-v $(HOST_APP_DIR)/app/models:/app/models \
		$(IMAGE_NAME) \
		python3 -m app.cli.train
