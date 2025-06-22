"use client";
import { useState } from 'react';
import { CarouselProps } from './types';
import { CarouselControl } from './CarouselControl';
import { CarouselNavigator } from './CarouselNavigator';
import './style.css'

export const Carousel = ({ items, className = '' }: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const previous = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className={`carousel-wrapper relative h-[570px] w-[550px] ${className}`}>
    
      <div className="carousel-content relative h-full w-full">
        <div
          className="carousel flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex h-full w-full shrink-0 flex-col items-center justify-center bg-gray-100 px-4"
            >
              <div className="mb-4 text-4xl rounded-lg border-4 border-white shadow-lg text-white">{item.icon}</div>
              <h2 className="mb-6 text-2xl font-bold">{item.heading}</h2>
              <div className="w-[450px] h-[300px] shrink-0 grow-0 border-8 border-white shadow-lg bg-white rounded-lg overflow-hidden relative">
                <div className="absolute w-full h-full overflow-hidden rounded">
                  <img
                    src={item.image}
                    alt={item.heading}
                    style={item.style}
                    className="max-w-none absolute"
                />
                </div>
              </div>
              <p className="w-[400px] mt-12 text-center text-gray-600">{item.description}</p>
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
