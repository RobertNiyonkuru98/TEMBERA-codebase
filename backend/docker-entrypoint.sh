#!/bin/sh
set -e

if [ "$SKIP_MIGRATIONS" = "true" ]; then
	echo "Skipping Prisma migrations because SKIP_MIGRATIONS=true"
else
	echo "Running Prisma migrations..."
	npm run migrate:deploy
fi

echo "Starting API server..."
exec "$@"
