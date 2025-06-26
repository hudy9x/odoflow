export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface NodeCodeScriptConfig {
  variables: Record<string, string>;
  script: string;
}

export interface NodeData {
  shortId?: string;
  id: string;
  config?: NodeCodeScriptConfig;
}
