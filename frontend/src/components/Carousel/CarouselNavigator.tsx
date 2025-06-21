import { CarouselNavigatorProps } from './types';

export const CarouselNavigator = ({
  total,
  current,
  onSelect,
}: CarouselNavigatorProps) => {
  return (
    <div className="flex gap-2 justify-center mt-10 ">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-3 w-3 cursor-pointer rounded-full transition-all ${
            current === index ? 'bg-white shadow-md' : 'bg-gray-400'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};
