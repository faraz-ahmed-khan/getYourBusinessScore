import {
  Building2,
  Truck,
  Store,
  Package,
  FileText,
  Flag,
  type LucideIcon,
} from 'lucide-react';
import type { PathwayId } from '@/lib/pathways';

export type KioskPathwayItem = {
  id: PathwayId;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const KIOSK_PATHWAYS: KioskPathwayItem[] = [
  {
    id: 'business',
    icon: Building2,
    title: 'Business Readiness',
    description: 'Understand your business foundation and operational readiness.',
  },
  {
    id: 'supplier',
    icon: Truck,
    title: 'Supplier Readiness',
    description: 'Assess your readiness to work with suppliers and supply chains.',
  },
  {
    id: 'marketplace',
    icon: Store,
    title: 'Marketplace Readiness',
    description: 'Evaluate your readiness to enter marketplaces and sell products.',
  },
  {
    id: 'distribution',
    icon: Package,
    title: 'Distribution Readiness',
    description: 'Measure your readiness to distribute and expand channels.',
  },
  {
    id: 'contract',
    icon: FileText,
    title: 'Contract Readiness',
    description: 'Check your readiness to pursue contracts and opportunities.',
  },
  {
    id: 'sba',
    icon: Flag,
    title: 'SBA Readiness',
    description: 'Review your readiness for SBA pathways and federal programs.',
  },
];
