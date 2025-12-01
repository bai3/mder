import { GoogleGenAI } from "@google/genai";
import { AIActionType } from "../types";

// Initialize the client. 
// NOTE: In a real app, never expose keys on client side without proxy/guards.
// For this demo, we assume process.env.API_KEY is available or injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateAIResponse = async (
  action: AIActionType,
  selectedText: string,
  fullContext: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing API Key. Please configure process.env.API_KEY.");
  }

  let prompt = "";
  const contextSnippet = fullContext.length > 1000 ? fullContext.substring(0, 1000) + "..." : fullContext;

  switch (action) {
    case AIActionType.CONTINUE:
      prompt = `Continue writing the following markdown text creatively. seamlessly matching the tone and style. \n\nText:\n${selectedText || contextSnippet}`;
      break;
    case AIActionType.SUMMARIZE:
      prompt = `Summarize the following markdown text into a concise paragraph:\n\n${selectedText}`;
      break;
    case AIActionType.FIX_GRAMMAR:
      prompt = `Fix the grammar and spelling of the following text, keeping the markdown formatting intact. Only return the corrected text:\n\n${selectedText}`;
      break;
    case AIActionType.EXPLAIN:
      prompt = `Explain the concepts in the following text simply:\n\n${selectedText}`;
      break;
    case AIActionType.TRANSLATE:
      prompt = `Translate the following text to English (if not already) or Spanish (if English), maintaining markdown structure:\n\n${selectedText}`;
      break;
    default:
      prompt = selectedText;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful writing assistant for a Markdown editor. Always return the response in valid Markdown format without wrapping it in code blocks unless requested.",
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI response.");
  }
};
