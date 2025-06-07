import { nodeOutput } from './NodeOutput.js';

export class TemplateParser {
  private static instance: TemplateParser;
  private readonly TEMPLATE_PATTERN = /\{\{([^.}]+)\.([^}]+)\}\}/g;

  private constructor() {}

  static getInstance(): TemplateParser {
    if (!TemplateParser.instance) {
      TemplateParser.instance = new TemplateParser();
    }
    return TemplateParser.instance;
  }

  parse(template: string | undefined): string {
    if (!template) return '';
    
    return template.replace(this.TEMPLATE_PATTERN, (match, nodeId, field) => {
      const nodeData = nodeOutput.getOutput(nodeId);
      return nodeData?.[field]?.toString() ?? match;
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
