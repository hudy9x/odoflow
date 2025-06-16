import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback, useEffect } from "react";

interface CopyButtonProps {
  text: string;
  shortId: string;
}

function CopyButton({ text, shortId }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`{{${shortId}.${text}}}`);
    toast.success("Copied to clipboard");
    setCopied(true);
  }, [text, shortId]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4 text-gray-200"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 p-0.5" />
      ) : (
        <Copy className="h-3 w-3 p-0.5" />
      )}
    </Button>
  );
}

interface JsonViewerProps {
  shortId: string;
  data: unknown;
  path?: string;
  isRoot?: boolean;
}

function JsonViewer({ data, path = "", isRoot = true, shortId }: JsonViewerProps) {

  if (data === null) return <span className="text-gray-500">null</span>;
  if (typeof data === "undefined") return <span className="text-gray-200">undefined</span>;
  if (typeof data === "string") return <span className="text-green-300">&quot;{data}&quot;</span>;
  if (typeof data === "number") return <span className="text-blue-300">{data}</span>;
  if (typeof data === "boolean") return <span className="text-purple-400">{data.toString()}</span>;

  if (Array.isArray(data)) {
    return (
      <div className="pl-4">
        [
        <div className="pl-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-start gap-1">
              <JsonViewer 
                shortId={shortId}
                data={item} 
                path={path ? `${path}[${index}]` : `[${index}]`} 
                isRoot={false} 
              />
              {/* {index < data.length - 1 && ","} */}
            </div>
          ))}
        </div>
        ]
      </div>
    );
  }

  if (typeof data === "object") {
    return (
      <div className={isRoot ? "" : "pl-4"}>
        {"{"}
        <div className="pl-4">
          {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
            <div key={key} className="flex items-start gap-1">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">&quot;{key}&quot;</span>
                <CopyButton text={path ? `${path}.${key}` : key} shortId={shortId} />
                :
              </div>
              <div className="flex-1 whitespace-nowrap">
                <JsonViewer 
                  shortId={shortId}
                  data={value} 
                  path={path ? `${path}.${key}` : key} 
                  isRoot={false} 
                />
              </div>
              {/* {index < arr.length - 1 && ","} */}
            </div>
          ))}
        </div>
        {"}"}      
      </div>
    );
  }

  return null;
}

interface NodeOutputDataProps {
  shortId: string;
  outputData: Record<string, unknown>;
  error?: string;
}

export function NodeOutputData({ shortId, outputData, error }: NodeOutputDataProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Output Data</h4>
      <div className="bg-zinc-900 text-gray-100 p-2 rounded-md text-xs overflow-auto max-h-[300px] font-mono">
        {error ? <p className="text-gray-200">{error}</p> : <JsonViewer data={outputData} shortId={shortId} />}
      </div>
    </div>
  );
}
