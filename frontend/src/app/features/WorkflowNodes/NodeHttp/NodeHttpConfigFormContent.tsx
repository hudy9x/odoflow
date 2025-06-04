import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { updateNodeConfig } from '@/app/services/node.service';
import { toast } from 'sonner';
import { PlusCircle, X } from 'lucide-react';

interface NodeHttpConfigFormContentProps {
  nodeId: string;
  initialConfig?: {
    url?: string;
    method?: string;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
    bodyType?: 'empty' | 'raw' | 'x-www-form-urlencoded';
    body?: {
      contentType?: 'text/plain' | 'application/json' | 'application/xml' | 'text/xml' | 'text/html' | 'custom';
      customContentType?: string;
      requestContent?: string;
    };
    formData?: Record<string, string>;
  };
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
const CONTENT_TYPES = [
  { value: 'text/plain', label: 'Text' },
  { value: 'application/json', label: 'JSON' },
  { value: 'application/xml', label: 'XML' },
  { value: 'text/xml', label: 'Text XML' },
  { value: 'text/html', label: 'HTML' },
  { value: 'custom', label: 'Custom' },
];

const generateKey = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function NodeHttpConfigFormContent({
  nodeId,
  initialConfig,
}: NodeHttpConfigFormContentProps) {
  const [url, setUrl] = useState(initialConfig?.url || '');
  const [method, setMethod] = useState(initialConfig?.method || 'GET');
  interface KeyValuePair {
    id: string;
    key: string;
    value: string;
  }

  const [queryParams, setQueryParams] = useState<KeyValuePair[]>(
    initialConfig?.queryParams ? Object.entries(initialConfig.queryParams).map(([key, value]) => ({
      id: generateKey(),
      key,
      value: value || ''
    })) : []
  );

  const [headers, setHeaders] = useState<KeyValuePair[]>(
    initialConfig?.headers ? Object.entries(initialConfig.headers).map(([key, value]) => ({
      id: generateKey(),
      key,
      value: value || ''
    })) : []
  );
  const [bodyType, setBodyType] = useState<'empty' | 'raw' | 'x-www-form-urlencoded'>(
    initialConfig?.bodyType || 'empty'
  );
  const [contentType, setContentType] = useState(
    initialConfig?.body?.contentType || 'text/plain'
  );
  const [customContentType, setCustomContentType] = useState(
    initialConfig?.body?.customContentType || ''
  );
  const [requestContent, setRequestContent] = useState(
    initialConfig?.body?.requestContent || ''
  );
  const [formData, setFormData] = useState<KeyValuePair[]>(
    initialConfig?.formData ? Object.entries(initialConfig.formData).map(([key, value]) => ({
      id: generateKey(),
      key,
      value: value || ''
    })) : []
  );

  const handleAddQueryParam = () => {
    setQueryParams(prev => [...prev, { id: generateKey(), key: '', value: '' }]);
  };

  const handleAddHeader = () => {
    setHeaders(prev => [...prev, { id: generateKey(), key: '', value: '' }]);
  };

  const handleAddFormData = () => {
    setFormData(prev => [...prev, { id: generateKey(), key: '', value: '' }]);
  };

  type ContentType = 'text/plain' | 'application/json' | 'application/xml' | 'text/xml' | 'text/html' | 'custom';

const handleSave = async () => {
    try {
      // Remove all empty keys from records
      const cleanedConfig = {
        url,
        method,
        queryParams: queryParams
          .filter(item => item.key !== '')
          .reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {}),
        headers: headers
          .filter(item => item.key !== '')
          .reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {}),
        bodyType,
        body: bodyType === 'raw' ? {
          contentType,
          customContentType: contentType === 'custom' ? customContentType : undefined,
          requestContent,
        } : undefined,
        formData: bodyType === 'x-www-form-urlencoded' ? 
          formData
            .filter(item => item.key !== '')
            .reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})
          : undefined,
      };

      const response = await updateNodeConfig({
        nodeId,
        config: cleanedConfig // eslint-disable-line @typescript-eslint/no-explicit-any
      });


      if (response.success) {
        toast.success('HTTP config saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save HTTP config');
      console.error('Error saving HTTP config:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* URL and Method */}
      <div className="space-y-2">
        <Label>URL</Label>
        <Input
          placeholder="https://api.example.com/endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Query Parameters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Query Parameters</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddQueryParam}
            className="h-8 text-gray-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Parameter
          </Button>
        </div>
        {queryParams.map((param) => (
          <div key={param.id} className="flex gap-2 items-center">
            <Input
              placeholder="Key"
              value={param.key}
              onChange={(e) => {
                const newKey = e.target.value;
                setQueryParams((prev) => 
                  prev.map((p) =>
                    p.id === param.id ? { ...p, key: newKey } : p
                  )
                );
              }}
            />
            <Input
              placeholder="Value"
              value={param.value}
              onChange={(e) =>
                setQueryParams((prev) =>
                  prev.map((p) =>
                    p.id === param.id ? { ...p, value: e.target.value } : p
                  )
                )
              }
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setQueryParams((prev) =>
                  prev.filter((p) => p.id !== param.id)
                );
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Headers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Headers</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddHeader}
            className="h-8 text-gray-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Header
          </Button>
        </div>
        {headers.map((header) => (
          <div key={header.id} className="flex gap-2 items-center">
            <Input
              placeholder="Key"
              value={header.key}
              onChange={(e) => {
                const newKey = e.target.value;
                setHeaders((prev) =>
                  prev.map((h) =>
                    h.id === header.id ? { ...h, key: newKey } : h
                  )
                );
              }}
            />
            <Input
              placeholder="Value"
              value={header.value}
              onChange={(e) =>
                setHeaders((prev) =>
                  prev.map((h) =>
                    h.id === header.id ? { ...h, value: e.target.value } : h
                  )
                )
              }
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setHeaders((prev) =>
                  prev.filter((h) => h.id !== header.id)
                );
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Body Configuration (hidden for GET/HEAD) */}
      {!['GET', 'HEAD'].includes(method) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Body Type</Label>
            <Select value={bodyType} onValueChange={(value: typeof bodyType) => setBodyType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">empty</SelectItem>
                <SelectItem value="raw">raw</SelectItem>
                <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {bodyType === 'raw' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map(({ value }) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {contentType === 'custom' && (
                <div className="space-y-2">
                  <Label>Custom Content Type</Label>
                  <Input
                    placeholder="application/custom+json"
                    value={customContentType}
                    onChange={(e) => setCustomContentType(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Request Content</Label>
                <Textarea
                  placeholder="Enter request body..."
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          )}

          {bodyType === 'x-www-form-urlencoded' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Form Data</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddFormData}
                  className="h-8"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>
              {formData.map((field) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setFormData((prev) =>
                        prev.map((f) =>
                          f.id === field.id ? { ...f, key: newKey } : f
                        )
                      );
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev.map((f) =>
                          f.id === field.id ? { ...f, value: e.target.value } : f
                        )
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFormData((prev) =>
                        prev.filter((f) => f.id !== field.id)
                      );
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button className='w-full' onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
