import type { VendorId } from './types';
import { VENDOR_CONFIG } from './vendors';

interface UpstreamRequest {
  url: string;
  headers: Record<string, string>;
  body: string;
}

export function buildUpstreamRequest(
  vendor: VendorId,
  masterKey: string,
  rawBody: string
): UpstreamRequest {
  const config = VENDOR_CONFIG[vendor];

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.authStyle === 'bearer') {
    headers['Authorization'] = `Bearer ${masterKey}`;
  } else {
    headers['x-api-key'] = masterKey;
    headers['anthropic-version'] = '2023-06-01';
  }

  return {
    url: config.endpoint,
    headers,
    body: rawBody,
  };
}
