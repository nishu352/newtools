import * as React from 'react';
import {
  Braces,
  Binary,
  FileText,
  Calculator,
  Coins,
  Globe,
  Image as ImageIcon,
  Files,
  Wrench,
  Percent,
  PiggyBank,
  Link,
  KeyRound,
  FileImage,
  Code2,
  Type,
  Hash,
  Scale,
  Tag,
  ListFilter,
  GitCompare,
  Palette,
  Pipette,
  Database,
  TrendingUp,
  Sparkles,
  Sliders,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Braces,
  Binary,
  FileText,
  Calculator,
  Coins,
  Globe,
  Image: ImageIcon,
  Files,
  Wrench,
  Percent,
  PiggyBank,
  Link,
  KeyRound,
  FileImage,
  Code2,
  Type,
  Hash,
  Scale,
  Tag,
  ListFilter,
  GitCompare,
  Palette,
  Pipette,
  Database,
  TrendingUp,
  Sparkles,
  Sliders,
};

interface ToolIconProps extends LucideProps {
  name: string;
}

export function ToolIcon({ name, ...props }: ToolIconProps) {
  const IconComponent = ICON_MAP[name] || Wrench;
  return <IconComponent {...props} />;
}
