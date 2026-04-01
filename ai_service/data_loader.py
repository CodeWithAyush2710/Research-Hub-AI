import requests
import xml.etree.ElementTree as ET
import fitz  # PyMuPDF

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

    def extract_text_from_pdf_bytes(self, pdf_bytes: bytes) -> str:
        text = ""
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            print(f"❌ Error extracting PDF: {e}")
            return ""

