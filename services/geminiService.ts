import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizConfig } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (config: QuizConfig): Promise<Question[]> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Generate a quiz with exactly 10 multiple-choice questions.
    Topic: ${config.topic || 'General Knowledge'}
    Difficulty: ${config.difficulty}
    
    Ensure the questions are engaging and accurate.
    Provide 4 options for each question.
    Identify the correct answer index (0-3).
    Provide a brief explanation for the correct answer.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question text" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "An array of 4 possible answers"
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "The index (0-3) of the correct answer" 
              },
              explanation: { 
                type: Type.STRING, 
                description: "A short explanation of why the answer is correct" 
              }
            },
            required: ["text", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini");
    }

    const rawQuestions = JSON.parse(jsonText);
    
    // Map to our internal type and add IDs
    return rawQuestions.map((q: any, index: number) => ({
      id: `q-${index}-${Date.now()}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
};