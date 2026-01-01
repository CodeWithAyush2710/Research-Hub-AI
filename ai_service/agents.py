
import asyncio
import logging
from langchain_core.messages import SystemMessage, HumanMessage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RATE_LIMIT_DELAY = 2  # seconds between requests

class BaseAgent:
    def __init__(self, name, llm):
        self.name = name
        self.llm = llm
        self.message_queue = asyncio.Queue()
        logger.info(f"Agent {self.name} initialized.")

    async def send_message(self, recipient, message):
        await recipient.message_queue.put({'from': self.name, 'content': message})
        logger.info(f"{self.name} sent message to {recipient.name}")

    async def receive_message(self):
        message = await self.message_queue.get()
        logger.info(f"{self.name} received message from {message['from']}")
        return message


class SummaryAgent(BaseAgent):
    async def process(self, paper):
        logger.info(f"{self.name} summarizing paper: {paper['title']}")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="Provide a concise summary of the research paper:"),
            HumanMessage(content=paper["summary"])
        ]
        response = await self.llm.ainvoke(messages)
        return {'summary': response.content.strip()}


class KeyFindingsAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} extracting key findings.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="List the main findings and conclusions in bullet points:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'key_findings': response.content.strip()}


class TrendsAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} analyzing trends.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="Analyze current and emerging research trends:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'trends': response.content.strip()}


class AdvantagesDisadvantagesAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} evaluating advantages and disadvantages.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="Critically evaluate the strengths and limitations of this research paper in bullet points:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'advantages_disadvantages': response.content.strip()}


class RelatedWorkAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} analyzing related work.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="Explain how this paper situates itself in the broader research landscape:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'related_work': response.content.strip()}


class CodeImplementationAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} suggesting code implementations.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="Suggest algorithms, pseudocode, or implementation ideas based on the paper:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'code_implementations': response.content.strip()}


class CitationsReferencesAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} extracting citations and references.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="List important cited works or related papers with context:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'citations_references': response.content.strip()}


class RecommendationAgent(BaseAgent):
    async def process(self, summary):
        logger.info(f"{self.name} suggesting future work.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        messages = [
            SystemMessage(content="Suggest future research directions:"),
            HumanMessage(content=summary)
        ]
        response = await self.llm.ainvoke(messages)
        return {'future_work': response.content.strip()}


class JudgeAgent(BaseAgent):
    async def process(self, original_text, generated_summary):
        logger.info(f"{self.name} evaluating summary quality.")
        await asyncio.sleep(RATE_LIMIT_DELAY)

        prompt = f"""
        You are an expert judge evaluating a text summarization system.
        
        Original Text:
        {original_text}
        
        Generated Summary:
        {generated_summary}
        
        Evaluate the Generated Summary on the following two metrics (0-5 score):
        
        1. Faithfulness: Does the summary strictly adhere to the original text without adding false information?
        2. Clarity: Is the summary easy to read, coherent, and well-structured?
        
        Return your response in this JSON format ONLY:
        {{
            "faithfulness_score": <int>,
            "faithfulness_reasoning": "<string>",
            "clarity_score": <int>,
            "clarity_reasoning": "<string>"
        }}
        """

        messages = [
            SystemMessage(content="You are an impartial evaluator of AI-generated text."),
            HumanMessage(content=prompt)
        ]
        
        response = await self.llm.ainvoke(messages)
        return {'evaluation': response.content.strip()}


class AgentCoordinator:
    def __init__(self, llm):
        self.summary_agent = SummaryAgent("SummaryAgent", llm)
        self.key_findings_agent = KeyFindingsAgent("KeyFindingsAgent", llm)
        self.trends_agent = TrendsAgent("TrendsAgent", llm)
        self.advantages_disadvantages_agent = AdvantagesDisadvantagesAgent("AdvantagesDisadvantagesAgent", llm)
        self.related_work_agent = RelatedWorkAgent("RelatedWorkAgent", llm)
        self.code_implementation_agent = CodeImplementationAgent("CodeImplementationAgent", llm)
        self.citations_references_agent = CitationsReferencesAgent("CitationsReferencesAgent", llm)
        self.recommendation_agent = RecommendationAgent("RecommendationAgent", llm)

    async def process_paper(self, paper):
        logger.info(f"Coordinator: Processing paper '{paper['title']}'")

        summary_result = await self.summary_agent.process(paper)
        summary = summary_result["summary"]

        key_findings = await self.key_findings_agent.process(summary)
        trends = await self.trends_agent.process(summary)
        adv_dis = await self.advantages_disadvantages_agent.process(summary)
        related = await self.related_work_agent.process(summary)
        code_impl = await self.code_implementation_agent.process(summary)
        citations = await self.citations_references_agent.process(summary)
        future = await self.recommendation_agent.process(summary)

        logger.info(f"Coordinator: Finished '{paper['title']}'")

        return {
            "title": paper["title"],
            "link": paper["link"],
            "original_abstract": paper["summary"], # Preserve original abstract
            "summary": summary,
            "key_findings": key_findings['key_findings'],
            "trends": trends['trends'],
            "advantages_disadvantages": adv_dis['advantages_disadvantages'],
            "related_work": related['related_work'],
            "code_implementations": code_impl['code_implementations'],
            "citations_references": citations['citations_references'],
            "future_work": future['future_work'],
        }
