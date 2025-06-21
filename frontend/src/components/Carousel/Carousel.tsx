"use client";
import { useState } from 'react';
import { CarouselProps } from './types';
import { CarouselControl } from './CarouselControl';
import { CarouselNavigator } from './CarouselNavigator';

export const Carousel = ({ items, className = '' }: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const previous = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className={`relative h-[550px] w-[600px] ${className}`}>
    
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="carousel flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex h-full w-full shrink-0 flex-col items-center justify-center bg-gray-100 px-4"
            >
              <div className="mb-4 text-4xl bg-zinc-500 rounded-lg border-4 border-white shadow-lg text-white p-2">{item.icon}</div>
              <h2 className="mb-6 text-2xl font-bold">{item.heading}</h2>
              <div className="w-[450px] h-[300px] shrink-0 grow-0 border-8 border-white shadow-lg bg-gray-100 rounded-lg overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.heading}
                  style={item.style}
                  className="max-w-none absolute"
                />
              </div>
              <p className="w-[350px] mt-12 text-center text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <CarouselControl direction="left" onClick={previous} />
        <CarouselControl direction="right" onClick={next} />
       
      </div>
      <CarouselNavigator
          total={items.length}
          current={current}
          onSelect={setCurrent}
        />
    </div>
  );
};
