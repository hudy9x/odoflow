import type { ReactNode } from 'react';

export interface CarouselItem {
  id: number;
  icon: ReactNode;
  heading: string;
  image: string;
  style?: React.CSSProperties;
  description: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  className?: string;
}

export interface CarouselNavigatorProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export interface CarouselControlProps {
  direction: 'left' | 'right';
  onClick: () => void;
}
