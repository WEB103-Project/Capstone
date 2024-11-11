import psycopg2
from psycopg2 import sql
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

def connect_to_db():
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


def load_sql_file(file_path):
    with open(file_path, "r") as file:
        sql_commands = file.read().split(";")
    return sql_commands


def run_sql_commands(connection, sql_commands):
    try:
        with connection.cursor() as cursor:
            cursor.execute(sql_commands)
            connection.commit()
            print("Command excecuted successfully ✅")
    except psycopg2.Error as e:
        connection.rollback()
        print(f"❎ Error executing SQL commands: {e}")


def reset_database():
    pass

def upload_data_to_database(connection, sql_commands, dataframes_list):
    pass

def prepare_data_tables(json="car_data.json"):
    
    with open(json, mode="r") as json_file:
        for car in ijson.items(json_file, "item"):
            make = car.get("make")
            model = car.get("model")
            year = car.get("year")
            
            data = car.get("data", {})
            for trim, specs in data.items():
                print(trim)
                time.sleep(1)
        
        json_file.close()

