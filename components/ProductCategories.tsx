"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";
import { ArrowRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_VISIBLE = 8;

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
    if (categoryName) router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
    else router.push(`/shop`);
  };

  if (loading) {
    return (
      <section className="cat2-section">
        <div className="cat2-container">
          <TopHeading heading="Shop By Ritual" />
          <div className="cat2-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="cat2-card cat2-skeleton shimmer"
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
  const visible = hasMore ? categories.slice(0, MAX_VISIBLE - 1) : categories.slice(0, MAX_VISIBLE);

  return (
    <section className="cat2-section">
      <div className="cat2-container">
        <TopHeading heading="Shop By Ritual" />

        <div className="cat2-grid">
          {visible.map((cat, i) => (
            <div
              key={cat.id}
              className="cat2-card"
              style={{ animationDelay: `${i * 90}ms` }}
              onClick={() => goToShop(cat.categoryName)}
            >
              <Image
                src={cat.image_url}
                alt={cat.categoryName}
                fill
                sizes="(max-width: 900px) 78vw, 33vw"
                className="cat2-card-img"
                priority={i === 0}
              />
              <div className="cat2-card-overlay" />
              <div className="cat2-card-content">
                <h3 className="cat2-card-title">{cat.categoryName}</h3>
                <button
                  className="cat2-card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToShop(cat.categoryName);
                  }}
                >
                  Shop Now <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}

          {hasMore && (
            <div
              className="cat2-card cat2-viewall"
              style={{ animationDelay: `${visible.length * 90}ms` }}
              onClick={() => goToShop()}
            >
              <span className="cat2-viewall-count">+{categories.length - visible.length}</span>
              <span className="cat2-viewall-text">View All</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}