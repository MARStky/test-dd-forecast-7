import { type NextRequest, NextResponse } from "next/server"
import { generateResponse } from "@/lib/bedrock-client"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Call Bedrock to generate a response
    const response = await generateResponse(messages)

    return NextResponse.json({
      response,
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Return a fallback response for Amplify deployment
    return NextResponse.json({
      response:
        "I'm currently operating in offline mode. SageMaker Autopilot helps you build ML models without requiring ML expertise by automating algorithm selection and hyperparameter tuning.",
    })
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
