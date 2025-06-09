interface NodeOutputDataProps {
  outputData: Record<string, unknown>;
}

export function NodeOutputData({ outputData }: NodeOutputDataProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Output Data</h4>
      <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-[300px]">
        {JSON.stringify(outputData, null, 2)}
      </pre>
    </div>
  );
}
