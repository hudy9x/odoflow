interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

import { templateParser } from '../TemplateParser.js';

export class FilterProcessor {
  private static instance: FilterProcessor;

  private constructor() {}

  static getInstance(): FilterProcessor {
    if (!FilterProcessor.instance) {
      FilterProcessor.instance = new FilterProcessor();
    }
    return FilterProcessor.instance;
  }

  /**
   * Process filter conditions against node output
   * @param conditions FilterCondition[][] - Array of AND conditions within OR conditions
   * @param output any - The output data to check against
   * @returns boolean - true if conditions pass, false if they fail
   */
  process(conditions: FilterCondition[][]): boolean {
    // If no conditions, pass through
    if (!conditions || conditions.length === 0) return true;

    // Process OR conditions
    return conditions.some(andConditions => {
      // Process AND conditions - all must be true
      return andConditions.every(condition => {
        const value = this.getFieldValue(condition.field);
        return this.evaluateCondition(value, condition.operator, condition.value);
      });
    });
  }

  private getFieldValue(field: string): any {
    // Use TemplateParser to get the value
    const parsedValue = templateParser.parse(field);
    return parsedValue === field ? undefined : parsedValue;
  }

  private evaluateCondition(fieldValue: any, operator: string, targetValue: string): boolean {

    try {
       // Handle undefined/null field values
      if (fieldValue === undefined || fieldValue === null) {
        return operator === 'empty';
      }

      // Convert to string for comparison if not already a string
      const value = String(fieldValue);

      switch (operator) {
        case 'equals':
          return value === targetValue;
        case 'notEquals':
          return value !== targetValue;
        case 'contains':
          return value.includes(targetValue);
        case 'notContains':
          return !value.includes(targetValue);
        case 'startsWith':
          return value.startsWith(targetValue);
        case 'endsWith':
          return value.endsWith(targetValue);
        case 'greaterThan':
          return Number(value) > Number(targetValue);
        case 'greaterThanOrEqual':
          return Number(value) >= Number(targetValue);
        case 'lessThan':
          return Number(value) < Number(targetValue);
        case 'lessThanOrEqual':
          return Number(value) <= Number(targetValue);
        case 'empty':
          return value === '' || value.trim() === '';
        case 'notEmpty':
          return value !== '' && value.trim() !== '';
        default:
          console.warn(`Unknown operator: ${operator}`);
          return false;
      }
    } catch (error) {
      console.error('Error evaluating condition:', error as Error);
      return false;
    }
  }
}

export const filterProcessor = FilterProcessor.getInstance();
