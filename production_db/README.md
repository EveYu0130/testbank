# Production Database

## Setting up
- MySQL pre-installed
- Login as `mysql -u[username] -p[password] --local-infile`
- `SET GLOBAL local_infile = 1;`

## Creating the Production Database
- Select the database by `USE [db_name]`
- Run `source path/to/createtables.sql`, which contains the sql script to create the tables.

## Loading data into the Production Database
- The data for each table are stored in .txt files respectively. Run `source path/to/populatetables.sql`, which contains the sql script to load the data from the .txt files into tables. 

## Logging to an output file
- `tee test-production.out`

## Running test script
-  `source test-production.sql`