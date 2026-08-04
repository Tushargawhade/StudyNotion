import React from "react";

const StudyVerseLogo = ({ variant = "light", className = "" }) => {
  const isDark = variant === "dark";
  const wordmarkColor = isDark ? "#FFFFFF" : "#0F1B33";
  const accent = "#2563EB";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="sv-mortar-grad"
            x1="4"
            y1="6"
            x2="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>

        {/* Board */}
        <path
          d="M24 4 L48 16 L24 28 L0 16 Z"
          fill="url(#sv-mortar-grad)"
        />

        {/* Crown */}
        <path
          d="M0 16 L0 24 Q24 40 48 24 L48 16 Q24 27 0 16 Z"
          fill="#1E40AF"
        />

        {/* Tassel */}
        <path d="M44 13 L47 21" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="47" cy="23.5" r="3" fill="#0EA5E9" />
      </svg>

      <span
        style={{
          color: wordmarkColor,
          fontSize: "1.35rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Study
        <span style={{ color: accent }}>Verse</span>
      </span>
    </div>
  );
};

export default StudyVerseLogo;
