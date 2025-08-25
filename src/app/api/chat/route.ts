import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);

    return new Response(
      JSON.stringify({
        response: result.response.text(),
      })
    );
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send response",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
