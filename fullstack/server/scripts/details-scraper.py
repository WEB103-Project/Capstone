import requests
from lxml import html
import pandas as pd
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import re

def create_robust_session():
    # [Same as in first script]
    session = requests.Session()
    
    retries = Retry(
        total=5,
        backoff_factor=0.5,
        status_forcelist=[500, 502, 503, 504, 404, 403],
    )
    
    adapter = HTTPAdapter(max_retries=retries)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
    ]
    
    session.headers.update({
        'User-Agent': random.choice(user_agents),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    })
    
    return session

def safe_get(url, session=None, max_retries=3):
    # [Same as in first script]
    if session is None:
        session = create_robust_session()
    
    for attempt in range(max_retries):
        try:
            print("Starting request...")
            time.sleep(random.uniform(1, 3))
            
            response = session.get(url)
            response.raise_for_status()
            print(f"Successfully retrieved page on attempt {attempt + 1}")
            return response
            
        except requests.exceptions.RequestException as e:
            print(f"Request error on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise
            time.sleep(random.uniform(5, 10))
    
    return None

def parse_car_url(url):
    # Extract make, model, year, and VIN from URL
    match = re.match(r'^https://www\.edmunds\.com/([a-zA-Z]+)/([a-zA-Z]+)/(\d{4})/vin/([A-HJ-NPR-Z0-9]{17})', url)
    
    if match:
        return {
            'make': match.group(1),
            'model': match.group(2),
            'year': match.group(3),
            'vin': match.group(4)
        }
    return None

def scrape_car_details(url):
    """Scrape details for a single car from its page."""
    session = create_robust_session()
    response = safe_get(url, session)
    
    if response and response.status_code == 200:
        tree = html.fromstring(response.content)
        car_info = parse_car_url(url)
        
        # Extract all the details using xpath
        def safe_xpath_extract(xpath, default="N/A"):
            result = tree.xpath(xpath)
            return result[0] if result else default

        car_data = {
            'url': url,
            'make': car_info['make'] if car_info else "N/A",
            'model': car_info['model'] if car_info else "N/A",
            'year': car_info['year'] if car_info else "N/A",
            'vin': car_info['vin'] if car_info else "N/A",
            'car_short_desc': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[3]/section/div/div[1]/div[2]/text()'),
            'mpg': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[2]/li[1]/div[2]/div/div[1]/text()'),
            'hp': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[2]/li[2]/div[2]/text()'),
            'body_type': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[2]/li[1]/div[2]/div/div[1]/text()'),
            'price_estimate': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[6]/div/div[1]/div/section/div/form/div/div/div/div/div/section/div/div/div/div[1]/div[1]/div[1]/div[1]/div[2]/text()'),
            'seating_capacity': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[2]/li[3]/div[2]/text()'),
            'engine_type': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[1]/li[3]/div[2]/text()'),
            'drivetrain': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[1]/li[5]/div[2]/text()'),
            'mileage': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[1]/li[1]/div[2]/text()'),
            'transmission': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[1]/li[4]/div[2]/text()'),
            'ext_color': safe_xpath_extract('/html/body/div[1]/div/main/div[2]/div[1]/div/div[1]/div[4]/div/div[1]/div/div[1]/section/div/ul[1]/li[2]/div[2]/div/span/span[2]/text()')
        }
        return car_data
    return None

def main():
    try:
        # Read URLs from CSV
        df_urls = pd.read_csv('car_urls.csv')

        if df_urls.empty:
            print("No URLs found in car_urls.csv")
            return
        
        # Get only the first URL
        url = df_urls.iloc[0]['URL']
        print(f"Processing the first URL: {url}")

        car_details = []
        
        print(f"Found {len(df_urls)} URLs to process")
        
        for idx, row in df_urls.iterrows():
            print(f"\nProcessing URL {idx + 1} of {len(df_urls)}")
            url = row['URL']
            car_data = scrape_car_details(url)
            
            if car_data:
                car_details.append(car_data)
                print(f"Successfully scraped data for {car_data['make']} {car_data['model']} {car_data['year']}")
            
            # Add a delay between requests
            time.sleep(random.uniform(2, 5))
        
        # Create DataFrame and save to CSV
        if car_details:
            df_cars = pd.DataFrame(car_details)
            df_cars.to_csv('car_details.csv', index=False)
            print(f"\nSuccessfully saved {len(car_details)} car details to car_details.csv")
        else:
            print("\nNo car details were collected")
        ''' 
        # Scrape car details for the first URL
        car_data = scrape_car_details(url)
        
        if car_data:
            car_details.append(car_data)
            print(f"Successfully scraped data for {car_data['make']} {car_data['model']} {car_data['year']}")
        else:
            print("No data was scraped for the first URL.")
        
        # Create DataFrame and save to CSV if data was collected
        if car_details:
            df_cars = pd.DataFrame(car_details)
            df_cars.to_csv('car_details.csv', index=False)
            print(f"\nSuccessfully saved car details to car_details.csv")
        else:
            print("\nNo car details were collected.")
            '''
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    
if __name__ == "__main__":
    main()