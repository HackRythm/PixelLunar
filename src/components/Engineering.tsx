import { FadeIn } from './Animations'

interface ApproachCard {
  tag: string
  title: string
  description: string
  detail: string
  accent: 'amber' | 'cyan'
}

const approaches: ApproachCard[] = [
  {
    tag: 'Band Reduction',
    title: 'SGW-SVD',
    description:
      'Edge-gradient-weighted singular value decomposition reduces IIRS\'s 256 spectral bands to a 3-channel pseudo-RGB composite that preserves structural boundaries for cross-modal matching.',
    detail:
      'Sobel-gradient magnitude weights the SVD so that spectral variance at crater rims and ridge edges dominates the reduced space, rather than flat-field thermal variance.',
    accent: 'cyan',
  },
  {
    tag: 'Illumination',
    title: 'Constrained STV-RPCA',
    description:
      'Sparse + low-rank decomposition with a SPICE-derived shadow mask constraint and Pyramid-ADMM solver separates illumination from surface reflectance even under extreme sun-angle variation.',
    detail:
      'The shadow mask from SPICE incidence/emission geometry prevents the sparse component from absorbing true surface detail in shadowed regions.',
    accent: 'amber',
  },
  {
    tag: 'Attention',
    title: 'Phase-Gated Token Pruning',
    description:
      'Phase-congruency energy maps mask out featureless maria regions before they enter the transformer attention layers, reducing computation and preventing false matches on textureless terrain.',
    detail:
      'Tokens with structural energy below a learned threshold are pruned at L3 pyramid level, re-admitted only if their neighborhood gains energy at finer levels.',
    accent: 'cyan',
  },
  {
    tag: 'Warping',
    title: 'DEM-Source-Gated TA-TPS',
    description:
      'Topography-anisotropic thin-plate spline warp uses local DEM slope to vary stiffness direction, correcting parallax-induced distortion that projective models miss.',
    detail:
      'Stereo OHRC DEM is preferred for Stage A; falls back to SLDEM2015 for sites without OHRC stereo coverage. Source selection is stated explicitly in the per-tile QA metadata.',
    accent: 'amber',
  },
  {
    tag: 'Pipeline',
    title: 'Cascaded Scale Decomposition',
    description:
      'Rather than attempt a single 320× match, the pipeline decomposes the gap into two ~17× steps (OHRC→TMC-2, TMC-2→IIRS), each within the operational range of current best matchers.',
    detail:
      'Stage A uses appearance-dense matchers (SuperGlue/E-LoFTR); Stage B switches to geometry-robust matchers (RoMa/XoFTR) better suited to the SGW-SVD composite\'s reduced spectral fidelity.',
    accent: 'cyan',
  },
]

export default function Engineering() {
  return (
    <section id="engineering" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] text-amber uppercase mb-4">
            Design Decisions
          </p>
          <h2 className="font-display text-section font-bold text-text-primary mb-4">
            Engineering Approach
          </h2>
          <p className="max-w-2xl text-text-secondary leading-relaxed mb-14">
            The individual techniques are established — the contribution is their
            domain-specific combination, tuned for lunar imagery's unique challenges:
            featureless maria, extreme sun-angle variation, and a three-order-of-magnitude
            scale gap.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {approaches.map((card, i) => {
            const color = card.accent === 'amber' ? '#F5A623' : '#3EC6E0'
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="glass-card rounded-sm overflow-hidden group">
                  <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-0">
                    {/* Left tag area */}
                    <div
                      className="px-6 py-5 lg:py-6 flex lg:flex-col items-start lg:items-start gap-2 lg:gap-1 lg:border-r"
                      style={{ borderColor: `${color}15` }}
                    >
                      <span
                        className="font-mono text-[10px] tracking-[0.2em] uppercase"
                        style={{ color }}
                      >
                        {card.tag}
                      </span>
                      <h3 className="font-display text-lg font-bold text-text-primary">
                        {card.title}
                      </h3>
                    </div>

                    {/* Right content */}
                    <div className="px-6 pb-5 lg:py-6">
                      <p className="text-text-secondary text-sm leading-relaxed mb-3">
                        {card.description}
                      </p>
                      <p className="font-mono text-xs text-text-muted leading-relaxed pl-3 border-l-2"
                        style={{ borderColor: `${color}30` }}
                      >
                        {card.detail}
                      </p>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                    }}
                  />
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
