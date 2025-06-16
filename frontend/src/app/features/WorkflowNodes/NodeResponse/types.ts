export interface ResponseNodeConfig {
  statusCode: string;
  headers: Array<{
    id: string;
    key: string;
    value: string;
  }>;
  responseData: string; // JSON string
}

// Common HTTP status codes for autocomplete
export const commonStatusCodes = [
  '200', // OK
  '201', // Created
  '204', // No Content
  '400', // Bad Request
  '401', // Unauthorized
  '403', // Forbidden
  '404', // Not Found
  '500', // Internal Server Error
  '502', // Bad Gateway
  '503', // Service Unavailable
] as const;

export interface NodeData {
  id: string;
  config?: ResponseNodeConfig;
}
