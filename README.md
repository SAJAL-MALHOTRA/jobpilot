# ⚡ JobPilot AI

An autonomous reverse recruiter and job search copilot for startup engineers in Bangalore and YC cohorts.

Built with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed in a pure black minimalist engineering theme inspired by Linear, Vercel, and Raycast.

🌐 **Live Production:** [https://sajal-malhotra.github.io/jobpilot/](https://sajal-malhotra.github.io/jobpilot/)

---

## 🛠️ Core Capabilities

- **3D Company Swipe Deck (`CompanySwipeDeck.tsx`):** Gesture-driven card deck with drag physics, rotational tilt, tactile stamps, and keyboard shortcuts (`←`, `→`, `Z`, `Space`).
- **Startup Job Radar (`JobRadar.tsx`):** Directory of seed/Series A roles across Indiranagar, Koramangala, HSR Layout, and YC W24/S24 cohorts with direct career portal searches.
- **Kanban Application Tracker (`AutopilotTracker.tsx`):** Local-first pipeline tracker with custom job logging (`+ Add Custom Job`), 6-stage drag-and-drop workflow, modal card editor, live search, and sanitized RFC 4180 CSV export.
- **Founder Direct Outreach (`OutreachModal.tsx`):** 4-part cold email framework (Context, Relevance, Proof of Work, Small Ask) with direct `mailto:` draft generation and explicit sent confirmation.
- **Fact-Preserving ATS Tailor (`AtsResumeTailorModal.tsx`):** Rule-based keyword overlap engine using candidate-supplied bullets with printable single-column PDF formatting.
- **Live GitHub Portfolio Studio (`PortfolioStudio.tsx`):** Real-time GitHub REST API integration pulling public repositories, stars, forks, and markdown proof.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| `→` or `Space` | Swipe Deck | Save Company to Pipeline |
| `←` | Swipe Deck | Pass Company |
| `Z` | Swipe Deck | Undo Last Swipe |
| `Esc` | Modals | Close Active Dialog (Accessible focus restoration) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or newer
- npm / pnpm / yarn

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/SAJAL-MALHOTRA/jobpilot.git
cd jobpilot

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build

```bash
npm run build
```

The output is bundled in `/dist` and automatically deployed to GitHub Pages on every push to `master`.

---

## 🔒 Privacy & Architecture

- **Local-First:** All applications, notes, and profile edits persist locally in your browser via `localStorage` with runtime schema validation.
- **Zero Hallucination:** Resume exports strictly preserve candidate-provided experience without inventing metrics or companies.
- **Sanitized Export:** CSV exports neutralize spreadsheet formula injection vulnerabilities (`=`, `+`, `-`, `@`).

---

## 📄 License

MIT License. Designed and built by Sajal Malhotra.
