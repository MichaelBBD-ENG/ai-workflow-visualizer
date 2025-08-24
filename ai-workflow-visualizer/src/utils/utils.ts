import * as yaml from "yaml";
import { v4 as uuid } from "uuid";
import type { WorkFlowEdge, WorkFlowNode } from "@/types/types";
import { useWorkflowEdgesStore, useWorkflowNameStore, useWorkflowNodesStore } from "@/store/store";

export function yamlToReactFlow(yamlString: string): {
  workflowName: string;
  nodes: WorkFlowNode[];
  edges: WorkFlowEdge[];
} {
  const doc: any = yaml.parse(yamlString);
  const on = doc.on || {};
  const jobs = doc.jobs || {};

  const nodes: WorkFlowNode[] = [];
  const independentNodes: WorkFlowNode[] = [];
  const edges: WorkFlowEdge[] = [];

  let x = 0;
  let y = 0;

  nodes.push({
    id: uuid(),
    data: yaml.stringify(on),
    position: { x, y},
    type: "onNode",
  });

  x += 300;
  y += 150;

  for (const [jobName, jobDef] of Object.entries<any>(jobs)) {
    const jobId = uuid();

    nodes.push({
      id: jobId,
      data: yaml.stringify({ [jobName]: { ...jobDef, steps: undefined } }),
      position: { x, y },
      type: "jobNode",
    });

    x += 300;
    y += 150;

    if (Array.isArray(jobDef.steps)) {
      jobDef.steps.forEach((step: any, index: number) => {
        const stepId = uuid();
        nodes.push({
          id: stepId,
          data: yaml.stringify(step),
          position: { x: x + index * 200, y: y },
          type: "stepNode",
        });

        if (index > 0) {
          edges.push({
            id: uuid(),
            source: nodes[nodes.length - 2].id,
            target: stepId,
            type: "rfEdge",
          });
        } else{
          edges.push({
            id: uuid(),
            source: jobId,
            target: stepId,
            type: "rfEdge",
          });
        }
      });

      y += 200;
    }

    if (jobDef.needs) {
      const needs = Array.isArray(jobDef.needs)
        ? jobDef.needs
        : [jobDef.needs];

      needs.forEach((dep: string) => {
        const depJobNode = nodes.find((n) =>
          n.data.includes(dep) && n.type === "jobNode"
        );
        if (depJobNode) {
          edges.push({
            id: uuid(),
            source: depJobNode.id,
            target: jobId,
            animated: true,
            type: "rfEdge",
          });
        }
      });
    } else{
      independentNodes.push({
        id: jobId,
        data: yaml.stringify({ [jobName]: { ...jobDef, steps: undefined } }),
        position: { x, y },
        type: "jobNode",
      });
    }
  }

  // connect on node to all independent jobs
  independentNodes.forEach((node) => {
    edges.push({
      id: uuid(),
      source: nodes[0].id, // we are assuming the first node is the on node
      target: node.id,
      animated: true,
      type: "rfEdge",
    });
  });

  return { workflowName: doc.name, nodes, edges };
}

export function nodesToYaml(): string | undefined {
  const nodes = useWorkflowNodesStore.getState().nodes;
  const edges = useWorkflowEdgesStore.getState().edges;
  const workflowName = useWorkflowNameStore.getState().name;

  if(!nodes || !edges || !workflowName) return undefined;

  const onNode = nodes.find((n) => n.type === "onNode");
  const on = onNode ? yaml.parse(onNode.data) : {};

  const jobs: Record<string, any> = {};
  const jobNodes = nodes.filter((n) => n.type === "jobNode");
  const stepNodes = nodes.filter((n) => n.type === "stepNode");

  jobNodes.forEach((jobNode) => {
    const parsed = yaml.parse(jobNode.data);
    const jobName = Object.keys(parsed)[0];
    jobs[jobName] = parsed[jobName];
    jobs[jobName].steps = [];
  });

  const stepMap: Record<string, any> = {};
  stepNodes.forEach((s) => (stepMap[s.id] = s));

  const getNextStepId = (currentStepId: string) => {
    const edge = edges.find(
      (e) =>
        e.source === currentStepId &&
        stepMap[e.target] !== undefined
    );
    return edge?.target;
  };

  jobNodes.forEach((jobNode) => {
    const jobName = Object.keys(yaml.parse(jobNode.data))[0];

    const firstStepEdge = edges.find(
      (e) => e.source === jobNode.id && stepMap[e.target] !== undefined
    );
    if (!firstStepEdge) return;

    let stepId = firstStepEdge.target;

    while (stepId) {
      const stepNode = stepMap[stepId];
      if (!stepNode) break;

      try {
        jobs[jobName].steps.push(yaml.parse(stepNode.data));
      } catch {
        jobs[jobName].steps.push({ run: stepNode.data });
      }

      // @ts-ignore
      stepId = getNextStepId(stepId);
    }
  });

  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (sourceNode?.type === "jobNode" && targetNode?.type === "jobNode") {
      const sourceJobName = Object.keys(yaml.parse(sourceNode.data))[0];
      const targetJobName = Object.keys(yaml.parse(targetNode.data))[0];

      jobs[targetJobName].needs = jobs[targetJobName].needs || [];
      if (!jobs[targetJobName].needs.includes(sourceJobName)) {
        jobs[targetJobName].needs.push(sourceJobName);
      }
    }
  });

  const workflow: any = {
    name: workflowName,
    on,
    jobs,
  };

  return yaml.stringify(workflow);
}