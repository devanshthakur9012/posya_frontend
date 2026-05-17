"use client";

import Image from "next/image";
import { X, Leaf } from "lucide-react";
import { useEffect } from "react";

interface IngredientsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: any[];
  productName: string;
  sectionTitle?: string;
}

export default function IngredientsDrawer({
  isOpen,
  onClose,
  ingredients,
  productName,
  sectionTitle = "Key Ingredients",
}: IngredientsDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="pdrawer-overlay" />
      <div className="pdrawer">

        {/* Header — no subtitle */}
        <div className="pdrawer-header">
          <div className="pdrawer-header-left">
            <div className="pdrawer-header-icon" style={{ background: "rgba(203,136,54,0.1)" }}>
              <Leaf size={18} style={{ color: "#cb8836" }} />
            </div>
            <div>
              <h2 className="pdrawer-title">{sectionTitle}</h2>
            </div>
          </div>
          <button onClick={onClose} className="pdrawer-close-btn"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="pdrawer-body">
          {(!ingredients || ingredients.length === 0) ? (
            <div className="pdrawer-empty">
              <Leaf size={40} style={{ color: "rgba(203,136,54,0.25)" }} />
              <p className="pdrawer-empty-title">No Ingredients Listed</p>
              <p className="pdrawer-empty-sub">This product has no ingredients added yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {ingredients.map((ing: any, idx: number) => (
                <div key={ing.id || idx}>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "14px",
                    alignItems: "flex-start",
                    width: "100%",
                  }}>
                    {/* Image — only if present */}
                    {ing.featured_image && (
                      <div style={{
                        position: "relative",
                        width: 52,
                        height: 52,
                        flexShrink: 0,
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}>
                        <Image src={ing.featured_image} alt={ing.name || "Ingredient"} fill className="object-cover" />
                      </div>
                    )}
                    {/* Text — takes full width when no image */}
                    <div style={{
                      flex: 1,
                      minWidth: 0,
                      width: "100%",
                      overflow: "hidden",
                    }}>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#2b1a06",
                        margin: "0 0 10px 0",
                        lineHeight: "1.6",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        display: "block",
                        width: "100%",
                      }}>
                        {ing.name}
                      </p>
                      {ing.content && (
                        <div
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.9",
                            color: "#5a4030",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            width: "100%",
                            display: "block",
                          }}
                          dangerouslySetInnerHTML={{ __html: ing.content }}
                        />
                      )}
                    </div>
                  </div>
                  {idx < ingredients.length - 1 && (
                    <div style={{
                      height: "1px",
                      background: "rgba(203,136,54,0.15)",
                      margin: "20px 0",
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}