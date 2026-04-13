// Static SVG hexagon — shown while Three.js loads or if WebGL is unavailable
export default function HexPrismFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <svg
        width="280"
        height="320"
        viewBox="0 0 280 320"
        style={{ animation: 'spin 20s linear infinite' }}
      >
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <polygon
          points="140,10 270,80 270,240 140,310 10,240 10,80"
          fill="none"
          stroke="#BBE405"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <polygon
          points="140,40 245,100 245,220 140,280 35,220 35,100"
          fill="none"
          stroke="#888"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <polygon
          points="140,70 220,118 220,202 140,250 60,202 60,118"
          fill="#111"
          stroke="#555"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <text x="140" y="168" textAnchor="middle" fill="#BBE405" fontFamily="monospace" fontSize="10" letterSpacing="2">HEXA_IA</text>
      </svg>
    </div>
  )
}
