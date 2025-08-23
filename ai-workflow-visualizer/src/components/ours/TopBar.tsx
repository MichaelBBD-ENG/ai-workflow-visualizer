import { Download, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { handleExportYAML } from "@/utils/download";
import { ModeToggle } from "./ModeToggle";
import { nodesToYaml } from "@/utils/utils";

export default function TopBar({
  setSelectedYamlString
} : {
  setSelectedYamlString: React.Dispatch<React.SetStateAction<string>>
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
    }
    event.target.value = ""
  }

  function convertCurrentGraphToYaml(){
    const yamlString = nodesToYaml();
    handleExportYAML(yamlString);
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
          <ModeToggle />
        </div>
    )
}