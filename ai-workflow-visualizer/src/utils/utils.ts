import * as yaml from "yaml";
import { v4 as uuid } from "uuid";

export function yamlToReactFlow(yamlString: string): {
  nodes: {
    id: string;
    data: string;
    position: { x: number; y: number };
    type: string;
  }[];
  edges: { id: string; source: string; target: string }[];
} {
  const doc: any = yaml.parse(yamlString);
  const jobs = doc.jobs || {};

  const nodes: {
    id: string;
    data: string;
    position: { x: number; y: number };
    type: string;
  }[] = [];
  const edges: { id: string; source: string; target: string }[] = [];

  let x = 0;
  let y = 0;

  for (const [jobName, jobDef] of Object.entries<any>(jobs)) {
    const jobId = uuid();

    // Job node (raw YAML for the job)
    nodes.push({
      id: jobId,
      data: yaml.stringify({ [jobName]: { ...jobDef, steps: undefined } }),
      position: { x, y },
      type: "jobNode",
    });

    // Place next job diagonally
    x += 300;
    y += 150;

    // Step nodes
    if (Array.isArray(jobDef.steps)) {
      jobDef.steps.forEach((step: any, index: number) => {
        const stepId = uuid();
        nodes.push({
          id: stepId,
          data: yaml.stringify(step),
          position: { x: x + index * 200, y: y },
          type: "stepNode",
        });

        // Connect step → next step
        if (index > 0) {
          edges.push({
            id: uuid(),
            source: nodes[nodes.length - 2].id, // previous step
            target: stepId,
          });
        } else{
          // Connect job → step
          edges.push({
            id: uuid(),
            source: jobId,
            target: stepId,
          });
        }
      });

      // Push steps down visually
      y += 200;
    }

    // Job dependencies
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
          });
        }
      });
    }
  }

  return { nodes, edges };
}
