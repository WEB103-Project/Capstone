import argparse
import db_updater as dbu


def scrape():
    """Dummy function for scraping data."""
    print("Scraping data...")


def push():
    """Dummy function for pushing data to the database."""
    print("Verifying if json exists")
    try:
        with open("car_data.json", mode="r") as test:
            test.close()
            print("Data Found ✅")
    except Exception as e:
        print(f"Error with json file: {e}")
        print("-------> RUN 'scrape' to hopefully fix the problem")
        exit()
    print("Connecting to Database")
    connection = dbu.connect_to_db()
    if connection is None:
        print("-------> Check your env variables just in case")
        exit()
    print("Preparing Tables")
    dbu.prepare_data_tables(connection)

    print("Pushing data to the database...")


def reset():
    """Function for resetting the database."""
    print("Connecting to Database")
    connection = dbu.connect_to_db()
    if connection is None:
        print("-------> Check your env variables just in case")
        return False

    print("Resetting the database...")
    drop_commands = dbu.load_sql_file("tables/drop-tables.sql")
    print("Dropping tables:")
    for command in drop_commands:
        if command.strip().upper().startswith("DROP TABLE"):
            table_name = command.split("IF EXISTS")[-1].strip().split(" ")[0]
            print(f"Dropping table: {table_name}")
        dbu.run_sql_commands(connection, command)
    print("Dropped all tables ✅")

    gen_commands = dbu.load_sql_file("tables/gen-tables.sql")
    print("Creating tables:")
    for command in gen_commands:
        if command.strip().upper().startswith("CREATE TABLE"):
            table_name = command.split("TABLE IF NOT EXISTS")[-1].strip().split(" ")[0]
            print(f"Creating table: {table_name}")
        dbu.run_sql_commands(connection, command)
    print("Created all tables ✅")

    connection.close()
    return True


def main():
    parser = argparse.ArgumentParser(
        description="The Car Encyclopedia Web Scrapper Tool"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    parser_scrape = subparsers.add_parser(
        "scrape", help="Scrape data from car listings"
    )
    parser_scrape.set_defaults(func=scrape)

    parser_push = subparsers.add_parser(
        "push", help="Push scraped data to the database"
    )
    parser_push.set_defaults(func=push)

    parser_reset = subparsers.add_parser(
        "reset", help="Reset the database to initial state"
    )
    parser_reset.set_defaults(func=reset)

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        exit()
    args.func()


if __name__ == "__main__":
    main()
