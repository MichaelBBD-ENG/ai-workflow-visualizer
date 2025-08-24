import { Bot, Download, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { handleExportYAML } from "@/utils/download";
import { setClientAndAIModel } from "@/utils/chatgpt";
import { ModeToggle } from "./ModeToggle";
import { nodesToYaml } from "@/utils/utils";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function TopBar({
  setSelectedYamlString
} : {
  setSelectedYamlString: (content: string) => void
}) {
  const handleImportYAML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === "text/yaml" || file.name.endsWith(".yaml") || file.name.endsWith(".yml"))) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setSelectedYamlString(content)
      }
      reader.readAsText(file)
    } else{
      toast.error("Please select a YAML file");
    }
    event.target.value = ""
  }

  function convertCurrentGraphToYaml(){
    const yamlString = nodesToYaml();
    if(!yamlString){
      toast.error("No graph found to export");
    } else{
      handleExportYAML(yamlString);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const apiKey = formData.get("api-key") as string;
    const aiModel = formData.get("ai-model") as string;
    try{
      setClientAndAIModel(apiKey, aiModel);
    } catch(e){
      toast.error("Error initializing ChatGPT client");
    }
  }

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-background border rounded-lg shadow-lg px-4 py-2 flex items-center gap-4">
          <h1 className="text-lg font-semibold">AI Workflow Visualiser</h1>
          <Button onClick={convertCurrentGraphToYaml} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".yaml,.yml"
              onChange={handleImportYAML}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Import YAML"
            />
            <Button  variant="outline" size="sm" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => setSelectedYamlString("")}>
            <X className="h-4 w-4" />
            Clear
          </Button>
          <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Bot className="h-4 w-4" />
                  API & Model
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Set API key & AI model</DialogTitle>
                      <DialogDescription>
                        Here you can set your OpenAI API key and select the AI model you want to use.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input type="password" name="api-key" placeholder="****" />
                        <p className="text-sm text-muted-foreground">
                          Get your API key{" "}
                          <a
                            href="https://platform.openai.com/settings/organization/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-400"
                          >
                            here
                          </a>
                          .
                        </p>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="ai-model">AI Model</Label>
                        <Input name="ai-model" defaultValue="gpt-4.1-mini" />
                      </div>
                    </div>
                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit">Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                </form>
              </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
    )
}