run:
	docker compose -f tools/compose/simple.yml up -d --force-recreate --build

develop:
	docker compose -f tools/compose/development.yml --env-file .env -p reactive-resume up -d
	