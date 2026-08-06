"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_VISIBLE = 5;

export default function ProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL}categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setCategories(data.categories);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const goToShop = (categoryName?: string) => {
    if (categoryName) {
      router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
    } else {
      router.push(`/shop`);
    }
  };

  if (loading) {
    return (
      <section className="cat2-section">
        <div className="cat2-container">
          <TopHeading heading="Shop By Ritual" />
          <div className="cat2-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`cat2-card cat2-skeleton shimmer ${i === 0 ? "cat2-card--hero" : ""}`}
                style={{ animation: "none", opacity: 1 }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="cat2-section">
        <div className="cat2-container">
          <TopHeading heading="Shop By Ritual" />
          <p className="cat2-empty">No categories found</p>
        </div>
      </section>
    );
  }

  const hasMore = categories.length > MAX_VISIBLE;
  const gridItems = hasMore ? categories.slice(0, MAX_VISIBLE - 1) : categories.slice(0, MAX_VISIBLE);
  const [hero, ...rest] = gridItems;

  return (
    <section className="cat2-section">
      <div className="cat2-container">
        <TopHeading heading="Shop By Ritual" />

        <div className="cat2-grid">
          {/* Hero tile */}
          <div
            className="cat2-card cat2-card--hero"
            style={{ animationDelay: "0ms" }}
            onClick={() => goToShop(hero.categoryName)}
          >
            <Image
              src={hero.image_url}
              alt={hero.categoryName}
              fill
              sizes="(max-width: 900px) 78vw, 40vw"
              className="cat2-card-img"
              priority
            />
            <div className="cat2-card-overlay" />
            <span className="cat2-hero-badge">Featured Category</span>
            <div className="cat2-hero-content">
              <h3 className="cat2-hero-title">{hero.categoryName}</h3>
              <button
                className="cat2-hero-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToShop(hero.categoryName);
                }}
              >
                Shop Now <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Remaining tiles */}
          {rest.map((cat, i) => (
            <div
              key={cat.id}
              className="cat2-card"
              style={{ animationDelay: `${(i + 1) * 90}ms` }}
              onClick={() => goToShop(cat.categoryName)}
            >
              <Image
                src={cat.image_url}
                alt={cat.categoryName}
                fill
                sizes="(max-width: 900px) 78vw, 20vw"
                className="cat2-card-img"
              />
              <div className="cat2-card-overlay" />
              <div className="cat2-card-caption">
                <span className="cat2-card-name">{cat.categoryName}</span>
                <span className="cat2-card-arrow">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          ))}

          {/* View all tile, only if more categories exist */}
          {hasMore && (
            <div
              className="cat2-card cat2-viewall"
              style={{ animationDelay: `${gridItems.length * 90}ms` }}
              onClick={() => goToShop()}
            >
              <span className="cat2-viewall-count">+{categories.length - gridItems.length}</span>
              <span className="cat2-viewall-text">View All</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}