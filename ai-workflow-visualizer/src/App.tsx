import { useState } from "react"
import TopBar from "./components/ours/TopBar"
import Sidebar from "./components/ours/SideBar"
import ReactFlowCanvas from "./components/ours/ReactFlowCanvas"

export default function WorkflowVisualizer() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedYamlString, setSelectedYamlString] = useState("")

  const handleCanvasClick = () => {
    if (!isSidebarCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden relative">
        <TopBar setSelectedYamlString={setSelectedYamlString}/>
        <Sidebar setSelectedYamlString={setSelectedYamlString} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}/>
        <ReactFlowCanvas handleCanvasClick={handleCanvasClick} selectedYamlString={selectedYamlString} />
      </div>
    </div>
  )
}
