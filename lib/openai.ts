import { corrigerClassements, DpeResult } from "@/utils/dpeUtils";
import OpenAI from "openai";

// Function to extract JSON from GPT's response
function extractJsonFromGPT(text: string): any | null {
  try {
    // Clean up OpenAI-style annotations
    const cleaned = text.replace(/【[\d:†a-zA-Z.\-_]+】/g, "").trim();

    // Find JSON block in text
    const jsonMatch = cleaned.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      console.warn("⚠️ No JSON found in GPT text.");
      return null;
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("❌ Error extracting JSON:", error);
    return null;
  }
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Process DPE file through OpenAI
export async function processDPEFile(fileBuffer: Buffer, fileName: string) {
  try {
    // Upload file to OpenAI
    const blob = new Blob([fileBuffer]);
    const file = new File([blob], fileName);

    const uploadedFile = await openai.files.create({
      file,
      purpose: "assistants",
    });

    console.log("📄 File uploaded:", uploadedFile.id);

    // Create assistant
    const assistant = await openai.beta.assistants.create({
      name: "DPE Extractor",
      instructions: `
Tu es un assistant qui lit un PDF ou une image de Diagnostic de Performance Énergétique (DPE) 
et extrait les données importantes. Rends UNIQUEMENT un JSON valide sans aucun 
texte d'explication, sans markdown, sans backticks, sans commentaire. Juste le JSON brut.
Le JSON doit contenir les champs suivants :
- adresse: l'adresse complète du bien immobilier
- type_bien: le type de bien (maison, appartement, etc.)
- date_realisation: la date de réalisation du DPE au format ISO (YYYY-MM-DD)
- date_validite: la date de fin de validité du DPE au format ISO (YYYY-MM-DD)
- consommation_energetique: la valeur numérique de la consommation d'énergie (kWh/m²/an)
- classe_energetique : lettre A à G, **prioriser la lettre visuellement affichée**
- emissions_co2: la valeur numérique des émissions de gaz à effet de serre (kg CO₂/m²/an)
- classe_ges : lettre A à G, **prioriser la lettre visuellement affichée**
- cout_energetique_estime: un objet avec deux propriétés min et max (en euros)

Exemple:
{
  "adresse": "123 rue de la Paix, 75001 Paris",
  "type_bien": "Appartement",
  "date_realisation": "2023-06-15",
  "date_validite": "2033-06-15",
  "consommation_energetique": 250,
  "classe_energetique": "E",
  "emissions_co2": 45,
  "classe_ges": "D",
  "cout_energetique_estime": {
    "min": 1200,
    "max": 1800
  }
}
`,
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      model: "gpt-4o",
    });

    // Create thread and message with file
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content:
        "Voici un DPE à analyser. Merci de me retourner les données en JSON.",
      attachments: [
        {
          file_id: uploadedFile.id,
          tools: [{ type: "file_search" }],
        },
      ],
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Poll until completion
    let runStatus = await pollRunStatus(thread.id, run.id);

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastAssistantMessage: any = messages.data.find(
      (msg) => msg.role === "assistant"
    );

    if (!lastAssistantMessage || !lastAssistantMessage.content[0]?.text) {
      throw new Error("No response from assistant");
    }

    const rawText = lastAssistantMessage.content[0].text.value;
    const parsedJson = extractJsonFromGPT(rawText);

    if (!parsedJson) {
      throw new Error("Couldn't extract valid JSON from the response");
    }

    // On applique les corrections éventuelles
    const corrected: DpeResult = corrigerClassements(parsedJson);

    if (corrected) {
      return corrected;
    } else {
      throw new Error("Couldn't extract valid JSON from the response");
    }
  } catch (error) {
    console.error("Error processing DPE file:", error);
    throw error;
  }
}

// Poll for run status
async function pollRunStatus(threadId: string, runId: string) {
  let status = "in_progress";

  while (status !== "completed" && status !== "failed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    status = run.status;

    if (status === "requires_action") {
      // Handle tool calls if needed
      const requiredAction = run.required_action;
      if (requiredAction?.type === "submit_tool_outputs") {
        // Handle tool outputs if needed in the future
        const toolCalls = requiredAction.submit_tool_outputs.tool_calls;
        const toolOutputs: any = [];

        await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
          tool_outputs: toolOutputs,
        });
      }
    }
  }

  return status;
}
