/**
 * Centralized API Client for Server-Side Processing
 * Abstracting upload, process, status, and download requests
 */

export interface ApiProcessOptions {
  slug: string;
  files: File[];
  settings?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

export interface ApiProcessResponse {
  success: boolean;
  filename?: string;
  mimeType?: string;
  size?: number;
  outputBase64?: string;
  error?: string;
  pageCount?: number;
  originalSize?: number;
  reductionPercent?: number;
}

export class ToolApiClient {
  private static baseUrl = '/api/tools';

  /**
   * Sends files and settings to the server processing endpoint.
   */
  public static async processTool(options: ApiProcessOptions): Promise<ApiProcessResponse> {
    const { slug, files, settings, signal } = options;

    const formData = new FormData();
    for (const f of files) {
      formData.append('file', f);
    }

    if (settings) {
      formData.append('settings', JSON.stringify(settings));
    }

    const response = await fetch(`${this.baseUrl}/${slug}`, {
      method: 'POST',
      body: formData,
      signal,
    });

    const data: ApiProcessResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Server processing failed with HTTP ${response.status}`);
    }

    return data;
  }

  /**
   * Helper to convert Base64 string to a downloadable Blob.
   */
  public static base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays as unknown as BlobPart[], { type: mimeType });
  }

  /**
   * Downloads a Blob directly to the client's device with proper cleanup.
   */
  public static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
