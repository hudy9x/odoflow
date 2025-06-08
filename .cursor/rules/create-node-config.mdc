---
trigger: manual
---

Creating Node Configuration Forms

This guide outlines creating node configuration forms, based on NodeHttp and NodeDiscord examples.

1. File Structure:
For a new node (e.g., NodeMyNewService in frontend/src/app/features/WorkflowNodes/):
- types.ts: Contains TypeScript interfaces (e.g., MyNewServiceNodeConfig), enums (e.g., MessageType), and related type definitions.
- NodeMyNewServiceConfigForm.tsx: Main React component for the form.
    - Fetches existing config using getNodeConfig(nodeId).
    - Manages overall config state and loading status.
    - Passes initialConfig and nodeId to NodeMyNewServiceConfigFormContent.
- NodeMyNewServiceConfigFormContent.tsx: Renders the form's UI.
    - Receives initialConfig and nodeId as props.
    - Manages state for individual form fields (using useState).
    - Handles saving config via updateNodeConfig({ nodeId, config }).
    - Uses shadcn/ui components.
- index.tsx (in NodeMyNewService/): The node component for the workflow canvas.
    - Imports and uses NodeMyNewServiceConfigForm.
    - Wraps NodeBase with NodeConfigPopover, passing NodeMyNewServiceConfigForm as its child.
    - NodeData interface's 'config' property should use MyNewServiceNodeConfig.

2. Core Logic and Components:

A. types.ts:
- Main Config Interface: e.g., interface MyNewServiceNodeConfig { field1: string; field2: MyEnum; ... }
- Enums: For fixed option sets, e.g., export enum MyEnum { OPTION_A = 'a', OPTION_B = 'b' }
- Supporting Interfaces: For complex/nested data (e.g., DiscordEmbed).

B. NodeMyNewServiceConfigForm.tsx:
- Props: nodeId: string.
- State: isLoading: boolean (default true), config?: MyNewServiceNodeConfig.
- useEffect for Loading:
    - Calls getNodeConfig(nodeId).
    - On success, updates 'config' state (provide defaults if config is partial/missing, e.g., setConfig({ webhookUrl: fetchedConfig?.webhookUrl || '', ... })).
    - Sets isLoading = false in a 'finally' block.
- Render: Shows a loader if isLoading, else renders <NodeMyNewServiceConfigFormContent nodeId={nodeId} initialConfig={config} />.

C. NodeMyNewServiceConfigFormContent.tsx:
- Props: nodeId: string, initialConfig?: MyNewServiceNodeConfig.
- State: useState for each form field, initialized from initialConfig or a default.
- Dynamic Lists (e.g., headers, embed fields):
    - Manage as an array of objects in state. Each object needs a unique id.
    - Implement functions to add, remove, and update list items.
- handleSave Function (async):
    - Constructs the 'config: MyNewServiceNodeConfig' object from form states.
    - Calls await updateNodeConfig({ nodeId, config }).
    - Uses toast.success/toast.error for feedback.
- UI Rendering:
    - Use Label, Input, Select, Textarea, Switch, Button from @/components/ui/.
    - For Selects with enums: Object.values(MyEnum).map(value => <SelectItem key={value} value={value}>{value}</SelectItem>).
    - Use Tailwind CSS for layout. Include a full-width save Button.

D. NodeMyNewService/index.tsx:
- Imports: NodeMyNewServiceConfigForm, MyNewServiceNodeConfig from ./types.
- NodeData interface: interface NodeData { id: string; config?: MyNewServiceNodeConfig; }
- Render structure:
  // Example:
  export const NodeMyNewService = memo(({ id }: NodeProps) => {
    return (
      <NodeConfigPopover
        trigger={<div><NodeBase id={id} title="My New Service" ... /></div>}
        title="Configure My New Service"
        width="w-[DESIRED_WIDTHpx]" // e.g., w-[500px]
      >
        <NodeMyNewServiceConfigForm nodeId={id} />
      </NodeConfigPopover>
    );
  });

3. UI/UX Considerations:
- Clarity: Use clear Labels for inputs.
- Guidance: Provide placeholder text in Inputs/Textareas.
- Help Text: For complex fields or those needing external info (API keys, Webhook URLs), add a small description with a "Learn more" link:
  // Example:
  <p className="text-xs text-muted-foreground">
    Brief explanation. <a href="DOC_URL" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn more</a>
  </p>
- Required Fields: Use 'required' prop on Input components.
- Scrollability: If form content is long, wrap its main area in a div with className="overflow-y-auto max-h-[calc(100vh-OFFSETpx)]".
- Consistency: Maintain app's look and feel.

Following these guidelines helps develop new node configuration forms efficiently and consistently.