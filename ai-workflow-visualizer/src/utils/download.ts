export const handleExportYAML = (yamlString: string) => {
    const blob = new Blob([yamlString], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workflow.yaml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }