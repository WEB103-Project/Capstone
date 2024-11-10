import json
import bs4
import httpx
from bs4 import BeautifulSoup
import pandas as pd
import time
import sys
import csv
import re
import base64


# Load car data from the CSV
input_csv = "cars.csv"
output_json = "car_data.json"

# List to hold the extracted data
data = []

MAX_RETRIES = 3
TIMEOUT = 10

# Open in write mode to clear any existing data
with open(output_json, "w") as json_file:
    json.dump([], json_file)

with open(input_csv, mode="r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        make = row["make"].lower().replace(" ", "-")
        model = row["model"].lower().replace(" ", "-")
        year = row["year"]
        print(f"{make} {model} {year}")
        url = f"https://www.kbb.com/{make}/{model}/{year}/"
        print(url)

        r = httpx.get(url, timeout=TIMEOUT)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            try:
                info_dict = {}
                img_dict = {}
                # print(soup.find_all("img", class_="carousel-image css-ionjye"))
                for index, img in enumerate(
                    soup.find_all("img", class_="carousel-image css-ionjye")
                ):
                    # print(img)
                    if img and "src" in img.attrs:
                        p_img = re.sub(r'\?downsize=.*', '', img["src"])
                        r_img = httpx.get(p_img, timeout=TIMEOUT)
                        if r_img.status_code == 200:
                            image_base64 = base64.b64encode(r_img.content).decode('utf-8')
                            # image_base64 = base64.b64encode(r_img).decode('utf-8')
                            img_dict[index] = image_base64
                print(img_dict)
                info_dict["gallery"] = img_dict
                # Loop through each main section, identified by a specific header tag (e.g., h3)
                for section in soup.find_all("h3", class_="css-1veroe6"):
                    section_name = section.get_text(strip=True)
                    info_dict[section_name] = {}

                    # Find the corresponding table within each section
                    table = section.find_next("table", class_="css-1bdywq1")

                    if table:
                        for row in table.find_all("tr"):
                            # Extract the row header (th) and value (td)
                            attribute = row.find("th", class_="css-qjbpo8")
                            value = row.find("td", class_="css-irk93x")

                            if attribute and value:
                                attribute_name = attribute.get_text(strip=True)
                                attribute_value = value.get_text(strip=True)

                                # Store each attribute-value pair in the dictionary
                                info_dict[section_name][
                                    attribute_name
                                ] = attribute_value
                # print(info_dict)
                with open(output_json, "r+") as json_file:
                    data = json.load(json_file)
                    data.append(
                        {"make": make, "model": model, "year": year, "data": info_dict}
                    )
                    json_file.seek(0)
                    json.dump(data, json_file, indent=4)
                    # print("retries", retries)
            except Exception as e:
                # retries += 1
                print("Timeout")
                # print(f"Timeout occurred. Retrying {retries}/{MAX_RETRIES}...")
                time.sleep(1)  # Optional delay between retries
                # if MAX_RETRIES - retries == 0:
                #     break
            time.sleep(0.5)
    # Convert to JSON and save to a file

    file.close()