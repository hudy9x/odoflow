import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { atomone } from '@uiw/codemirror-theme-atomone';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  width?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  height = '200px',
  width = '100%',
}: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      height={height}
      width={width}
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
  );
}
