export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export enum BodyType {
  EMPTY = 'empty',
  RAW = 'raw',
  FORM_URLENCODED = 'x-www-form-urlencoded'
}

export enum ContentType {
  TEXT = 'text/plain',
  JSON = 'application/json',
  XML = 'application/xml',
  TEXT_XML = 'text/xml',
  HTML = 'text/html',
  CUSTOM = 'custom'
}

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface HttpNodeConfig {
  url?: string;
  method?: HttpMethod;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  bodyType?: BodyType;
  body?: {
    contentType?: ContentType;
    customContentType?: string;
    requestContent?: string;
  };
  formData?: Record<string, string>;
}
