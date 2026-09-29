# GeoPhase-Lunar

**Multi-modal, Sun-Angle & Scale-Invariant Image Correspondence Pipeline for Chandrayaan-2 Imagery**

*Smart India Hackathon 2026 — Problem Statement 26166 (ISRO / Space Technology)*

---

## 🛰️ Overview

GeoPhase-Lunar addresses the challenge of multi-modal, cross-resolution image co-registration and feature correspondence across Chandrayaan-2 payloads:
- **OHRC (Orbiter High Resolution Camera)**: ~0.25 m/px GSD panchromatic
- **TMC-2 (Terrain Mapping Camera-2)**: ~5.0 m/px GSD stereo triplet
- **IIRS (Imaging Infrared Spectrometer)**: ~80 m/px GSD hyperspectral (0.8–5.0 µm)

The pipeline bridges up to a **320× scale gap** and extreme sun-angle/phase variations through illumination-invariant phase-congruency representations, coarse-to-fine hierarchical matching, and robust non-linear spatial bundle adjustment.

---

## 🏗️ Pipeline Architecture

1. **Stage 1: Ephemeris & Attitude Pre-alignment (SPICE)**
   - Ingestion of PDS4 labels and SPICE CK/SPK kernels.
   - Computes initial ground footprint intersection and bounds search space to $\pm 120\text{px}$.

2. **Stage 2: Log-Gabor Phase Congruency Extraction**
   - Illumination and contrast invariant feature extraction across 4 scales and 6 orientations.
   - Generates scale-normalized orientation maps and feature corners immune to shadow drift.

3. **Stage 3: Multi-Scale Dense Matching & Outlier Rejection**
   - Coarse-to-fine pyramid correspondence matching.
   - Outlier rejection via MAGSAC++ with progressive spatial consistency constraints.

4. **Stage 4: Sparse Bundle Adjustment & GeoTIFF Export**
   - Non-linear least-squares optimization over tie-point residuals.
   - Export to geodetically tied GeoTIFF with sub-pixel RMSE metadata.

---

## 💻 Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: Framer Motion
- **Visuals & Charts**: Recharts, Canvas 2D, SVG Filters
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/HackRythm/PixelLunar.git

# Navigate into project directory
cd PixelLunar

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License & Attribution

Built for Smart India Hackathon (SIH) 2026 | ISRO Space Technology Theme | Problem Statement 26166.
