export class NodeOutput {
  private static instance: NodeOutput;
  private outputs: Map<string, any>;

  private constructor() {
    this.outputs = new Map();
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

  setOutput(nodeId: string, output: any): void {
    this.outputs.set(nodeId, output);
  }

  getOutput(nodeId: string): any {
    return this.outputs.get(nodeId);
  }

  clear(): void {
    this.outputs.clear();
  }
}

export const nodeOutput = NodeOutput.getInstance();
