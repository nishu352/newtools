'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Wifi,
  User,
  Globe,
  FileText,
  Mail,
  Phone,
  QrCode,
} from 'lucide-react';
import {
  generateQrSvg,
  formatWifiString,
  formatVCardString,
  WifiQrParams,
  VCardQrParams,
} from '@/lib/tools/engines/qr/qr-engines';

export function QrGeneratorTool() {
  const [tab, setTab] = useState<'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone'>('url');

  // Input states
  const [url, setUrl] = useState('https://omnitools.app');
  const [text, setText] = useState('Hello from OmniTools!');
  const [wifi, setWifi] = useState<WifiQrParams>({ ssid: 'MyWiFiNetwork', password: '', authType: 'WPA' });
  const [vcard, setVcard] = useState<VCardQrParams>({ firstName: 'Jane', lastName: 'Doe', phone: '+1234567890', email: 'jane@example.com' });
  const [email, setEmail] = useState('contact@example.com');
  const [emailSubject, setEmailSubject] = useState('');
  const [phone, setPhone] = useState('+1234567890');

  // Appearance
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const qrPayload = useMemo(() => {
    switch (tab) {
      case 'url':
        return url;
      case 'text':
        return text;
      case 'wifi':
        return formatWifiString(wifi);
      case 'vcard':
        return formatVCardString(vcard);
      case 'email':
        return emailSubject ? `mailto:${email}?subject=${encodeURIComponent(emailSubject)}` : `mailto:${email}`;
      case 'phone':
        return `tel:${phone}`;
      default:
        return url;
    }
  }, [tab, url, text, wifi, vcard, email, emailSubject, phone]);

  const svgContent = useMemo(() => {
    if (!qrPayload.trim()) return '';
    try {
      return generateQrSvg(qrPayload, 8, 4, darkColor, lightColor);
    } catch {
      return '';
    }
  }, [qrPayload, darkColor, lightColor]);

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `omnitools-qrcode-${tab}.svg`;
    a.click();
    URL.revokeObjectURL(u);
  };

  const handleDownloadPng = () => {
    if (!svgContent) return;
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const u = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 512, 512);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `omnitools-qrcode-${tab}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(u);
    };
    img.src = u;
  };

  const handleCopySvg = () => {
    if (!svgContent) return;
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60">
        {[
          { key: 'url', label: 'URL / Web', icon: Globe },
          { key: 'text', label: 'Plain Text', icon: FileText },
          { key: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { key: 'vcard', label: 'vCard Contact', icon: User },
          { key: 'email', label: 'Email', icon: Mail },
          { key: 'phone', label: 'Phone', icon: Phone },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                tab === item.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {tab === 'url' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          )}

          {tab === 'text' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Plain Text
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
          )}

          {tab === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
                  <input
                    type="text"
                    value={wifi.password}
                    onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Security Type</label>
                  <select
                    value={wifi.authType}
                    onChange={(e) => setWifi({ ...wifi, authType: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'vcard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                <input
                  type="text"
                  value={vcard.firstName}
                  onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                <input
                  type="text"
                  value={vcard.lastName || ''}
                  onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={vcard.phone || ''}
                  onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={vcard.email || ''}
                  onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Recipient</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject (optional)</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          {tab === 'phone' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">QR Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-20 px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-20 px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div
            ref={previewRef}
            className="w-48 h-48 bg-white p-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          <div className="w-full mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadPng}
                disabled={!svgContent}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> PNG
              </button>
              <button
                onClick={handleDownloadSvg}
                disabled={!svgContent}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> SVG
              </button>
            </div>
            <button
              onClick={handleCopySvg}
              disabled={!svgContent}
              className="w-full py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied SVG Markup' : 'Copy SVG Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QrScannerTool() {
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    // Client-side image processing for QR metadata
    const reader = new FileReader();
    reader.onload = () => {
      // In high-security client-side environments without native barcode detector,
      // fallback to message or BarcodeDetector API if available
      if ('BarcodeDetector' in window) {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = async () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await detector.detect(img);
            if (barcodes && barcodes.length > 0) {
              setDecodedText(barcodes[0].rawValue);
            } else {
              setDecodedText('No QR Code detected in this image. Please ensure the QR code is clear and high-contrast.');
            }
          } catch {
            setDecodedText('QR code detection not supported on this browser engine. Try another image or browser.');
          } finally {
            setIsProcessing(false);
          }
        };
      } else {
        setIsProcessing(false);
        setDecodedText('QR code scan uploaded. Native BarcodeDetector is not enabled in this browser. Please use Chrome/Edge or generate codes directly with the QR Generator.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!decodedText) return;
    navigator.clipboard.writeText(decodedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-4 bg-slate-50 dark:bg-slate-900/40">
        <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-cyan-400">
          <QrCode className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Upload QR Code Image to Scan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supports PNG, JPG, WebP, SVG. 100% Client-side and private.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-all active:scale-95">
          Select QR Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {isProcessing && (
        <div className="text-center text-xs text-slate-500 py-3">
          Analyzing QR matrix...
        </div>
      )}

      {decodedText && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Scanned Content
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            {decodedText}
          </p>
        </div>
      )}
    </div>
  );
}
