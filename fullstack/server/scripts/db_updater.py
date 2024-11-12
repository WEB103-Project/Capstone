import re
from typing import List, Optional, Union
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import connection

import os
from dotenv import load_dotenv
import ijson
import time

load_dotenv()

DB_HOST = os.getenv("PGHOST")
DB_NAME = os.getenv("PGDATABASE")
DB_USER = os.getenv("PGUSER")
DB_PASSWORD = os.getenv("PGPASSWORD")
DB_PORT = os.getenv("PGPORT")


def connect_to_db() -> Optional[connection]:
    print(DB_PORT)
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
        )
        print("Connection Successful ✅")
        return connection
    except psycopg2.Error as e:
        print(f"❎ Error connecting to database: {e}")
        return None


def load_sql_file(file_path: str) -> List[str]:
    with open(file_path, "r") as file:
        sql_commands = re.split(r";\s*(?![^$$]*\$\$)", file.read())
    return [cmd.strip() for cmd in sql_commands if cmd.strip()]


def run_sql_commands(
    connection: connection, sql_commands: str
) -> Union[bool, List[tuple], int, None]:
    try:
        with connection.cursor() as cursor:
            cursor.execute(sql_commands)

            if cursor.description:
                # If the command is a `SELECT`, fetch all results
                results = cursor.fetchall()
                print("Query results:", results)
            elif sql_commands.strip().upper().startswith("INSERT"):
                # For `INSERT`, return the ID of the inserted row if applicable
                results = cursor.fetchone()[0] if cursor.rowcount > 0 else None
                print("Inserted ID:", results)
            else:
                # For other commands like `UPDATE` or `DELETE`, return row count
                results = cursor.rowcount
                print(f"Rows affected: {results}")
            connection.commit()
            print("Command executed successfully ✅")
            return results

    except psycopg2.Error as e:
        connection.rollback()
        print(f"❎ Error executing SQL commands: {e}")
        return None


def upload_data_to_database(connection, sql_commands, dataframes_list):
    pass


def insert_car(connection, make, model, year):
    check_command = """
    SELECT id FROM Cars WHERE make = '{}' AND model = '{}' AND year = {};
    """.format(
        make, model, year
    )

    existing_car = run_sql_commands(connection, check_command)

    if existing_car:
        print(
            f"Car with make: {make}, model: {model}, and year: {year} already exists."
        )
        return existing_car

    insert_command = """
    INSERT INTO Cars (make, model, year) VALUES ('{}', '{}', {}) RETURNING id;
    """.format(
        make, model, year
    )

    print(f"Inserting new car: {make} {model} {year}")
    return run_sql_commands(connection, insert_command)


def insert_space_volume(connection, cargo, fhr, flr, fsr, cw, ow, ol):
    command = """
    INSERT INTO SpaceVolume (cargo_capacity, front_head_room, front_leg_room, front_shoulder_room, curb_weight, overall_width, overall_length)
    VALUE ({}, {}, {}, {}, {}, {}, {})
    RETURNING id;
    """.format(
        cargo, fhr, flr, fsr, cw, ow, ol
    )
    run_sql_commands(connection, command)


def insert_performance(connection, hp, torq, eng):
    command = """
    INSERT INTO Performance (horsepower, torque, engine)
    VALUES ({}, {}, {})
    RETURNING id;
    """.format(
        hp, torq, eng
    )
    run_sql_commands(connection, command)


def insert_mileage(connection, city, highway):
    command = """
    INSERT INTO Performance (city, highway)
    VALUES ({}, {})
    RETURNING id;
    """.format(
        city, highway
    )
    run_sql_commands(connection, command)


def insert_pictures(connection, picture_gal: list, car_id):
    command = """
    INSERT INTO CarGalleries (car_id) VALUES ({}) RETURNING id;
    """.format(
        car_id
    )
    gallery_id = run_sql_commands(connection, command)
    if gallery_id is None:
        return
    for i in picture_gal:
        command = """
        INSERT INTO Pictures (url, gallery_id)
        VALUES ({}, {})
        RETURNING id;
        """.format(
            i, gallery_id
        )
        run_sql_commands(command, command)


# def insert_car_specs(connection, specs):

#     insert_performance(
#         connection,
#     )

#     command = """
#     INSERT INTO CarSpecs
#     (performance, mileage, volume, seats, wheel_base, towing_capacity, drivetrain, transmission)
#     VALUES ({}, {}, {}, {}, {}, {}, {}, {})
#     RETURNING id;
#     """.format(
#         performance,
#         mileage,
#         volume,
#         specs["wheel_base"],
#         specs["capacity"],
#         specs["drivetrain"],
#         specs["transmission"],
#     )


def prepare_data_tables(connection, json="car_data.json"):
    get_numbers: callable[[str], str | list[str] | None] = lambda value, single=True: (
        ((r := re.findall(r"\d*\.?\d+", value))[0] if single else r)
        if isinstance(value, str)
        else None
    )

    with open(json, mode="r") as json_file:
        for car in ijson.items(json_file, "item"):

            make = car.get("make")
            model = car.get("model")
            year = car.get("year")

            data = car.get("data", {})
            car_specs = {}
            body_types = []
            for trim, specs in data.items():
                print(trim)
                if "Dimensions, Weights & Capacities" == trim:
                    car_specs["cargo"] = get_numbers(specs["Trunk or Cargo Capacity"])
                    car_specs["fhr"] = get_numbers(specs["Front Head Room"])
                    car_specs["flr"] = get_numbers(specs["Front Leg Room"])
                    car_specs["fsr"] = get_numbers(specs["Front Shoulder Room"])
                    car_specs["cw"] = get_numbers(specs["Curb Weight"])
                    car_specs["ow"] = get_numbers(specs["Width with mirrors"])
                    car_specs["ol"] = get_numbers(specs["Overall Length"])
                    car_specs["wb"] = get_numbers(specs["Wheel Base"])
                if "Fuel Economy" == trim:
                    car_specs["mpg_city"] = get_numbers(specs["City"])
                    car_specs["mpg_highway"] = get_numbers(specs["Highway"])
                elif "Exterior" == trim:
                    car_specs["doors"] = get_numbers(specs["Number of Doors"])
                elif "Performance" == trim:
                    car_specs["hp"] = specs["Horsepower"]
                    car_specs["torque"] = specs["Torque"]
                    car_specs["engine"] = specs["Engine"]
                elif "Mechanical" == trim:
                    car_specs["drivetrain"] = specs["Drivetrain"].upper()
                    car_specs["transmission"] = specs["Transmission Type"].upper()
                elif any(
                    item in trim.lower()
                    for item in [
                        "sedan",
                        "coupe",
                        "hatchback",
                        "roadster",
                        "convertible",
                        "long bed",
                        "short bed",
                        "minivan",
                        "van",
                        "utility",
                    ]
                ):
                    body_types.append(trim)
            time.sleep(1)

            car_id = insert_car(connection, make, model, year)

        json_file.close()
