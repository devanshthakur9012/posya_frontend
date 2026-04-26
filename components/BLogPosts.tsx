"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TopHeading from "./TopHeading";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);

  useEffect(() => {
    fetch(`${BASE_URL}home-posts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.posts.length) {
          setFeatured(data.posts[0]);
          setPosts(data.posts.slice(1));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const readTime = (text: string) =>
    Math.max(1, Math.ceil((text || "").split(" ").length / 200)) + " min read";

  if (!featured) return (
    <section className="py-20 bg-[#fcf9f2]">
      <div className="max-w-[1150px] mx-auto px-6 text-center">
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: '#cb8836',
              animation: `blogDot 1.2s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
        <style>{`@keyframes blogDot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
      </div>
    </section>
  );

  return (
    <section className="relative py-20" style={{ background: '#fcf9f2' }}>
      <div className="relative z-10 max-w-[1150px] mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <TopHeading heading="Our Latest Articles" />
          <p style={{ color: '#6b5a42', fontSize: 15, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Read our recent blogs to know more about organic products and why people choose them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Featured Post ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
            style={{
              background: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid rgba(203,136,54,0.15)',
              boxShadow: '0 4px 24px rgba(43,26,6,0.07)',
              transition: 'box-shadow 0.3s, transform 0.3s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(203,136,54,0.18)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(43,26,6,0.07)';
            }}
          >
            {/* Image */}
            <Link href={`/blog/${featured.slug}`} style={{ display: 'block', position: 'relative', width: '100%', height: 320, overflow: 'hidden' }}>
              <Image
                src={featured.featured_image || "/images/b1.jpg"}
                alt={featured.title}
                fill
                className="object-cover"
                style={{ transition: 'transform 0.6s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(43,26,6,0.5) 0%, transparent 60%)'
              }} />
              {/* Badge */}
              <span style={{
                position: 'absolute', top: 16, left: 16,
                background: '#cb8836', color: '#fff',
                fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
                textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50
              }}>
                Featured
              </span>
            </Link>

            {/* Body */}
            <div style={{ padding: '28px 28px 24px' }}>
              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#a89070' }}>
                  <Calendar size={13} style={{ color: '#cb8836' }} />
                  {formatDate(featured.created_at)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#a89070' }}>
                  <Clock size={13} style={{ color: '#cb8836' }} />
                  {readTime(featured.description)}
                </span>
              </div>

              {/* Title */}
              <Link href={`/blog/${featured.slug}`}>
                <h3 style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 700, color: '#2b1a06', lineHeight: 1.35,
                  marginBottom: 10, transition: 'color 0.2s'
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#cb8836')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#2b1a06')}
                >
                  {featured.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p style={{
                fontSize: 14, color: '#6b5a42', lineHeight: 1.75,
                marginBottom: 20,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {featured.description || "No description available."}
              </p>

              {/* CTA */}
              <Link href={`/blog/${featured.slug}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', background: '#2b1a06', color: '#f2eee9',
                fontSize: 13, fontWeight: 700, borderRadius: 50,
                textDecoration: 'none', transition: 'background 0.25s, transform 0.2s',
                letterSpacing: '0.4px'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#cb8836';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#2b1a06';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                Continue Reading <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* ── Side Posts ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex', gap: 0, background: '#fff',
                  borderRadius: 16, overflow: 'hidden',
                  border: '1px solid rgba(203,136,54,0.12)',
                  boxShadow: '0 2px 12px rgba(43,26,6,0.05)',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(203,136,54,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(43,26,6,0.05)';
                }}
              >
                {/* Thumbnail */}
                <Link href={`/blog/${post.slug}`} style={{ position: 'relative', width: 100, flexShrink: 0, display: 'block', overflow: 'hidden' }}>
                  <Image
                    src={post.featured_image || "/images/b2.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    style={{ transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </Link>

                {/* Content */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                  <Link href={`/blog/${post.slug}`}>
                    <h4 style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontSize: 13, fontWeight: 700, color: '#2b1a06',
                      lineHeight: 1.45, marginBottom: 6,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      transition: 'color 0.2s'
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#cb8836')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#2b1a06')}
                    >
                      {post.title}
                    </h4>
                  </Link>

                  <p style={{
                    fontSize: 11, color: '#7a6a58', lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    marginBottom: 8
                  }}>
                    {post.description || "No description"}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#a89070' }}>
                      <Calendar size={11} style={{ color: '#cb8836' }} />
                      {formatDate(post.created_at)}
                    </span>
                    <Link href={`/blog/${post.slug}`} style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      fontSize: 11, fontWeight: 700, color: '#cb8836',
                      textDecoration: 'none', transition: 'gap 0.2s'
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '6px'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '3px'}
                    >
                      Read <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* View all blogs CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/blog" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px', background: 'transparent',
                color: '#cb8836', fontSize: 13, fontWeight: 700,
                borderRadius: 50, textDecoration: 'none',
                border: '1.5px solid rgba(203,136,54,0.35)',
                transition: 'all 0.25s'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#cb8836';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = '#cb8836';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#cb8836';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(203,136,54,0.35)';
                }}
              >
                View All Articles <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}