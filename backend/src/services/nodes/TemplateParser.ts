import { NodeOutput } from './NodeOutput.js';

export class TemplateParser {
  private static instance: TemplateParser;
  private readonly TEMPLATE_PATTERN = /\{\{([^.}]+)\.([^}]+)\}\}/g;
  private readonly nodeOutput: NodeOutput;

  private constructor() {
    this.nodeOutput = NodeOutput.getInstance();
  }

  static getInstance(): TemplateParser {
    if (!TemplateParser.instance) {
      TemplateParser.instance = new TemplateParser();
    }
    return TemplateParser.instance;
  }

  /**
   * Parse a template string, replacing {{shortId.field}} with actual values
   * Example: {{http_abc.response}} will be replaced with the 'response' field
   * from the output of the node with shortId 'http_abc'
   */
  parse(template: string | undefined): string {
    if (!template) return '';
    
    return template.replace(this.TEMPLATE_PATTERN, (match, shortId, field) => {
      try {
        const nodeData = this.nodeOutput.getOutput(shortId);
        return nodeData?.[field]?.toString() ?? match;
      } catch (error) {
        // If shortId is not found, return the original template
        console.warn(`Template parse warning: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return match;
      }
    });
  }

  parseObject<T extends Record<string, any>>(obj: T): T {
    if (!obj) return obj;

    const parsed: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        parsed[key] = this.parse(value);
      } else {
        parsed[key] = value;
      }
    }
    return parsed as T;
  }
}

export const templateParser = TemplateParser.getInstance();
