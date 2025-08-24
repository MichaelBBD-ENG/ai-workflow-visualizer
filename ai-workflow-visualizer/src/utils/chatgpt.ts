import { useAIModelStore, useApiKeyStore } from "@/store/store";
import OpenAI from "openai";
import { toast } from "sonner";

let client: OpenAI | undefined = undefined;

export function setClientAndAIModel(apiKey: string, aiModel: string) {
  client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  useApiKeyStore.getState().setApiKey(apiKey);
  useAIModelStore.getState().setAIModel(aiModel);
  toast.success("ChatGPT client initialized");
}

export async function aiSummarizeSection(prompt: string): Promise<string> {
  if(client === undefined){
    toast.error("ChatGPT client is not initialized, please provide an API key");
    throw new Error("ChatGPT client is not initialized");
  } else{
    const response = await client.responses.create({
            model: useAIModelStore.getState().aiModel,
            input: prompt
          });
    
    return response.output_text
  }
}

export async function aiGenerateWorkflowYaml(prompt: string): Promise<string> {
  if(client === undefined){
    toast.error("ChatGPT client is not initialized, please provide an API key");
    throw new Error("ChatGPT client is not initialized")
  } else{
  const resp = await client.chat.completions.create({
    model: useAIModelStore.getState().aiModel,
    messages: [
      {
        role: "system",
        content: `You are a GitHub Actions workflow generator. 
Always return ONLY valid GitHub Actions YAML. 
Do not include comments, explanations, prose, or code fences. 
The YAML must follow this schema:
name: <string>

on:
  push:
    branches:
      - main

jobs:
  <job-id>:
    runs-on: ubuntu-latest
    steps:
      - name: <string>
        uses: <string> | run: <string>`,
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  let yaml = resp.choices[0].message?.content?.trim() ?? "";

  yaml = yaml
    .replace(/^```[a-zA-Z]*\n?/, "")
    .replace(/```$/, "")
    .trim();

  return yaml;
  }
}