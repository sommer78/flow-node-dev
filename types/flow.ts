import type { GraphNode, Node, Position } from "@vue-flow/core";
export type NodeStatus = "active" | "inactive" | "processing" | "error";
export type NodeContentType = "circuit" | "pcb" | "document" | "code";
export type CodeLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "java";

export interface NodeData {
  contentType: NodeContentType;
  content: string;
  codeLanguage?: CodeLanguage;
  description?: string;
  fileType?: string;
  fileName?: string;
  inputs?: Array<{
    id: string;
    label: string;
    position: Position;
  }>;
  outputs?: Array<{
    id: string;
    label: string;
    position: Position;
  }>;
}

export interface FlowNode extends Node {
  label: string;
  data: NodeData;
}

// export interface FlowEdge extends Edge {
//   label?: string;
//   data?: Record<string, any>;
// }

export interface FlowState {
  nodes: FlowNode[];
  // edges: FlowEdge[];
}
