import requests
from lxml import html
import pandas as pd
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import signal
import sys

# Global flag for stopping
should_stop = False

def signal_handler(signum, frame):
    """Handle interrupt signal (Ctrl+C)"""
    global should_stop
    print("\n\nReceived stop signal. Finishing current task and saving progress...")
    should_stop = True

# Register the signal handler
signal.signal(signal.SIGINT, signal_handler)

def create_robust_session():
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

def save_progress(urls, filename='car_urls_progress.csv'):
    """Save current progress to CSV"""
    df = pd.DataFrame(urls, columns=['URL'])
    df.to_csv(filename, index=False)
    print(f"\nProgress saved: {len(urls)} URLs saved to {filename}")

def safe_get(url, session=None, max_retries=3):
    if session is None:
        session = create_robust_session()
    
    for attempt in range(max_retries):
        try:
            if should_stop:
                return None
                
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

def extract_list_items(response):
    """Extract href attributes from the page."""
    urls = []
    
    try:
        tree = html.fromstring(response.content)
        list_items = tree.xpath('/html/body/div[1]/div/div[2]/main/div/div/div[2]/div[1]/ul/li//h2/a')
        print(f"Found {len(list_items)} items")
        
        for item in list_items:
            if should_stop:
                break
                
            href = item.get("href")
            if href:
                full_url = "https://www.edmunds.com" + href
                urls.append(full_url)
                print(f"Found URL: {full_url}")
                
                # Save progress every 5 URLs
                if len(urls) % 5 == 0:
                    save_progress(urls, 'car_urls_partial.csv')
                
    except Exception as e:
        print(f"Error in extraction: {e}")
    
    return urls

def main():
    url = "https://www.edmunds.com/volkswagen/beetle/2012/"
    urls_collected = []
    
    print("Starting scraper... Press Ctrl+C to stop safely")
    
    try:
        session = create_robust_session()
        response = safe_get(url, session)
        
        if response and response.status_code == 200:
            urls_collected = extract_list_items(response)
            
            if not should_stop:
                # Save final results to main file
                save_progress(urls_collected, 'car_urls.csv')
                print(f"\nTotal URLs found: {len(urls_collected)}")
                print("URLs saved to car_urls.csv")
            else:
                print("\nScraping stopped by user")
                
        else:
            print("Failed to retrieve the page")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        
    finally:
        # Always save progress, even if interrupted
        if urls_collected:
            save_progress(urls_collected, 'car_urls_final.csv')
            print("\nFinal save completed")

if __name__ == "__main__":
    main()