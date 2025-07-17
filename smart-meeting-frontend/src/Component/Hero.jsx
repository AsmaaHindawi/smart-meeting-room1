import React, { useEffect, useState } from 'react';

const slides = [
  {
    image: '/Images/meet.jpg',
    text: (
      <>
        <span className="text-[#64c8e0]">Meet </span>
        <span className="text-[#7d64fb]">Smarter</span><br />
        <span className="text-[#7d64fb]">Not Harder</span>
      </>
    ),
  },
  {
    image: '/Images/meet2.jpg',
    text: (
      <>
        <span className="text-[#64c8e0]">Plan </span>
        <span className="text-[#7d64fb]">Effectively</span><br />
        <span className="text-[#7d64fb]">Stay Aligned</span>
      </>
    ),
  },
  {
    image: '/Images/meet3.jpg',
    text: (
      <>
        <span className="text-[#64c8e0]">Collaborate </span>
        <span className="text-[#7d64fb]">Seamlessly</span><br />
        <span className="text-[#7d64fb]">From Anywhere</span>
      </>
    ),
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden shadow-2xl mx-auto">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              {slide.text}
            </h1>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i === current ? 'bg-[#7d64fb]' : 'bg-[#2c2e5f]/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
