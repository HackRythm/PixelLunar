import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { FadeIn, ScaleIn } from './Animations'
import CountUp from './CountUp'
import IrisTransition from './IrisTransition'

const rmseData = [
  { stage: 'Stage A', value: 0.72, label: 'OHRC ↔ TMC-2', range: '0.6–0.9 px' },
  { stage: 'Stage B', value: 1.45, label: 'TMC-2 ↔ IIRS', range: '1.2–1.8 px' },
]

const latencyData = [
  { name: 'Ingestion', ms: 25, color: '#F5A623' },
  { name: 'Illumination', ms: 35, color: '#F5A623' },
  { name: 'Feature Rep.', ms: 45, color: '#3EC6E0' },
  { name: 'Spectral Comp.', ms: 18, color: '#3EC6E0' },
  { name: 'Matching', ms: 95, color: '#3EC6E0' },
  { name: 'Outlier/Warp', ms: 23, color: '#3EC6E0' },
]

const totalLatency = latencyData.reduce((sum, d) => sum + d.ms, 0)

interface MetricCardProps {
  label: string
  value: number
  decimals: number
  unit: string
  note?: string
  accent: 'amber' | 'cyan'
}

function MetricCard({ label, value, decimals, unit, note, accent }: MetricCardProps) {
  const color = accent === 'amber' ? '#F5A623' : '#3EC6E0'
  return (
    <div className="glass-card rounded-sm p-5 relative overflow-hidden group">
      <div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{ backgroundColor: `${color}30` }}
      />
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color}08, transparent 70%)`,
        }}
      />
      <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <CountUp
          value={value}
          decimals={decimals}
          className="font-mono text-3xl sm:text-4xl font-semibold"
          duration={1400}
        />
        <span className="font-mono text-sm text-text-muted">{unit}</span>
      </div>
      {note && (
        <p className="font-mono text-[10px] text-text-muted mt-2">{note}</p>
      )}
      {/* Manually color the CountUp via a style wrapper */}
      <style>{`
        .glass-card .font-mono.text-3xl,
        .glass-card .font-mono.sm\\:text-4xl {
          color: ${color};
        }
      `}</style>
    </div>
  )
}

/* Use a simple inline style approach instead */
function MetricCardV2({ label, value, decimals, unit, note, accent }: MetricCardProps) {
  const color = accent === 'amber' ? '#F5A623' : '#3EC6E0'
  return (
    <div className="glass-card rounded-sm p-5 relative overflow-hidden group">
      <div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{ backgroundColor: `${color}30` }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color}08, transparent 70%)`,
        }}
      />
      <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-2 relative">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 relative">
        <span style={{ color }}>
          <CountUp
            value={value}
            decimals={decimals}
            className="font-mono text-3xl sm:text-4xl font-semibold"
            duration={1400}
          />
        </span>
        <span className="font-mono text-sm text-text-muted">{unit}</span>
      </div>
      {note && (
        <p className="font-mono text-[10px] text-text-muted mt-2 relative">{note}</p>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="glass-card rounded-sm p-3 border border-base-border">
      <p className="font-mono text-xs text-text-primary">{d.payload.name || d.payload.stage}</p>
      <p className="font-mono text-sm font-semibold" style={{ color: d.payload.color || '#3EC6E0' }}>
        {d.value} {d.payload.ms !== undefined ? 'ms' : 'px'}
      </p>
    </div>
  )
}

export default function Results() {
  return (
    <section id="results" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] text-cyan uppercase mb-4">
            Metrics
          </p>
          <h2 className="font-display text-section font-bold text-text-primary mb-4">
            Results Dashboard
          </h2>
          <p className="max-w-2xl text-text-secondary leading-relaxed mb-14">
            Target performance figures for the pipeline operating on 1024×1024
            tiles. All numbers are <span className="font-mono text-cyan text-sm">per-tile</span>,
            not full-scene aggregates.
          </p>
        </FadeIn>

        {/* Top-level metric cards with counting animation */}
        <IrisTransition>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            <ScaleIn delay={0}>
              <MetricCardV2
                label="RMSE Stage A"
                value={0.72}
                decimals={2}
                unit="px"
                note="OHRC ↔ TMC-2 · ~20× step"
                accent="cyan"
              />
            </ScaleIn>
            <ScaleIn delay={0.08}>
              <MetricCardV2
                label="RMSE Stage B"
                value={1.45}
                decimals={2}
                unit="px"
                note="TMC-2 ↔ IIRS · ~16× step"
                accent="cyan"
              />
            </ScaleIn>
            <ScaleIn delay={0.16}>
              <MetricCardV2
                label="Total Latency"
                value={totalLatency}
                decimals={0}
                unit="ms / tile"
                note="1024×1024 tile, RTX 5060"
                accent="amber"
              />
            </ScaleIn>
            <ScaleIn delay={0.24}>
              <MetricCardV2
                label="Peak VRAM"
                value={1.8}
                decimals={1}
                unit="GB"
                note="Target: RTX 5060 · 8 GB budget"
                accent="amber"
              />
            </ScaleIn>
          </div>
        </IrisTransition>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RMSE chart */}
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-sm p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-text-muted uppercase mb-6">
                RMSE by Matching Stage (px)
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rmseData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1F30" vertical={false} />
                    <XAxis
                      dataKey="stage"
                      tick={{ fill: '#8A8F9C', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#1A1F30' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 2.5]}
                      tick={{ fill: '#8A8F9C', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#1A1F30' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                      <Cell fill="#3EC6E0" />
                      <Cell fill="#2C8FBF" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4">
                {rmseData.map((d) => (
                  <span key={d.stage} className="font-mono text-[10px] text-text-muted">
                    {d.stage}: {d.range}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Latency breakdown */}
          <FadeIn delay={0.2}>
            <div className="glass-card rounded-sm p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-text-muted uppercase mb-6">
                Per-Tile Latency Breakdown (ms)
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData} barSize={28} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1F30" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#8A8F9C', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#1A1F30' }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={95}
                      tick={{ fill: '#8A8F9C', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#1A1F30' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ms" radius={[0, 2, 2, 0]}>
                      {latencyData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="font-mono text-[10px] text-text-muted mt-4">
                Total: <span className="text-amber font-semibold">{totalLatency} ms</span> per tile ·
                Target hardware: NVIDIA RTX 5060 (8 GB)
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
