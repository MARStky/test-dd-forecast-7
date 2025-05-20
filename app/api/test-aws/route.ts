import { NextResponse } from "next/server"
import { getS3Client } from "@/lib/aws-config"
import { ListBucketsCommand } from "@aws-sdk/client-s3"

export async function GET() {
  try {
    console.log("Testing AWS connectivity...")

    // Log environment variables (without exposing secrets)
    console.log("Environment check:")
    console.log("- AWS_REGION:", process.env.AWS_REGION)
    console.log("- DATA_BUCKET:", process.env.DATA_BUCKET)
    console.log("- Has AWS_ACCESS_KEY_ID:", !!process.env.AWS_ACCESS_KEY_ID)
    console.log("- Has AWS_SECRET_ACCESS_KEY:", !!process.env.AWS_SECRET_ACCESS_KEY)

    // Test S3 connectivity
    const s3Client = getS3Client()
    const response = await s3Client.send(new ListBucketsCommand({}))

    return NextResponse.json({
      success: true,
      message: "AWS connection successful",
      buckets: response.Buckets?.map((bucket) => bucket.Name) || [],
      region: process.env.AWS_REGION,
      dataBucket: process.env.DATA_BUCKET,
    })
  } catch (error) {
    console.error("AWS connectivity test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : "Unknown",
        region: process.env.AWS_REGION,
        dataBucket: process.env.DATA_BUCKET,
      },
      { status: 500 },
    )
  }
}
