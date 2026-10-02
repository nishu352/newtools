'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';
import {
  generateCssGradient,
  generateBoxShadowCss,
  convertCssUnits,
  ColorStop,
  BoxShadowLayer,
} from '@/lib/tools/engines/design/design-engines';

export function CssGradientGeneratorTool() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState<number>(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#2563eb', positionPercent: 0 },
    { color: '#06b6d4', positionPercent: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const cssValue = useMemo(() => {
    return generateCssGradient({ type, angleDegrees: angle, stops });
  }, [type, angle, stops]);

  const addStop = () => {
    if (stops.length >= 6) return;
    setStops([...stops, { color: '#8b5cf6', positionPercent: 50 }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, field: keyof ColorStop, value: string | number) => {
    setStops(
      stops.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${cssValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div
        className="w-full h-44 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner transition-all flex items-center justify-center"
        style={{ background: cssValue }}
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-100 shadow-sm">
          Live Preview
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Gradient Style
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setType('linear')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                type === 'linear'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setType('radial')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                type === 'radial'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Radial
            </button>
          </div>
        </div>

        {type === 'linear' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Angle: {angle}°
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Color Stops ({stops.length}/6)
          </label>
          {stops.length < 6 && (
            <button
              onClick={addStop}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stop
            </button>
          )}
        </div>

        <div className="space-y-3">
          {stops.map((stop, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
            >
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(idx, 'color', e.target.value)}
                className="w-9 h-9 p-0.5 rounded cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(idx, 'color', e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.positionPercent}
                  onChange={(e) => updateStop(idx, 'positionPercent', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-9 text-right">
                  {stop.positionPercent}%
                </span>
              </div>
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(idx)}
                  className="p-1 text-red-500 hover:text-red-600 transition-colors"
                  aria-label="Remove stop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 flex items-center justify-between gap-4">
        <code className="text-xs font-mono break-all text-cyan-400">
          background: {cssValue};
        </code>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shrink-0 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
}

export function CssBoxShadowGeneratorTool() {
  const [layers, setLayers] = useState<BoxShadowLayer[]>([
    { x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', opacity: 0.1, inset: false },
    { x: 0, y: 4, blur: 6, spread: -2, color: 'rgba(0, 0, 0, 0.05)', opacity: 0.05, inset: false },
  ]);
  const [copied, setCopied] = useState(false);

  const shadowCss = useMemo(() => generateBoxShadowCss(layers), [layers]);

  const addLayer = () => {
    if (layers.length >= 4) return;
    setLayers([
      ...layers,
      { x: 0, y: 8, blur: 20, spread: 0, color: 'rgba(37, 99, 235, 0.2)', opacity: 0.2, inset: false },
    ]);
  };

  const removeLayer = (idx: number) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter((_, i) => i !== idx));
  };

  const updateLayer = (idx: number, field: keyof BoxShadowLayer, val: unknown) => {
    setLayers(layers.map((l, i) => (i === idx ? { ...l, [field]: val } : l)));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowCss};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="w-full h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
        <div
          className="w-48 h-28 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300"
          style={{ boxShadow: shadowCss }}
        >
          Preview Box
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Shadow Layers ({layers.length}/4)
          </label>
          {layers.length < 4 && (
            <button
              onClick={addLayer}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Layer
            </button>
          )}
        </div>

        {layers.map((layer, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3"
          >
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Layer #{idx + 1}</span>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layer.inset}
                    onChange={(e) => updateLayer(idx, 'inset', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Inset
                </label>
                {layers.length > 1 && (
                  <button
                    onClick={() => removeLayer(idx)}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Remove layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500">X Offset: {layer.x}px</span>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={layer.x}
                  onChange={(e) => updateLayer(idx, 'x', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <span className="text-slate-500">Y Offset: {layer.y}px</span>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={layer.y}
                  onChange={(e) => updateLayer(idx, 'y', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <span className="text-slate-500">Blur: {layer.blur}px</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={layer.blur}
                  onChange={(e) => updateLayer(idx, 'blur', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <span className="text-slate-500">Spread: {layer.spread}px</span>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={layer.spread}
                  onChange={(e) => updateLayer(idx, 'spread', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 flex items-center justify-between gap-4">
        <code className="text-xs font-mono break-all text-cyan-400">
          box-shadow: {shadowCss};
        </code>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shrink-0 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
}

export function CssUnitConverterTool() {
  const [val, setVal] = useState<number>(16);
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | 'vw'>('px');
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const converted = useMemo(() => {
    return convertCssUnits(val, unit, baseFontSize, viewportWidth);
  }, [val, unit, baseFontSize, viewportWidth]);

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Input Value
          </label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Source Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em' | 'vw')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="px">Pixels (px)</option>
            <option value="rem">Root EM (rem)</option>
            <option value="em">Relative EM (em)</option>
            <option value="vw">Viewport Width (vw)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Base Font Size (px)
          </label>
          <input
            type="number"
            min="1"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Viewport Width (px)
          </label>
          <input
            type="number"
            min="100"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pixels', value: `${converted.px}px`, key: 'px' },
          { label: 'REM', value: `${converted.rem}rem`, key: 'rem' },
          { label: 'EM', value: `${converted.em}em`, key: 'em' },
          { label: 'Viewport Width', value: `${converted.vw}vw`, key: 'vw' },
        ].map((item) => (
          <div
            key={item.key}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
            <div className="my-2 text-lg font-bold font-mono text-blue-600 dark:text-cyan-400 break-all">
              {item.value}
            </div>
            <button
              onClick={() => copyVal(item.value, item.key)}
              className="inline-flex items-center justify-center gap-1 w-full py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === item.key ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
