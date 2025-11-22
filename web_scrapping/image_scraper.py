import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

DATASETS = {
    "dataset_1": {
        "base_url": "https://universe.roboflow.com/kaivlya/dogs-skin-disease-fxh4x/browse?queryText=&pageSize=50&startingIndex=",
        "total_images": 3000
    },
    "dataset_2": {
        "base_url": "https://universe.roboflow.com/dog-skin-disease-dermatosis/dog-skin-disease-dataset/browse?queryText=&pageSize=50&startingIndex=",
        "total_images": 1400
    }
}

SAVE_ROOT = "scraped_images"
os.makedirs(SAVE_ROOT, exist_ok=True)

chrome_options = Options()
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=chrome_options)

def scrape_page(dataset_name, page_url, save_dir):
    driver.get(page_url)
    time.sleep(3)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    return soup.find_all("img")

def scrape_dataset(name, dataset):
    save_dir = os.path.join(SAVE_ROOT, name)
    os.makedirs(save_dir, exist_ok=True)

    total = dataset["total_images"]
    base_url = dataset["base_url"]
    pages = total // 50 + 1

    count = 1

    for p in range(pages):
        start_index = p * 50
        url = f"{base_url}{start_index}"
        print(f"Page {p+1}/{pages}: {url}")

        imgs = scrape_page(name, url, save_dir)

        for img in imgs:
            img_url = img.get("src") or img.get("data-src")
            if not img_url:
                continue

            img_url = urljoin(url, img_url)

            try:
                content = requests.get(img_url, timeout=5).content
                img_path = os.path.join(save_dir, f"img_{count}.jpg")
                with open(img_path, "wb") as f:
                    f.write(content)
                print(f"Saved {img_path}")
                count += 1
            except:
                pass

    print(f"{name} scraping complete. Total saved: {count-1}")

for name, dataset in DATASETS.items():
    scrape_dataset(name, dataset)

driver.quit()
print("All downloads complete.")
