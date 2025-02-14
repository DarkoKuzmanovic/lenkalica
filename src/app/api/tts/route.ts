import { NextRequest, NextResponse } from "next/server";
import { Communicate } from "edge-tts";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Create a new instance of Communicate
    const communicate = new Communicate();

    // Set voice and other options
    communicate.voice = "en-US-ChristopherNeural";
    communicate.rate = "+0%";
    communicate.volume = "+0%";

    try {
      // Generate audio
      const audioData = await communicate.toStream(text);

      // Return the audio as a blob
      return new NextResponse(audioData, {
        headers: {
          "Content-Type": "audio/mp3",
          "Content-Length": audioData.length.toString(),
        },
      });
    } catch (ttsError) {
      console.error("TTS Generation Error:", ttsError);
      throw new Error("Failed to generate speech");
    }
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate audio",
      },
      { status: 500 }
    );
  }
}
