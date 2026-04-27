# c:\Obsidian\Ethyx\backend\utils\gemini.py
# Gemini 1.5 Flash integration for ETHYX AI
# Dependencies: google-generativeai

from __future__ import annotations

import json
import logging
import os
import re
import asyncio
from typing import Any

import google.generativeai as genai

logger = logging.getLogger("ethyx.gemini")

# Configure once at module load
_API_KEY = os.getenv("GEMINI_API_KEY")
if _API_KEY:
    genai.configure(api_key=_API_KEY)


def parse_gemini_json(raw_text: str) -> dict[str, Any]:
    """
    Parse Gemini response text that may be wrapped in markdown code fences.

    CRITICAL: Never use bare json.loads(response.text).
    Gemini responses frequently include ```json ... ``` fences.
    This function strips them before parsing.

    Args:
        raw_text: Raw response.text from Gemini API.

    Returns:
        Parsed dictionary.

    Raises:
        json.JSONDecodeError: If parsing fails after fence stripping.
    """
    cleaned = raw_text.strip()

    # Strip leading/trailing markdown code fences
    fence_pattern = re.compile(
        r"^```(?:json)?\s*\n?(.*?)\n?\s*```$",
        re.DOTALL,
    )
    match = fence_pattern.match(cleaned)
    if match:
        cleaned = match.group(1).strip()

    return json.loads(cleaned)


async def call_gemini_with_retry(
    prompt: str,
    *,
    model_name: str = "gemini-1.5-flash",
    max_retries: int = 3,
    backoff_base: float = 2.0,
) -> str:
    """
    Call Gemini API with exponential backoff retry logic.

    Args:
        prompt: The text prompt to send.
        model_name: Gemini model identifier.
        max_retries: Maximum number of retry attempts.
        backoff_base: Base for exponential backoff (seconds).

    Returns:
        Raw response text from Gemini.

    Raises:
        Exception: If all retries are exhausted.
    """
    if not _API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY not set. This is a backend-only env var."
        )

    model = genai.GenerativeModel(model_name)
    last_error: Exception = RuntimeError("No attempts made")

    for attempt in range(max_retries):
        try:
            response = await asyncio.to_thread(
                model.generate_content, prompt
            )
            if response.text:
                return response.text
            raise ValueError("Empty response from Gemini")
        except Exception as e:
            last_error = e
            wait_time = backoff_base ** attempt
            logger.warning(
                f"Gemini attempt {attempt + 1}/{max_retries} failed: {e}. "
                f"Retrying in {wait_time:.1f}s..."
            )
            await asyncio.sleep(wait_time)

    logger.error(f"All {max_retries} Gemini attempts failed")
    raise last_error
