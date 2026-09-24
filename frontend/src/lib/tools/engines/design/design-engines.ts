/**
 * OmniTools - Pure CSS & Design Generator Engine
 * CSS Gradients, Box Shadows, and CSS Unit conversions.
 */

export interface ColorStop {
  color: string;
  positionPercent: number;
}

export interface GradientOptions {
  type: 'linear' | 'radial';
  angleDegrees: number;
  stops: ColorStop[];
}

export function generateCssGradient(options: GradientOptions): string {
  const { type, angleDegrees, stops } = options;
  if (!stops || stops.length === 0) return 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)';

  const sorted = [...stops].sort((a, b) => a.positionPercent - b.positionPercent);
  const stopsCss = sorted.map((s) => `${s.color} ${s.positionPercent}%`).join(', ');

  if (type === 'radial') {
    return `radial-gradient(circle, ${stopsCss})`;
  }
  return `linear-gradient(${angleDegrees}deg, ${stopsCss})`;
}

export interface BoxShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export function generateBoxShadowCss(layers: BoxShadowLayer[]): string {
  if (!layers || layers.length === 0) return 'none';

  return layers
    .map((l) => {
      const insetStr = l.inset ? 'inset ' : '';
      return `${insetStr}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`;
    })
    .join(', ');
}

export function convertCssUnits(
  value: number,
  fromUnit: 'px' | 'rem' | 'em' | 'vw',
  baseFontSize = 16,
  viewportWidth = 1920
): { px: number; rem: number; em: number; vw: number } {
  const base = Math.max(1, baseFontSize);
  const vwBase = Math.max(1, viewportWidth);

  let inPx = 0;
  if (fromUnit === 'px') inPx = value;
  else if (fromUnit === 'rem') inPx = value * base;
  else if (fromUnit === 'em') inPx = value * base;
  else if (fromUnit === 'vw') inPx = (value * vwBase) / 100;

  return {
    px: Number(inPx.toFixed(2)),
    rem: Number((inPx / base).toFixed(4)),
    em: Number((inPx / base).toFixed(4)),
    vw: Number(((inPx / vwBase) * 100).toFixed(4)),
  };
}
