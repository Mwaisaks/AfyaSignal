# AfyaSignal Data Import

This folder contains production-style sample data as CSV files plus a PostgreSQL import script.

The app no longer inserts demo data automatically on startup. To load sample operational data, run this from the `AfyaSignal` project directory after PostgreSQL is running:

```bash
docker compose up -d db
docker compose exec -T db sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f database/import/import_demo_data.sql'
```

The importer uses stable UUIDs and upserts records, so running it again updates the same rows instead of creating duplicates.

Demo login accounts use password `demo123`:

- `admin@afyasignal.com`
- `chv@afyasignal.com`
- `facility@afyasignal.com`

CSV load order matters because of foreign keys:

1. `users.csv`
2. `facilities.csv`
3. `assessments.csv`
4. `alerts.csv`
