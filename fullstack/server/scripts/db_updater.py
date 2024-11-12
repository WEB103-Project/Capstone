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


def insert_car(connection, make, model, year, specs_id):
    check_command = """
    SELECT id FROM Cars WHERE make = '{}' AND model = '{}' AND year = {} AND specs = {};
    """.format(
        make, model, year, specs_id
    )

    existing_car = run_sql_commands(connection, check_command)

    if existing_car:
        print(
            f"Car with make: {make}, model: {model}, and year: {year} already exists."
        )
        return existing_car

    insert_command = """
    INSERT INTO Cars (make, model, year, specs) VALUES ('{}', '{}', {}, {}) RETURNING id;
    """.format(
        make, model, year, specs_id
    )

    print(f"Inserting new car: {make} {model} {year}")
    return run_sql_commands(connection, insert_command)


def insert_make(connection, logo, country, make):
    check_command = """
    SELECT id FROM CarLogos WHERE logo = '{}' AND country = '{}' AND make = '{}';
    """.format(
        logo, country, make
    )

    existing = run_sql_commands(connection, check_command)

    if existing:
        print("Car Logo already exists.")
        return existing

    command = """
    INSERT INTO CarLogos (logo, country, make)
    VALUES ('{}', '{}', '{}') RETURNING id;
    """.format(
        logo, country, make
    )
    return run_sql_commands(connection, command)


def insert_space_volume(connection, cargo, fhr, flr, fsr, cw, ow, ol):
    check_command = """
    SELECT id FROM SpaceVolume WHERE cargo_capacity = {} AND front_head_room = {} AND front_leg_room = {} AND front_shoulder_room = {} AND curb_weight = {} AND overall_width = {} AND overall_length = {};
    """.format(
        cargo, fhr, flr, fsr, cw, ow, ol
    )

    existing = run_sql_commands(connection, check_command)

    if existing:
        print("Volume already exists.")
        return existing

    command = """
    INSERT INTO SpaceVolume (cargo_capacity, front_head_room, front_leg_room, front_shoulder_room, curb_weight, overall_width, overall_length)
    VALUES ({}, {}, {}, {}, {}, {}, {})
    RETURNING id;
    """.format(
        cargo, fhr, flr, fsr, cw, ow, ol
    )
    return run_sql_commands(connection, command)


def insert_performance(connection, hp, torq, eng):
    check_command = """
    SELECT id FROM Performance WHERE horsepower = '{}' AND torque = '{}' AND engine = '{}';
    """.format(
        hp, torq, eng
    )

    existing = run_sql_commands(connection, check_command)

    if existing:
        print("Performance already exists.")
        return existing

    command = """
    INSERT INTO Performance (horsepower, torque, engine)
    VALUES ('{}', '{}', '{}')
    RETURNING id;
    """.format(
        hp, torq, eng
    )
    return run_sql_commands(connection, command)


def insert_mileage(connection, city, highway):
    check_command = """
    SELECT id FROM Mileage WHERE city = {} AND highway = {};
    """.format(
        city, highway
    )

    existing = run_sql_commands(connection, check_command)

    if existing:
        print("Mileage already exists.")
        return existing

    command = """
    INSERT INTO Mileage (city, highway)
    VALUES ({}, {})
    RETURNING id;
    """.format(
        city, highway
    )
    return run_sql_commands(connection, command)


def insert_pictures(connection, picture_gal: list, car_id):
    command = """
    INSERT INTO CarGalleries (car_id) VALUES ({}) RETURNING id;
    """.format(
        car_id
    )
    gallery_id = run_sql_commands(connection, command)
    if gallery_id is None:
        return
    pic_list = []
    for i in picture_gal:
        command = """
        INSERT INTO Pictures (url, gallery_id)
        VALUES ({}, {})
        RETURNING id;
        """.format(
            i, gallery_id[0][0]
        )
        pic_list.append(run_sql_commands(connection, command))


def insert_car_specs(
    connection,
    performance_id,
    mileage_id,
    volume_id,
    seats,
    wheel,
    capacity,
    drivetrain,
    transmission,
):
    check_command = """
    SELECT id FROM CarSpecs WHERE performance = {} AND mileage = {} AND volume = {} AND seats = {} 
    AND wheel_base = {} AND towing_capacity = {} AND drivetrain = '{}' AND transmission = '{}';
    """.format(
        performance_id,
        mileage_id,
        volume_id,
        seats,
        wheel,
        capacity,
        drivetrain,
        transmission,
    )

    # Run the check command with parameters
    existing = run_sql_commands(connection, check_command)

    if existing:
        print("Car Specs already exists.")
        return existing

    command = """
    INSERT INTO CarSpecs
    (performance, mileage, volume, seats, wheel_base, towing_capacity, drivetrain, transmission)
    VALUES ({}, {}, {}, {}, {}, {}, '{}', '{}')
    RETURNING id;
    """.format(
        performance_id,
        mileage_id,
        volume_id,
        seats,
        wheel,
        capacity,
        drivetrain,
        transmission,
    )

    # Run the insert command with parameters
    return run_sql_commands(connection, command)


def prepare_data_tables(
    connection,
):
    json_car = "car_data.json"
    json_logo = "logos_data.json"

    get_numbers: callable[[str], str | list[str] | None] = lambda value, single=True: (
        ((r := re.findall(r"\d*\.?\d+", value))[0] if single else r)
        if isinstance(value, str)
        else None
    )

    format = lambda make: " ".join(
        [word if word.isupper() else word.title() for word in make.split()]
    ).replace("-", " ")

    with open(json_logo, mode="r", encoding="utf-8") as json_file:
        for country in ijson.items(json_file, ""):
            for trim, make_dict in country.items():
                for make in make_dict.items():
                    # print("{} - {} -=-=-= {}".format(trim, make[0], make[1]))
                    insert_make(connection, make[1], trim, make[0])
        json_file.close()

    with open(json_car, mode="r") as json_file:
        for car in ijson.items(json_file, "item"):

            make = format(car.get("make"))
            model = format(car.get("model"))
            year = car.get("year")

            data = car.get("data", {})
            car_specs = {}
            body_types = []
            pics = []
            for trim, specs in data.items():
                if "Dimensions, Weights & Capacities" == trim:
                    if specs.get("Truck Bed Volume"):
                        car_specs["cargo"] = get_numbers(specs.get("Truck Bed Volume"))
                    elif specs.get("Trunk or Cargo Capacity"):
                        car_specs["cargo"] = get_numbers(
                            specs.get("Trunk or Cargo Capacity")
                        )
                    else:
                        car_specs["cargo"] = 0
                    car_specs["fhr"] = get_numbers(specs.get("Front Head Room"))
                    car_specs["flr"] = get_numbers(specs.get("Front Leg Room"))
                    car_specs["fsr"] = get_numbers(specs.get("Front Shoulder Room"))
                    car_specs["cw"] = get_numbers(specs.get("Curb Weight"))
                    car_specs["ow"] = get_numbers(specs.get("Width with mirrors"))
                    car_specs["ol"] = get_numbers(specs.get("Overall Length"))
                    car_specs["wb"] = get_numbers(specs.get("Wheel Base"))
                    car_specs["ms"] = get_numbers(specs.get("Max Seating Capacity"))
                if "Fuel Economy" == trim:
                    car_specs["mpg_city"] = get_numbers(specs.get("City", 0))
                    car_specs["mpg_highway"] = get_numbers(specs.get("Highway", 0))
                elif "Exterior" == trim:
                    car_specs["doors"] = get_numbers(specs.get("Number of Doors"))
                elif "Performance" == trim:
                    car_specs["hp"] = specs.get("Horsepower")
                    car_specs["torque"] = specs.get("Torque")
                    car_specs["engine"] = specs.get("Engine")
                elif "Mechanical" == trim:
                    car_specs["drivetrain"] = specs.get("Drivetrain").upper()
                    car_specs["transmission"] = specs.get("Transmission Type").upper()
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
                elif "gallery" == trim:
                    for i in specs.items():
                        pics.append(i)

            mileage_id = insert_mileage(
                connection,
                car_specs.get("mpg_city", 0),
                car_specs.get("mpg_highway", 0),
            )
            if mileage_id:
                mileage_id = mileage_id[0][0]
            performance_id = insert_performance(
                connection,
                car_specs.get("hp"),
                car_specs.get("torque"),
                car_specs.get("engine"),
            )
            if performance_id:
                performance_id = performance_id[0][0]
            space_volume_id = insert_space_volume(
                connection,
                car_specs.get("cargo"),
                car_specs.get("fhr"),
                car_specs.get("flr"),
                car_specs.get("fsr"),
                car_specs.get("cw"),
                car_specs.get("ow"),
                car_specs.get("ol"),
            )
            if space_volume_id:
                space_volume_id = space_volume_id[0][0]

            specs_id = insert_car_specs(
                connection,
                performance_id,
                mileage_id,
                space_volume_id,
                car_specs["ms"],
                car_specs["wb"],
                car_specs["cargo"],
                car_specs["drivetrain"],
                car_specs["transmission"],
            )
            if specs_id:
                specs_id = specs_id[0][0]
            car_id = insert_car(connection, make, model, year, specs_id)
            if car_id:
                car_id = car_id[0][0]
            print(car_id)

            insert_pictures(connection, pics, car_id)

        json_file.close()
