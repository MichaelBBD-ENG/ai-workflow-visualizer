import OpenAI from "openai";

export const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function aiGenerateWorkflowYaml(prompt: string): Promise<string> {
  const resp = await client.chat.completions.create({
    model: "gpt-4.1-mini",
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