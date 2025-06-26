import type { NodeExecutor, NodeExecutionResult, CodeScriptNodeConfig } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import vm from 'vm';
import { templateParser } from '../TemplateParser.js';

export class CodeScriptNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const nodeData = node.data as { config?: CodeScriptNodeConfig };
      const config = nodeData.config;

      if (!config || !config.script) {
        throw new Error('Invalid configuration: script is required');
      }

      // Parse variables to replace any template strings
      const parsedVariables = config.variables ? templateParser.parseObject(config.variables) : {};
      const result = await this.safeEval(config.script, parsedVariables);
      
      return {
        success: true,
        output: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private safeEval(code: string, variables: Record<string, any>, timeout = 1000): Promise<any> {
    console.log('variables', variables)
    return new Promise((resolve, reject) => {
      try {
        // Create a context with only the necessary globals
        const context = {
          console: {
            log: console.log,
            error: console.error
          },
          // Add safe utilities
          Math: Object.create(null),
          JSON: {
            parse: JSON.parse,
            stringify: JSON.stringify
          },
          // Add input variables
          vars: { ...variables },
          // Add a safe setTimeout with limits
          setTimeout: (fn: Function, delay: number) => {
            if (delay > 1000) delay = 1000; // Cap delay at 1 second
            return setTimeout(fn, delay);
          }
        };
        
        // Copy safe methods from Math
        Object.getOwnPropertyNames(Math)
          .filter(prop => typeof (Math as any)[prop] === 'function')
          .forEach(prop => {
            context.Math[prop] = (Math as any)[prop];
          });
        
        // Create the context without prototype access
        const sandbox = vm.createContext(context, {
          name: 'sandbox',
          codeGeneration: {
            strings: false,
            wasm: false
          }
        });
        
        // Run the code with a timeout
        const script = new vm.Script(`
          (function() {
            "use strict";
            ${code}
          })();
        `, {
          filename: 'sandbox.js',
          lineOffset: 0
        });
        
        const result = script.runInContext(sandbox, { timeout });
        console.log('code script result', result)
        resolve(result);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Script execution failed'));
      }
    });
  }
}
