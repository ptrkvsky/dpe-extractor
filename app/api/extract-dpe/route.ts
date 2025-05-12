import { NextRequest, NextResponse } from "next/server";
import { processDPEFile } from "@/lib/openai";
import { validateDPEData } from "@/lib/utils";
import { ValidationResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été fourni" },
        { status: 400 }
      );
    }

    // Check file type
    if (
      !file.type.startsWith("application/pdf") &&
      !file.type.startsWith("image/")
    ) {
      return NextResponse.json(
        { error: "Le fichier doit être au format PDF ou image" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Process file with OpenAI
    const dpeData = await processDPEFile(buffer, file.name);

    // Validate DPE data
    const errors = validateDPEData(dpeData);

    const result: ValidationResult = {
      data: dpeData,
      errors: errors,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
