from bs4 import BeautifulSoup
import httpx
import time
import numpy as np
import pandas as pd
import json

df = pd.read_csv("cars.csv")

make = df["make"].str.upper().unique()

# Change this to True if you wanna get everything
GET_EM_ALL = False

# Sample Wikipedia URL
url = "https://en.wikipedia.org/wiki/List_of_automobile_manufacturers"


response = httpx.get(url)
soup = BeautifulSoup(response.content, "html.parser")


automobile_data = {}
unique_makes = set()


for country_heading in soup.find_all("h3"):
    country_name = country_heading.get_text().strip()
    automobile_data[country_name] = {}

    if GET_EM_ALL:
        # Find the next sibling until you reach "Defunct" or another heading
        try:
            while (
                manufacturers_list.find_previous_sibling("div")
                .find("h4")
                .get_text()
                .strip()
                == "Defunct"
            ):
                manufacturers_list = manufacturers_list.find_next_sibling(
                    "div", class_="div-col"
                )
        except Exception as e:
            pass

    manufacturers_list = country_heading.find_next("div", class_="div-col")

    if manufacturers_list:
        for manufacturer in manufacturers_list.find_all("a", href=True):
            manufacturer_name = manufacturer.get_text()

            if not GET_EM_ALL:
                for item in make:
                    if (
                        manufacturer_name.upper().startswith(item)
                        and item.upper() not in unique_makes
                    ):
                        manufacturer_url = (
                            f"https://en.wikipedia.org{manufacturer['href']}"
                        )
                        unique_makes.add(
                            item.upper()
                        )  # Track the first occurrence of the make

                        try:
                            man_res = httpx.get(manufacturer_url)
                            man_soup = BeautifulSoup(man_res.content, "html.parser")
                            table = man_soup.find(
                                "table", class_="infobox ib-company vcard"
                            )
                            img_url = "https://en.wikipedia.org{}".format(
                                table.find("a").get("href")
                            )
                            img_res = httpx.get(img_url)
                            img_soup = BeautifulSoup(img_res.content, "html.parser")
                            img = (
                                img_soup.find("div", class_="fullImageLink")
                                .find("a")
                                .get("href")
                            )
                            img = "https:{}".format(img)
                            print("{} - {}".format(manufacturer_name, img))
                            automobile_data[country_name][manufacturer_name] = img
                        except Exception as e:
                            print(
                                f"Manufacturer {manufacturer_name} doesn't have a logo image"
                            )
                        # time.sleep(1)
                        break
            else:
                manufacturer_url = f"https://en.wikipedia.org{manufacturer['href']}"
                try:
                    man_res = httpx.get(manufacturer_url)
                    man_soup = BeautifulSoup(man_res.content, "html.parser")
                    table = man_soup.find("table", class_="infobox ib-company vcard")
                    img_url = "https://en.wikipedia.org{}".format(
                        table.find("a").get("href")
                    )
                    img_res = httpx.get(img_url)
                    img_soup = BeautifulSoup(img_res.content, "html.parser")
                    img = (
                        img_soup.find("div", class_="fullImageLink")
                        .find("a")
                        .get("href")
                    )
                    img = "https:{}".format(img)
                    print("{} - {}".format(manufacturer_name, img))
                    automobile_data[country_name][manufacturer_name] = img
                except Exception as e:
                    print(f"Manufacturer {manufacturer_name} doesn't have a logo image")


logos = {k: v for k, v in automobile_data.items() if v}

with open("logos_data.json", "w") as json_file:
    json.dump(logos, json_file, indent=4)