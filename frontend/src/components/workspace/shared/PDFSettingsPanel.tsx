import React from 'react';
import { SettingSchema } from '@/lib/tool-registry/types';
import styles from './Shared.module.css';

interface PDFSettingsPanelProps {
  settings: SettingSchema[];
  values: Record<string, string | number | boolean>;
  onChange: (id: string, value: string | number | boolean) => void;
  title?: string;
}

export function PDFSettingsPanel({ settings, values, onChange, title = 'Settings' }: PDFSettingsPanelProps) {
  if (!settings || settings.length === 0) return null;

  return (
    <div className={styles.settingsPanel}>
      {title && <div className={styles.settingsTitle}>{title}</div>}
      
      {settings.map(setting => {
        const value = values[setting.id] !== undefined ? values[setting.id] : setting.defaultValue;
        
        return (
          <div key={setting.id} className={styles.settingGroup}>
            <label htmlFor={setting.id} className={styles.settingLabel}>{setting.label}</label>
            {setting.description && (
              <p className={styles.settingDesc}>{setting.description}</p>
            )}
            
            {setting.type === 'select' && setting.options && (
              <select 
                id={setting.id}
                className={styles.settingInput}
                value={(value as string | number) || ''}
                onChange={(e) => onChange(setting.id, e.target.value)}
              >
                {setting.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            
            {setting.type === 'range' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="range"
                  id={setting.id}
                  className={styles.settingInput}
                  style={{ flex: 1, padding: 0, border: 'none', background: 'transparent' }}
                  min={setting.min}
                  max={setting.max}
                  step={setting.step}
                  value={(value as string | number) || 0}
                  onChange={(e) => onChange(setting.id, Number(e.target.value))}
                />
                <span style={{ fontSize: '0.875rem', width: '40px', textAlign: 'right' }}>{String(value)}</span>
              </div>
            )}
            
            {setting.type === 'text' && (
              <input 
                type="text"
                id={setting.id}
                className={styles.settingInput}
                placeholder={setting.placeholder}
                value={(value as string | number) || ''}
                onChange={(e) => onChange(setting.id, e.target.value)}
              />
            )}

            {setting.type === 'password' && (
              <input 
                type="password"
                id={setting.id}
                className={styles.settingInput}
                placeholder={setting.placeholder}
                value={(value as string | number) || ''}
                onChange={(e) => onChange(setting.id, e.target.value)}
              />
            )}
            
            {setting.type === 'number' && (
              <input 
                type="number"
                id={setting.id}
                className={styles.settingInput}
                min={setting.min}
                max={setting.max}
                step={setting.step}
                placeholder={setting.placeholder}
                value={(value as string | number) || ''}
                onChange={(e) => onChange(setting.id, Number(e.target.value))}
              />
            )}

            {setting.type === 'boolean' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input 
                  type="checkbox"
                  id={setting.id}
                  checked={!!value}
                  onChange={(e) => onChange(setting.id, e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem' }}>Enable</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
