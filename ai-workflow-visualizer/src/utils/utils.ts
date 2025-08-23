import * as yaml from "yaml";
import { v4 as uuid } from "uuid";

export function yamlToReactFlow(yamlString: string): {
  nodes: {
    id: string;
    data: string;
    position: { x: number; y: number };
    type: string;
  }[];
  edges: { id: string; source: string; target: string, animated?: boolean }[];
} {
  const doc: any = yaml.parse(yamlString);
  const on = doc.on || {};
  const jobs = doc.jobs || {};

  const nodes: {
    id: string;
    data: string;
    position: { x: number; y: number };
    type: string;
  }[] = [];
  const edges: { id: string; source: string; target: string, animated?: boolean }[] = [];

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
          });
        } else{
          edges.push({
            id: uuid(),
            source: jobId,
            target: stepId,
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
            animated: true
          });
        }
      });
    }
  }

  // connect on node to first job node
  if(nodes.length > 2 && nodes[1].type === "jobNode"){
    edges.push({
      id: uuid(),
      source: nodes[0].id,
      target: nodes[1].id,
      animated: true
    });
  }

  return { nodes, edges };
}
