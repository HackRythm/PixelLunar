export default function Footer() {
  return (
    <footer className="relative border-t border-base-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Left */}
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              GeoPhase<span className="text-cyan">-</span>Lunar
            </h3>
            <p className="font-mono text-xs text-text-muted tracking-wider mb-4">
              SIH 2026 · PS 26166 · ISRO · Space Technology
            </p>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              Multi-modal image correspondence pipeline for Chandrayaan-2
              OHRC, TMC-2, and IIRS payloads. Built for the Smart India
              Hackathon 2026.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-4">
              <a
                href="#"
                className="font-mono text-xs text-text-muted hover:text-cyan transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="#"
                className="font-mono text-xs text-text-muted hover:text-cyan transition-colors"
              >
                Contact ↗
              </a>
              <a
                href="#"
                className="font-mono text-xs text-text-muted hover:text-cyan transition-colors"
              >
                Paper ↗
              </a>
            </div>
            <p className="font-mono text-[10px] text-text-muted">
              Team PixelLunar · Dept. of Computer Science & Engineering
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-base-border flex flex-wrap justify-between gap-4">
          <p className="font-mono text-[10px] text-text-muted">
            Demo build · No backend · All data is mocked
          </p>
          <p className="font-mono text-[10px] text-text-muted">
            © 2026 GeoPhase-Lunar · Smart India Hackathon
          </p>
        </div>
      </div>
    </footer>
  )
}
