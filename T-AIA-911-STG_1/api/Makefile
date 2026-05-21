.PHONY: help deploy install build-docker dev dump dumpimport seed migrate rollback test lint format

isDocker := $(shell docker info > /dev/null 2>&1 && echo 1)
user := $(shell id -u)
group := $(shell id -g)

api := 
dc := 
de := 
dr := 

ifeq ($(isDocker), 1)
	dc := USER_ID=$(user) GROUP_ID=$(group) docker compose
	de := $(dc) exec
	dr := $(dc) run --rm
	api := $(dr) api
endif

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: vendor/autoload.php
	$(api) composer install --no-dev --optimize-autoloader
	$(api) php artisan cache:clear
	$(api) php artisan config:clear
	$(api) php artisan route:clear
	$(api) php artisan view:clear
	$(api) php artisan migrate --force

build-docker:
	$(dc) build

dev:
	$(dc) up

dump: var/dump
	$(de) db sh -c 'PGPASSWORD=$$DB_PASSWORD pg_dump $$DB_DATABASE -U $$DB_USERNAME > /var/www/var/dump/dump.sql'

dumpimport:
	$(de) db sh -c 'pg_restore -c -d $$DB_DATABASE -U $$DB_USERNAME /var/www/var/dump/dump.sql'

seed:
	$(api) php artisan migrate:fresh --force
	$(api) php artisan db:seed --force

migratefresh:
	$(api) php artisan migrate:fresh --force

migrate:
	$(api) php artisan migrate --force

rollback:
	$(api) php artisan migrate:rollback --force

test:
	$(api) php artisan test

lint:
	$(api) ./vendor/bin/phpstan analyse

format:
	$(api) ./vendor/bin/php-cs-fixer fix