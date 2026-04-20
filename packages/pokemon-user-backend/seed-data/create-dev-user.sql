DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'pokemon'
    ) THEN
      CREATE DATABASE pokemon OWNER admin;
    END IF;
  END
$$;

DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin'
    ) THEN
      CREATE ROLE admin WITH LOGIN PASSWORD 'admin' SUPERUSER;
    END IF;
  END
$$;
