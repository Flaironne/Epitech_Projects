IMAGE_NAME := pathfinder_service
PORT := 8000
APP_DIR := /app/app
HOST_APP_DIR := $(PWD)/app

.PHONY: docker-build docker-run docker-shell api api-dev

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
		-v $(HOST_APP_DIR):$(APP_DIR) \
		-v $(HOST_APP_DIR)/data:$(APP_DIR)/data \
		-v $(HOST_APP_DIR)/output:$(APP_DIR)/output \
		-v $(HOST_APP_DIR)/models:$(APP_DIR)/models \
		$(IMAGE_NAME) \
		python3 -m uvicorn app.main:app --host 0.0.0.0 --port $(PORT) --reload --reload-dir $(APP_DIR)