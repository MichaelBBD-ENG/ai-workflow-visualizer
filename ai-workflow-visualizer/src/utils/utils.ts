import * as yaml from "yaml";
import { v4 as uuid } from "uuid";

export function yamlToReactFlow(yamlString: string) {
  const doc: any = yaml.parse(yamlString);
  const jobs = doc.jobs || {};

  const nodes: any[] = [];
  const edges: any[] = [];

  let x = 0;
  let y = 0;

  for (const [jobName, jobDef] of Object.entries<any>(jobs)) {
    const nodeId = jobName;

    // Node for the job
    nodes.push({
      id: nodeId,
      data: { 
        label: jobName, 
        steps: jobDef["steps"] || [] 
      },
      position: { x, y },
      type: "default",
    });

    // Place nodes diagonally for now
    x += 250;
    y += 100;

    // Edges from "needs"
    if (jobDef["needs"]) {
      const needs = Array.isArray(jobDef["needs"])
        ? jobDef["needs"]
        : [jobDef["needs"]];

      needs.forEach((dep: string) => {
        edges.push({
          id: uuid(),
          source: dep,
          target: nodeId,
        });
      });
    }
  }

  return { nodes, edges };
}
