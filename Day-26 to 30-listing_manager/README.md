# Listing Manager with Database

Week 6 Day 26 project.

This project sets up a PostgreSQL database model for a simple listing manager.

## Database

Database name:

```text
listing_manager
```

Table name:

```text
listings
```

## Folder Structure

```text
listing_manager
  README.md
  schema.sql
  seed.sql
```

## Files

`schema.sql` creates the `listings` table.

`seed.sql` adds sample listing records.

## Table Columns

The `listings` table has these columns:

```text
id
title
location
price
description
status
created_at
```

`id` is the primary key. It gives every listing one unique number.

## Run From CLI

Open PowerShell from the `Day 26-30` folder.

Run the schema file:

```powershell
psql -U postgres -d listing_manager -f listing_manager\schema.sql
```

Run the seed file:

```powershell
psql -U postgres -d listing_manager -f listing_manager\seed.sql
```

## Test The Database

Connect to the database:

```powershell
psql -U postgres -d listing_manager
```

Inside `psql`, check the table:

```sql
\dt
```

Check the table structure:

```sql
\d listings
```

Check the saved rows:

```sql
SELECT * FROM listings;
```

Count the rows:

```sql
SELECT COUNT(*) FROM listings;
```

## Day 26 Checkpoint

This checkpoint is complete when:

- the `listing_manager` database exists
- the `listings` table exists
- `schema.sql` stores the table plan
- `seed.sql` stores sample data
- `SELECT * FROM listings;` shows the sample rows
