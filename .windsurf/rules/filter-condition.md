---
trigger: manual
---

## Workflow Node Filter System

This document outlines the filter condition system used in the workflow to control data flow between nodes.

## Core Concepts

- Filters are applied to incoming connections of a node
- Each filter belongs to a specific workflow and connects a source node to a target node
- Filters use a combination of AND/OR logic for complex condition evaluation
- Conditions are evaluated before the target node executes

## Data Structure

- FilterCondition
  - field: The data field to evaluate
  - operator: The comparison operator
  - value: The value to compare against

- WorkflowNodeFilter
  - id: Unique identifier
  - workflowId: The workflow this filter belongs to
  - sourceNodeId: The node where data comes from
  - targetNodeId: The node where filter is applied
  - conditions: Array of AND groups, where multiple groups are combined with OR

## Operators

- Comparison
  - equals: Exact match
  - not_equals: Not equal to
  - contains: String contains
  - not_contains: String does not contain
  - starts_with: String starts with
  - ends_with: String ends with
  - greater_than: Number greater than
  - greater_than_equal: Number greater than or equal
  - less_than: Number less than
  - less_than_equal: Number less than or equal

- Special
  - is_empty: Field is empty or undefined
  - is_not_empty: Field has a value

## Condition Logic

- AND Logic (Within Groups)
  - Conditions within the same array are combined with AND
  - All conditions must be true for the group to be true
  - Example: [[condition1, condition2]] means condition1 AND condition2

- OR Logic (Between Groups)
  - Different arrays in the conditions array are combined with OR
  - If any group is true, the filter passes
  - Example: [[condition1, condition2], [condition3]] means (condition1 AND condition2) OR condition3

## Database Schema

- One-to-many relationship with Workflow
- One-to-one relationship with target WorkflowNode
- Conditions stored as JSON in the database
- Indexed on both sourceNodeId and targetNodeId for efficient queries

## API Endpoints

- POST /api/node-filters
  - Create a new filter
  - Requires workflowId, sourceNodeId, targetNodeId, and conditions

- GET /api/node-filters/workflow/:workflowId
  - Get all filters for a workflow
  - Returns array of WorkflowNodeFilter

- DELETE /api/node-filters/:filterId
  - Delete a specific filter
  - Returns success message

## Usage Example

```typescript
const filter = {
  workflowId: "123",
  sourceNodeId: "node1",
  targetNodeId: "node2",
  conditions: [
    [
      { field: "status", operator: "equals", value: "success" },
      { field: "amount", operator: "greater_than", value: "100" }
    ],
    [
      { field: "priority", operator: "equals", value: "high" }
    ]
  ]
}