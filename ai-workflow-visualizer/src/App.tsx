import { useState } from "react"
import TopBar from "./components/ours/TopBar"
import Sidebar from "./components/ours/SideBar"
import ReactFlowCanvas from "./components/ours/ReactFlowCanvas"
import { Toaster } from "./components/ui/sonner"
import { toast } from "sonner"

export default function WorkflowVisualizer() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedYamlString, setSelectedYamlString] = useState("")

  const handleCanvasClick = () => {
    if (!isSidebarCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  function setYamlString(newYamlString: string){
    if(newYamlString !== ""){
      setSelectedYamlString(newYamlString);
    } else if(newYamlString === "" && selectedYamlString !== ""){
      setSelectedYamlString("");
    } else{
      toast.error("No graph found to clear");
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden relative">
        <TopBar setSelectedYamlString={setYamlString}/>
        <Sidebar setSelectedYamlString={setSelectedYamlString} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}/>
        <ReactFlowCanvas handleCanvasClick={handleCanvasClick} selectedYamlString={selectedYamlString} />
        <Toaster />
      </div>
    </div>
  )
}
