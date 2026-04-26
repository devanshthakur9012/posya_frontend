"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";
import SectionLoader from "./SectionLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUTOSCROLL_INTERVAL = 3000; // ms between auto-advances

export default function ProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setCategories(data.categories);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % categories.length),
    [categories.length]
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + categories.length) % categories.length),
    [categories.length]
  );

  // Autoscroll: starts when categories load, pauses on hover/interaction
  useEffect(() => {
    if (categories.length === 0) return;

    if (!isPaused) {
      intervalRef.current = setInterval(next, AUTOSCROLL_INTERVAL);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [categories.length, isPaused, next]);

  // Pause autoscroll temporarily after manual navigation, then resume
  const manualNav = useCallback((action: () => void) => {
    action();
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const resumeTimeout = setTimeout(() => setIsPaused(false), 5000);
    return () => clearTimeout(resumeTimeout);
  }, []);

  if (loading) return <SectionLoader count={3} shape="circle" />;

  if (categories.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500 text-lg">No categories found</p>
    );
  }

  const goToShop = (categoryName: string) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const leftIdx = (activeIndex - 1 + categories.length) % categories.length;
  const centerIdx = activeIndex;
  const rightIdx = (activeIndex + 1) % categories.length;

  const visibleCards = [
    { cat: categories[leftIdx], pos: "left" },
    { cat: categories[centerIdx], pos: "center" },
    { cat: categories[rightIdx], pos: "right" },
  ];

  return (
    <section className="py-12 px-4 md:px-12">
      <TopHeading heading="Discover Our Essentials" />

      <div
        className="cat-slider-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Prev button */}
        <button
          className="cat-slider-btn cat-slider-btn--left"
          onClick={() => manualNav(prev)}
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Cards track */}
        <div className="cat-slider-track">
          {visibleCards.map(({ cat, pos }) => (
            <div
              key={`${cat.id}-${pos}`}
              onClick={() =>
                pos === "center"
                  ? goToShop(cat.categoryName)
                  : manualNav(pos === "left" ? prev : next)
              }
              className={`cat-card cat-card--${pos}`}
            >
              <Image
                src={cat.image_url}
                alt={cat.categoryName}
                fill
                className="object-cover cat-card-img"
              />
              {/* Dark overlay */}
              <div className="cat-card-overlay" />

              {/* Label */}
              <div className="cat-card-label">
                <h3 className="cat-card-name">{cat.categoryName}</h3>
                {pos === "center" && (
                  <button
                    className="cat-card-shop-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToShop(cat.categoryName);
                    }}
                  >
                    Shop Now →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          className="cat-slider-btn cat-slider-btn--right"
          onClick={() => manualNav(next)}
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dots */}
      <div className="cat-dots">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              manualNav(() => setActiveIndex(i));
            }}
            className={`cat-dot ${i === activeIndex ? "cat-dot--active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}