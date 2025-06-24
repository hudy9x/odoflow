import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CodeEditor } from '@/components/ui/code-editor';
import { updateNodeConfig } from '@/app/services/node.service';
import { KeyValuePair, NodeCodeScriptConfig } from './types';
import { Plus, Trash2 } from 'lucide-react';
import { NodeConfigPopoverCloseButton } from '../../WorkflowConfig/NodeConfigPopoverCloseButton';

interface Props {
  nodeId: string;
  initialConfig?: NodeCodeScriptConfig;
}

const generateKey = () => Date.now().toString() + Math.random();

export function NodeCodeScriptConfigFormContent({ nodeId, initialConfig }: Props) {
  const [variables, setVariables] = useState<KeyValuePair[]>(
    initialConfig?.variables ? Object.entries(initialConfig.variables).map(([key, value]) => ({
      id: generateKey(),
      key,
      value: value || ''
    })) : []
  );

  const [script, setScript] = useState<string>(initialConfig?.script || '');

  const addVariable = () => {
    setVariables([...variables, { id: generateKey(), key: '', value: '' }]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(param => param.id !== id));
  };

  const updateVariable = (id: string, field: 'key' | 'value', value: string) => {
    setVariables(variables.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const handleSave = async () => {
    try {
      const variablesObj = variables.reduce((acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const config: NodeCodeScriptConfig = {
        variables: variablesObj,
        script
      };

      await updateNodeConfig({ nodeId, config });
      toast.success('Configuration saved');
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Variables</Label>
        <div className="space-y-2">
          {variables.map(({ id, key, value }) => (
            <div key={id} className="flex gap-2">
              <Input
                placeholder="Variable name"
                value={key}
                onChange={(e) => updateVariable(id, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                value={value}
                onChange={(e) => updateVariable(id, 'value', e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeVariable(id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addVariable} variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            Add Variable
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Script</Label>
        <div className="border rounded-md">
          <CodeEditor
            value={script}
            onChange={setScript}
            placeholder="Enter your JavaScript code here..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 space-x-2">
        <NodeConfigPopoverCloseButton />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
