import { memo, useState } from 'react';
import { toast } from 'sonner';
import { updateNodeConfig } from '@/app/services/node.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResponseNodeConfig, commonStatusCodes } from './types';
import { Combobox } from '@/components/ui/combobox';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { NodeConfigPopoverCloseButton } from '../../WorkflowConfig/NodeConfigPopoverCloseButton';

interface Props {
  nodeId: string;
  initialConfig?: ResponseNodeConfig;
}

const sampleJson = `{}`

export const NodeResponseConfigFormContent = memo(function NodeResponseConfigFormContent({ nodeId, initialConfig }: Props) {
  const [statusCode, setStatusCode] = useState(initialConfig?.statusCode || '');
  const [headers, setHeaders] = useState(initialConfig?.headers || []);
  const [responseData, setResponseData] = useState(initialConfig?.responseData || sampleJson);
  const [isKeyValueMode, setIsKeyValueMode] = useState(false);
  const [keyValuePairs, setKeyValuePairs] = useState<Array<{ id: string; key: string; value: string }>>([]);

  // Parse response data into key-value pairs when switching to key-value mode
  const switchToKeyValueMode = () => {
    try {
      const parsed = JSON.parse(responseData);
      const pairs = Object.entries(parsed).map(([key, value]) => ({
        id: `${Date.now()}-${Math.random()}`,
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value)
      }));
      setKeyValuePairs(pairs);
      setIsKeyValueMode(true);
    } catch {
      toast.error('Invalid JSON data');
    }
  };

  // Convert key-value pairs to JSON string when switching to JSON mode
  const switchToJsonMode = () => {
    try {
      const obj = keyValuePairs.reduce((acc, { key, value }) => {
        try {
          // Try to parse the value as JSON
          acc[key] = JSON.parse(value);
        } catch {
          // If parsing fails, use the raw string
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);
      setResponseData(JSON.stringify(obj, null, 2));
      setIsKeyValueMode(false);
    } catch {
      toast.error('Failed to convert to JSON');
    }
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([
      ...keyValuePairs,
      { id: `${Date.now()}-${Math.random()}`, key: '', value: '' }
    ]);
  };

  const removeKeyValuePair = (id: string) => {
    setKeyValuePairs(keyValuePairs.filter(p => p.id !== id));
  };

  const updateKeyValuePair = (id: string, field: 'key' | 'value', value: string) => {
    setKeyValuePairs(keyValuePairs.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addHeader = () => {
    setHeaders([
      ...headers,
      { id: `${Date.now()}-${Math.random()}`, key: '', value: '' }
    ]);
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter(h => h.id !== id));
  };

  const updateHeader = (id: string, field: 'key' | 'value', value: string) => {
    setHeaders(headers.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  const handleSave = async () => {
    try {
      let finalResponseData = responseData;
      if (isKeyValueMode) {
        const obj = keyValuePairs.reduce((acc, { key, value }) => {
          try {
            acc[key] = JSON.parse(value);
          } catch {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, unknown>);
        finalResponseData = JSON.stringify(obj);
      }

      // Validate JSON data
      JSON.parse(finalResponseData);

      await updateNodeConfig({
        nodeId,
        config: {
          statusCode,
          headers,
          responseData: finalResponseData
        }
      });
      toast.success('Response configuration saved');
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON in response data');
      } else {
        toast.error('Failed to save configuration');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Status Code</Label>
        <Combobox
          value={statusCode}
          onChange={setStatusCode}
          items={commonStatusCodes}
          placeholder="Enter status code..."
          className="w-full"
          allowCustomValue
        />
      </div>

      <div className="space-y-2">
        <Label>Headers</Label>
        <div className="space-y-2">
          {headers.map(header => (
            <div key={header.id} className="flex gap-2">
              <Input
                placeholder="Key"
                value={header.key}
                onChange={e => updateHeader(header.id, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                value={header.value}
                onChange={e => updateHeader(header.id, 'value', e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeHeader(header.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addHeader} variant="outline" size="sm">
            Add Header
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Response Data (JSON)</Label>
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Key-Value Mode</Label>
            <Switch
              checked={isKeyValueMode}
              onCheckedChange={(checked) => {
                if (checked) {
                  switchToKeyValueMode();
                } else {
                  switchToJsonMode();
                }
              }}
            />
          </div>
        </div>

        {isKeyValueMode ? (
          <div className="space-y-2">
            {keyValuePairs.map(pair => (
              <div key={pair.id} className="flex gap-2">
                <Input
                  placeholder="Key"
                  value={pair.key}
                  onChange={e => updateKeyValuePair(pair.id, 'key', e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={pair.value}
                  onChange={e => updateKeyValuePair(pair.id, 'value', e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeKeyValuePair(pair.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addKeyValuePair} variant="outline" size="sm">
              Add Field
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              value={responseData}
              onChange={e => setResponseData(e.target.value)}
              placeholder="Enter JSON response data..."
              className="font-mono"
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              Enter valid JSON data that will be returned in the response.
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 space-x-2">
        <NodeConfigPopoverCloseButton />
        <Button onClick={handleSave} className="w-full">
          Save
        </Button>
      </div>
      
    </div>
  );
});

NodeResponseConfigFormContent.displayName = 'NodeResponseConfigFormContent';
