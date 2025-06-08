export class NodeOutput {
  private static instance: NodeOutput;
  private outputs: Map<string, any>;
  private idMap: Map<string, string>; // Map from shortId to nodeId

  private constructor() {
    this.outputs = new Map();
    this.idMap = new Map();
  }

  static getInstance(): NodeOutput {
    if (!NodeOutput.instance) {
      NodeOutput.instance = new NodeOutput();
    }
    return NodeOutput.instance;
  }

  getAll() {
    return this.outputs;
  }

  /**
   * Maps a shortId to a nodeId for future reference
   */
  mapId(shortId: string, nodeId: string): void {
    this.idMap.set(shortId, nodeId);
  }

  /**
   * Gets the nodeId for a given shortId
   */
  getNodeId(shortId: string): string | undefined {
    return this.idMap.get(shortId);
  }

  /**
   * Sets output for a node using its shortId
   */
  setOutput(shortId: string, output: any): void {
    const nodeId = this.idMap.get(shortId);
    if (!nodeId) {
      throw new Error(`No nodeId found for shortId: ${shortId}`);
    }
    this.outputs.set(nodeId, output);
  }

  /**
   * Gets output for a node using its shortId
   */
  getOutput(shortId: string): any {
    const nodeId = this.idMap.get(shortId);
    if (!nodeId) {
      throw new Error(`No nodeId found for shortId: ${shortId}`);
    }
    return this.outputs.get(nodeId);
  }

  clear(): void {
    this.outputs.clear();
    this.idMap.clear();
  }
}

export const nodeOutput = NodeOutput.getInstance();
