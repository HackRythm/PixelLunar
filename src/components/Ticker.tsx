export default function Ticker() {
  const messages = [
    'SPICE KERNEL CK v3.2.1 LOADED',
    'TILE 0442/1180 PROCESSED',
    'RMSE 0.71px',
    'STAGE 3B ACTIVE',
    'MAGSAC INLIERS 214/238',
    'OHRC ORBIT 4827 INDEXED',
    'LOG-GABOR 4s×6o COMPLETE',
    'TMC-2 STEREO PAIR 0118 REGISTERED',
    'HAPKE BRDF INVERSION ✓',
    'IIRS CUBE 0043 REDUCED [SGW-SVD]',
    'TA-TPS WARP RESIDUAL 0.84px',
    'COG GEOTIFF TILE 0389 EXPORTED',
    'PHASE ENERGY MAP GENERATED',
    'VRAM 1.62/8.00 GB',
    'SLDEM2015 FALLBACK DEM ACTIVE',
    'PDS4 TIE-POINT TABLE WRITTEN',
  ]

  // Double the messages for seamless loop
  const ticker = [...messages, ...messages].join(' · ')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-6 overflow-hidden bg-base/80 border-t border-base-border/30 backdrop-blur-sm">
      <div className="ticker-track h-full flex items-center">
        <span className="font-mono text-[9px] tracking-[0.15em] text-text-muted/40 whitespace-nowrap">
          {ticker}
        </span>
      </div>
      <style>{`
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
