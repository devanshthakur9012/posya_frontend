"use client";
import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import Link from "next/link";

export default function OrganicSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCanLoadVideo(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden">

      {canLoadVideo && (
        <video
          ref={videoRef}
          src="/images/home-video.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 transition duration-500 ${isPlaying ? "bg-black/30" : "bg-black/60"}`} />

      {/* All content centered */}
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

        {/* Play button BELOW the text */}
        <button
          onClick={togglePlay}
          className="bg-white/80 p-4 rounded-full hover:bg-white transition"
        >
          {isPlaying ? (
            <Pause size={22} className="text-black" />
          ) : (
            <Play size={22} className="text-black" />
          )}
        </button>
      </div>

    </section>
  );
}