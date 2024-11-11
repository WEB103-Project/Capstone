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
    dbu.prepare_data_tables()
    
    
    print("Pushing data to the database...")
    


def reset():
    """Dummy function for resetting the database."""
    print("Connecting to Database")
    connection = dbu.connect_to_db()
    if connection is None:
        print("-------> Check your env variables just in case")
    print("Resetting the database...")
    commands = dbu.load_sql_file("tables/drop-tables.sql")
    for command in commands:
        dbu.run_sql_commands(connection, command)
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
