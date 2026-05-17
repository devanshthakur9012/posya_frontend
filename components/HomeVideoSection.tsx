"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function OrganicSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCanLoadVideo(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (canLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [canLoadVideo]);

  return (
    <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden">

      {canLoadVideo && (
        <video
          ref={videoRef}
          src="/images/home-video.mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-3">
          We Produce Organically
        </h2>
        <p className="text-sm md:text-base leading-relaxed mb-6 max-w-md">
          Explore our organic products that we produce straight from the lap of
          the Himalayas
        </p>
        <Link href="/shop" prefetch={false} className="explore-btn btn mb-8 md:w-50">
          Start Shopping Now..
        </Link>
      </div>

    </section>
  );
}