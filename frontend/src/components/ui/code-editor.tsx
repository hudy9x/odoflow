import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { atomone } from '@uiw/codemirror-theme-atomone';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { Portal } from '@radix-ui/react-portal';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  height = '200px',
}: CodeEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const editorContent = (
    <div className="relative">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="absolute right-2 top-2 z-10 transition-opacity hover:opacity-100 opacity-50"
        onClick={handleExpandToggle}
      >
        {isExpanded ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
      <CodeMirror
      value={value}
      onChange={onChange}
      height={isExpanded ? 'calc(100vh - 6rem)' : height}
      width="100%"
      theme={atomone}
      placeholder={placeholder}
      className=""
      style={{
        fontSize: '12px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}
      extensions={[javascript()]}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        foldGutter: true,
        bracketMatching: true,
        autocompletion: true,
      }}

      />
    </div>
  );

  if (isExpanded) {
    return (
      <Portal>
        <div className="fixed inset-y-20 right-4 w-1/2 z-50 bg-background border rounded-lg shadow-2xl p-2 transition-all duration-200 h-[calc(100vh-6rem)]">
          {editorContent}
        </div>
      </Portal>
    );
  }

  return editorContent;
}
