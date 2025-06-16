export type KeyValuePair = {
  id: string;
  key: string;
  value: string;
};

export const createId = () => `${Date.now()}-${Math.random()}`;

export const jsonToKeyValuePairs = (jsonString: string): KeyValuePair[] => {
  try {
    const parsed = JSON.parse(jsonString);
    return Object.entries(parsed).map(([key, value]) => ({
      id: createId(),
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value)
    }));
  } catch {
    return [];
  }
};

export const keyValuePairsToJson = (pairs: KeyValuePair[]): string => {
  const obj = pairs.reduce((acc, { key, value }) => {
    try {
      acc[key] = JSON.parse(value);
    } catch {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
  
  return JSON.stringify(obj, null, 2);
};
