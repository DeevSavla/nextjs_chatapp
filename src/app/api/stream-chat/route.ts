import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const stream = await model.generateContentStream(message);
    
    //translates normal text into bytes 
    const encoder = new TextEncoder();
    
    //pipe that provides data chunk by chunk 
    const responseStream = new ReadableStream({
      //starts when the stream begins - controller starts adding data chunk by chunk 
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
