import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const stream = await model.generateContentStream(message);

    const encoder = new TextEncoder();
    
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (err) {
          controller.enqueue(encoder.encode("[Error streaming response]"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    return new Response("Error: " + error.message, { status: 500 });
  }
}
