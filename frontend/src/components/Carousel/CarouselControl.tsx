import { CarouselControlProps } from './types';
import { MoveLeft, MoveRight } from 'lucide-react';

export const CarouselControl = ({ direction, onClick }: CarouselControlProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${
        direction === 'left' ? '-left-6' : '-right-6'
      } z-10 flex h-12 w-12 items-center cursor-pointer justify-center rounded-full bg-white/80 active:shadow-sm shadow-md hover:bg-white`}
      aria-label={`${direction} control`}
    >
      {direction === 'left' ? <MoveLeft className="h-5 w-5" /> : <MoveRight className="h-5 w-5" />}
    </button>
  );
};
