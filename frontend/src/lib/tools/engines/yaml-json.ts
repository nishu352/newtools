/**
 * Pure YAML <-> JSON Conversion Engine
 * Safe parsing and stringification via the standard 'yaml' package.
 */
import YAML from 'yaml';

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  line?: number;
  column?: number;
}

export function yamlToJson(yamlString: string, indent = 2): ConversionResult {
  const trimmed = yamlString.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    const parsed = YAML.parse(yamlString);
    if (parsed === undefined) {
      return { success: true, output: '' };
    }
    const jsonOutput = JSON.stringify(parsed, null, indent);
    return { success: true, output: jsonOutput };
  } catch (err: unknown) {
    let errorMsg = 'Failed to parse YAML.';
    let line: number | undefined;
    let col: number | undefined;

    if (err instanceof Error) {
      errorMsg = err.message;
      // YAML error objects often have linePos: [{ line, col }, ...]
      const yErr = err as unknown as { linePos?: Array<{ line: number; col: number }> };
      if (yErr.linePos && yErr.linePos.length > 0) {
        line = yErr.linePos[0].line;
        col = yErr.linePos[0].col;
      }
    }

    return {
      success: false,
      output: '',
      error: errorMsg,
      line,
      column: col,
    };
  }
}

export function jsonToYaml(jsonString: string): ConversionResult {
  const trimmed = jsonString.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    const parsed = JSON.parse(jsonString);
    const yamlOutput = YAML.stringify(parsed, { indent: 2 });
    return { success: true, output: yamlOutput };
  } catch (err: unknown) {
    let errorMsg = 'Invalid JSON input.';
    let line: number | undefined;
    let col: number | undefined;

    if (err instanceof Error) {
      errorMsg = err.message;
      // Extract position from "at position X" if available
      const posMatch = err.message.match(/at position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const textBefore = jsonString.substring(0, pos);
        const lines = textBefore.split('\n');
        line = lines.length;
        col = lines[lines.length - 1].length + 1;
      }
    }

    return {
      success: false,
      output: '',
      error: errorMsg,
      line,
      column: col,
    };
  }
}
