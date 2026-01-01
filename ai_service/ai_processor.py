
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
