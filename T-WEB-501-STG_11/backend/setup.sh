#!/bin/bash

env_db () {
	echo -e "  Database name [\e[0;33mnull\e[0m]"
	printf '> '
	read DB_DATABASE
	echo -e "\n  Username [\e[0;33mnull\e[0m]"
	printf '> '
	read DB_USERNAME
	echo -e "\n  Password [\e[0;33mnull\e[0m]"
	printf '> '
	read DB_PASSWORD
}

make_env () {
	echo -e "\n[\e[0;35m Database configuration \e[0m]\n"
	env_db;
	ENV="DB_DATABASE DB_USERNAME DB_PASSWORD"
	for ENV_VAR in ${ENV}; do
		# If the variable contains /, replace it with \/ to escape it
		VALUE=$(echo ${!ENV_VAR} | sed 's/\//\\\//g')
		sed -i "s/$ENV_VAR=.*/$ENV_VAR=${VALUE}/" .env
	done
}

environment () {
	cp .env.example .env
	php artisan key:generate > /dev/null 2>&1
	php artisan storage:link > /dev/null 2>&1
	make_env;
  sudo chown -R $(whoami):www-data public/ storage/ bootstrap/
}

setup () {
	rm -rf .env
	clear
	echo -e "\n[\e[0;32m START SETUP \e[0m]"
	echo -e "\n[\e[0;35m Installing composer dependencies \e[0m]"
	composer install --dev > /dev/null 2>&1
	echo -e "\n[\e[0;35m Setup environment \e[0m]"
	environment;
	echo -e "\n[\e[0;35m Migrate database \e[0m]"
	php artisan migrate:fresh --seed > /dev/null 2>&1
	if [ $? -eq 0 ]; then
		echo -e "\n[\e[0;32m MIGRATION COMPLETED \e[0m]"
	else
		echo -e "\n[\e[0;31m MIGRATION FAILED \e[0m]"
	fi
}

setup;

echo -e "\n[\e[0;32m SETUP COMPLETED \e[0m]\n"