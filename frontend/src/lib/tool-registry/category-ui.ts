import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Presentation,
  RefreshCw,
  Type,
  Code,
  Wrench,
  Grid,
  Layers,
  LucideIcon
} from 'lucide-react';
import { normalizeCategorySlug } from './categories';

export interface CategoryUiConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; // e.g. text color
  bgColor: string; // e.g. subtle background
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORY_UI_MAP: Record<string, CategoryUiConfig> = {
  all: {
    id: 'all',
    name: 'All Tools',
    icon: Grid,
    color: '#FF5722',
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    badgeBg: '#FFF7ED',
    badgeText: '#EA580C',
  },
  pdf: {
    id: 'pdf',
    name: 'PDF Tools',
    icon: FileText,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    badgeBg: '#FEF2F2',
    badgeText: '#DC2626',
  },
  image: {
    id: 'image',
    name: 'Image Tools',
    icon: ImageIcon,
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    badgeBg: '#ECFDF5',
    badgeText: '#059669',
  },
  images: {
    id: 'image',
    name: 'Image Tools',
    icon: ImageIcon,
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    badgeBg: '#ECFDF5',
    badgeText: '#059669',
  },
  documents: {
    id: 'documents',
    name: 'Document Tools',
    icon: FileText,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    badgeBg: '#EFF6FF',
    badgeText: '#2563EB',
  },
  excel: {
    id: 'excel',
    name: 'Excel Tools',
    icon: FileSpreadsheet,
    color: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#DCFCE7',
    badgeBg: '#F0FDF4',
    badgeText: '#15803D',
  },
  powerpoint: {
    id: 'powerpoint',
    name: 'PowerPoint Tools',
    icon: Presentation,
    color: '#F97316',
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    badgeBg: '#FFF7ED',
    badgeText: '#C2410C',
  },
  converters: {
    id: 'converters',
    name: 'File Converters',
    icon: RefreshCw,
    color: '#06B6D4',
    bgColor: '#ECFEFF',
    borderColor: '#CFFAFE',
    badgeBg: '#ECFEFF',
    badgeText: '#0891B2',
  },
  text: {
    id: 'text',
    name: 'Text Tools',
    icon: Type,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    borderColor: '#FCE7F3',
    badgeBg: '#FDF2F8',
    badgeText: '#DB2777',
  },
  developer: {
    id: 'developer',
    name: 'Developer Tools',
    icon: Code,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    borderColor: '#E0E7FF',
    badgeBg: '#EEF2FF',
    badgeText: '#4F46E5',
  },
  utilities: {
    id: 'utilities',
    name: 'Utility Tools',
    icon: Wrench,
    color: '#64748B',
    bgColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    badgeBg: '#F1F5F9',
    badgeText: '#475569',
  },
};

export function getCategoryUi(categoryIdOrSlug: string): CategoryUiConfig {
  const normalized = normalizeCategorySlug(categoryIdOrSlug);
  return (
    CATEGORY_UI_MAP[normalized] ||
    CATEGORY_UI_MAP[categoryIdOrSlug.toLowerCase()] || {
      id: normalized,
      name: categoryIdOrSlug,
      icon: Layers,
      color: '#64748B',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      badgeBg: '#F1F5F9',
      badgeText: '#475569',
    }
  );
}
