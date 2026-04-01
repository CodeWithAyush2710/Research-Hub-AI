
import asyncio
from agents import AgentCoordinator

class AIProcessor:
    def __init__(self, llm):
        self.coordinator = AgentCoordinator(llm)

    async def process_papers_async(self, papers):
        results = []
        for paper in papers:
            results.append(await self.coordinator.process_paper(paper))
            await asyncio.sleep(5)  # Wait between papers
        return results

    async def process_draft_feedback_async(self, text, filename):
        return await self.coordinator.process_draft_feedback(text, filename)

    async def process_pdf_normal_async(self, text, filename):
        return await self.coordinator.process_pdf_normal(text, filename)

