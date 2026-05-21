#!/bin/sh
set -e

# Attendre que la DB soit disponible
echo "Waiting for database..."
until pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}"; do
  sleep 1
done

echo "Database ready, running migrations..."
php artisan migrate --force 

echo "Starting PHP-FPM..."
exec "$@"
