import React, { useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  direction?: "forward" | "backward";
  axis?: "x" | "y";
};

const AutoScrollComponent: React.FC<PropType> = ({
  slides,
  options,
  direction = "backward",
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, loop: true }, [
    AutoScroll({
      playOnInit: true,
      direction: direction,
      speed: 1,
    }),
  ]);

  const [scrollSnapshotIndex, setScrollSnapshotIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setScrollSnapshotIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on("select", onSelect);
      onSelect();

      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi && scrollSnapshotIndex !== null) {
      emblaApi.scrollTo(scrollSnapshotIndex);
    }
  }, [emblaApi, scrollSnapshotIndex]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="flex-[0_0_20%] min-w-0">
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoScrollComponent;
