# 📝 Research Hub AI

## **🔍 Overview**
Research papers are a valuable source of knowledge, but analyzing multiple papers manually is time-consuming. This project leverages AutoGen-based multiple AI agents to fetch, process, and summarize research papers from arXiv in parallel, reducing the effort required to extract key insights.

## **⚙️ Features**
- 📄 **Fetch research papers** from **arXiv**.
- 🧠 **Summarize** research papers using AI.
- 📊 **Analyze research trends** related to the paper.
- ✅ **Extract advantages & disadvantages** of the paper.
- 🔗 **Find citations** and relevant references.
- 💻 **Suggest code implementations** based on the research.

## **🛠️ Tech Stack**
- Python – Core programming language.
- AutoGen – Multi-agent AI framework for collaboration.
- arXiv API – Fetching research papers.
- LangChain – AI processing and summarization.
- asyncio – Ensuring parallel execution.
- React – User-friendly UI for visualization.

## **🚀 Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/CodeWithAyush2710/Research_Paper_Analyzer.git
cd Research_Paper_Analyzer
```
## **2️⃣ Create & Activate Virtual Environment**
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Mac/Linux
python3 -m venv venv
source venv/bin/activate
```
## **3️⃣ Install Dependencies**
```bash
pip install -r requirements.txt
```
## **4️⃣ Set Up API Keys**
- Create a .env file inside the project folder.
- Add your Groq API Key:
```bash
GROQ_API_KEY=your_groq_api_key_here
```
## **5️⃣ Run the Application**
```bash
streamlit run ui.py
```


