export interface SecurityTool {
  id: string;
  name: string;
  description: string;
  features: string[];
  status: "ready" | "not-connected";
  category: string;
}

export interface ToolCategory {
  id: string;
  label: string;
  tools: SecurityTool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "web-security",
    label: "Web Application Security",
    tools: [
      {
        id: "owasp-zap",
        name: "OWASP ZAP",
        description: "Automated and manual web application scanning.",
        features: ["Active scanning", "Passive scanning", "API testing"],
        status: "ready",
        category: "Web Application Security",
      },
    ],
  },
  {
    id: "siem",
    label: "SIEM & Monitoring",
    tools: [
      {
        id: "wazuh",
        name: "Wazuh",
        description: "Open-source SIEM/XDR platform.",
        features: ["Log analysis", "Intrusion detection", "Compliance monitoring"],
        status: "ready",
        category: "SIEM & Monitoring",
      },
    ],
  },
];

export function getAllTools(): SecurityTool[] {
  return toolCategories.flatMap((c) => c.tools);
}

export function getToolById(id: string): SecurityTool | undefined {
  return getAllTools().find((t) => t.id === id);
}
