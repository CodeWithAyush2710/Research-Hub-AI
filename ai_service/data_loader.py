import requests
import xml.etree.ElementTree as ET

class DataLoader:
    def __init__(self):
        print("🔍 DataLoader Initialized")

    def fetch_arxiv_papers(self, query):
        url = f"http://export.arxiv.org/api/query?search_query=all:{query}&start=0&max_results=2"
        response = requests.get(url)

        if response.status_code == 200:
            root = ET.fromstring(response.text)
            return [
                {
                    "title": entry.find("{http://www.w3.org/2005/Atom}title").text,
                    "summary": entry.find("{http://www.w3.org/2005/Atom}summary").text,
                    "link": entry.find("{http://www.w3.org/2005/Atom}id").text
                }
                for entry in root.findall("{http://www.w3.org/2005/Atom}entry")
            ]
        return []
