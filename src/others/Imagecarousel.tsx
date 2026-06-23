import { useEffect, useState, useRef } from "react";

// IMPORT IMAGES
import edu1 from "../images/cara_img1.jpeg";
import edu2 from "../images/cara_img2.jpg";
import edu3 from "../images/cara_img3.jpg";
import edu4 from "../images/cara_img4.jpeg";

export default function ImageCarousel() {
  const images = [edu1, edu2, edu3, edu4];
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);

  /* Auto Slide */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  /* Swipe Handlers */
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    startX.current =
      "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const endX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;

    const diff = startX.current - endX;

    if (diff > 50) {
      setCurrent((prev) => (prev + 1) % images.length);
    } else if (diff < -50) {
      setCurrent((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section className="w-full overflow-hidden">
      <div
        className="relative w-full
                   h-[220px] sm:h-[300px] md:h-[420px] lg:h-[520px]"
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
      >
        {/* Image */}
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                current === index
                  ? "bg-white"
                  : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
