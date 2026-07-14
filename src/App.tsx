import { useMemo, useState, type CSSProperties } from "react";
import { Glyph } from "./components/Glyph";
import {
  architectures,
  efficiencyMetrics,
  filterArchitectures,
  sources,
  timeline,
  type FilterMode,
  type Theme,
} from "./data/architectures";
import { usePersistedTheme } from "./hooks/usePersistedTheme";

const THEME_OPTIONS: { id: Theme; label: string; icon: string }[] = [
  { id: "atlas", label: "Architecture Atlas", icon: "◉" },
  { id: "field", label: "Field Guide", icon: "▤" },
  { id: "lab", label: "Efficiency Lab", icon: "⌁" },
];

const NAV_LINKS = [
  { href: "#atlas", label: "Architectures" },
  { href: "#efficiency", label: "Efficiency" },
  { href: "#compare", label: "Compare" },
  { href: "#timeline", label: "Timeline" },
] as const;

const FILTERS: { id: FilterMode; label: string; count: string }[] = [
  { id: "all", label: "All families", count: "09" },
  { id: "backbone", label: "Backbone alternatives", count: "08" },
  { id: "complement", label: "Complementary", count: "01" },
];

function heroTitle(theme: Theme) {
  if (theme === "field") {
    return (
      <>
        THE MACHINES
        <br />
        BEYOND ATTENTION
      </>
    );
  }
  if (theme === "lab") {
    return (
      <>
        Intelligence
        <br />
        beyond attention.
      </>
    );
  }
  return <>The future of intelligence is bigger than one architecture.</>;
}

/** Display sequence length (stored as thousands of tokens). */
function formatContextLength(lengthK: number) {
  if (lengthK >= 1024) return "1M tokens";
  return `${lengthK}K tokens`;
}

export default function App() {
  const [theme, setTheme] = usePersistedTheme();
  const [active, setActive] = useState<FilterMode>("all");
  const [selected, setSelected] = useState(architectures[0].id);
  const [length, setLength] = useState(32);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(
    () => filterArchitectures(architectures, active),
    [active],
  );
  const selectedArch =
    architectures.find((a) => a.id === selected) ?? architectures[0];
  const { quadratic, linear, gap, density } = efficiencyMetrics(length);
  const matrixStyle = { "--density": String(density) } as CSSProperties;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className={`site theme-${theme}`}>
      <div className="themebar" role="group" aria-label="Choose a visual theme">
        <span>Choose your lens</span>
        <div className="themechoices">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={theme === opt.id ? "on" : ""}
              aria-pressed={theme === opt.id}
              onClick={() => setTheme(opt.id)}
            >
              <i aria-hidden="true">{opt.icon}</i> {opt.label}
            </button>
          ))}
        </div>
      </div>

      <header>
        <a className="brand" href="#top" onClick={closeMenu}>
          BEYOND <b>/</b> TRANSFORMERS
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="outline" href="#atlas">
            Explore the map <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        <nav
          id="mobile-nav"
          className={`nav-mobile ${menuOpen ? "open" : ""}`}
          aria-label="Mobile"
          hidden={!menuOpen}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a href="#atlas" onClick={closeMenu}>
            Explore the map →
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            A FIELD GUIDE TO THE POST-TRANSFORMER LANDSCAPE
          </p>
          <h1>{heroTitle(theme)}</h1>
          <p className="dek">
            Transformers changed AI. But attention is not the only path to
            capable language models. Explore the architectures competing on
            memory, speed, energy, and scale.
          </p>
          <div className="hero-actions">
            <a className="primary" href="#atlas">
              Explore architectures <span aria-hidden="true">→</span>
            </a>
            <a href="#why">
              Why transformers dominate <span aria-hidden="true">↘</span>
            </a>
          </div>
          <div className="truth">
            <b>The honest takeaway</b>
            <span>There is no universal winner. The likely future is hybrid.</span>
          </div>
        </div>

        <div className="hero-viz" aria-label="Map of architecture families">
          <div className="reference">
            <div className="token-grid" aria-hidden="true">
              {Array.from({ length: 25 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
            <strong>Transformer</strong>
            <span>REFERENCE</span>
          </div>

          {architectures.map((a, i) => (
            <button
              key={a.id}
              type="button"
              className={`orbit orbit-${i} ${selected === a.id ? "selected" : ""}`}
              aria-pressed={selected === a.id}
              onClick={() => setSelected(a.id)}
            >
              <Glyph type={a.glyph} />
              <b>{a.short}</b>
              <small>{a.tags[0]}</small>
            </button>
          ))}

          <svg
            className="routes"
            viewBox="0 0 680 520"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M340 260C250 200 190 100 110 74M340 260C430 180 505 74 575 80M340 260C455 245 560 220 620 230M340 260C440 330 520 400 590 430M340 260C300 360 240 440 150 448M340 260C245 285 150 310 70 300M340 260C200 220 120 180 55 160M340 260C390 400 450 470 510 500M340 260C280 120 200 60 140 30" />
          </svg>

          <div className="selected-note" aria-live="polite">
            <span>{selectedArch.name}</span>
            <b>{selectedArch.idea}</b>
          </div>
        </div>
      </section>

      <section className="why" id="why">
        <div>
          <p className="kicker">WHY THE WINNER KEEPS WINNING</p>
          <h2>Transformers dominate for reasons beyond attention.</h2>
        </div>
        <div className="why-grid">
          <article>
            <b>01</b>
            <h3>Parallel training</h3>
            <p>
              Every token in a training sequence can be processed together,
              keeping accelerators busy.
            </p>
          </article>
          <article>
            <b>02</b>
            <h3>Scaling evidence</h3>
            <p>
              Years of predictable scaling behavior lowered the risk of
              billion-dollar training runs.
            </p>
          </article>
          <article>
            <b>03</b>
            <h3>Software gravity</h3>
            <p>
              Kernels, compilers, serving stacks, checkpoints, and talent all
              optimize for attention.
            </p>
          </article>
          <article>
            <b>04</b>
            <h3>Flexible retrieval</h3>
            <p>
              Attention can directly compare any token with any other
              token—powerful for exact recall.
            </p>
          </article>
        </div>
      </section>

      <section className="architecture-section" id="atlas">
        <div className="section-head">
          <div>
            <p className="kicker">THE ARCHITECTURE ATLAS</p>
            <h2>Nine paths beyond full attention</h2>
          </div>
          <p>
            Some replace the backbone. Others complement it. Select a card to
            see what each design gains—and gives up.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filter architecture families">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={active === f.id ? "on" : ""}
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
            >
              {f.label} <b>{f.count}</b>
            </button>
          ))}
        </div>

        <div className="cards">
          {filtered.map((a) => (
            <article
              key={a.id}
              id={`arch-${a.id}`}
              className={`arch-card ${a.color} ${selected === a.id ? "selected" : ""}`}
              tabIndex={0}
              aria-current={selected === a.id ? "true" : undefined}
              onClick={() => setSelected(a.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(a.id);
                }
              }}
            >
              <div className="card-top">
                <span>{a.n}</span>
                <em>{a.maturity}</em>
              </div>
              <h3>{a.name}</h3>
              <div className="glyph">
                <Glyph type={a.glyph} />
              </div>
              <div className="chips">
                {a.tags.map((t) => (
                  <b key={t}>{t}</b>
                ))}
              </div>
              <p>{a.idea}</p>
              <dl>
                <div>
                  <dt>Best at</dt>
                  <dd>{a.best}</dd>
                </div>
                <div>
                  <dt>Watch out</dt>
                  <dd>{a.catch}</dd>
                </div>
              </dl>
              <a
                href={a.source}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{a.examples}</span>
                <b aria-hidden="true">↗</b>
                <span className="sr-only"> (opens paper in new tab)</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="efficiency" id="efficiency">
        <div className="section-head">
          <div>
            <p className="kicker">EFFICIENCY LAB</p>
            <h2>What changes as context grows?</h2>
          </div>
          <p>
            Drag the context control. This conceptual model shows asymptotic
            behavior—not a universal hardware benchmark. Bars illustrate growth
            rates of full attention vs fixed-state updates.
          </p>
        </div>
        <div className="lab-grid">
          <div className="scaler">
            <div className="scale-top">
              <span>Sequence length</span>
              <b>{formatContextLength(length)}</b>
            </div>
            <input
              aria-label="Sequence length in thousands of tokens"
              type="range"
              min={8}
              max={1024}
              step={8}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <div className="ticks">
              <span>8K</span>
              <span>128K</span>
              <span>512K</span>
              <span>1M</span>
            </div>
          </div>

          <div className="flows">
            <div className="flow transformer-flow">
              <div className="flow-label">
                <i aria-hidden="true">×²</i>
                <span>
                  <b>Full attention</b>
                  <small>Token × token interactions</small>
                </span>
              </div>
              <div
                className="matrix-mini"
                style={matrixStyle}
                aria-hidden="true"
                data-density={density}
              >
                {Array.from({ length: 64 }).map((_, i) => (
                  <i
                    key={i}
                    className={i % Math.max(2, 9 - Math.floor(density / 3)) === 0 ? "hot" : ""}
                  />
                ))}
              </div>
              <div className="meter">
                <b style={{ width: `${quadratic}%` }} />
                <span>O(n²) compute</span>
              </div>
            </div>

            <div className="flow linear-flow">
              <div className="flow-label">
                <i aria-hidden="true">→</i>
                <span>
                  <b>Recurrent / state-space</b>
                  <small>Compact state updates</small>
                </span>
              </div>
              <div className="states" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i}>
                    s<sub>{i}</sub>
                  </i>
                ))}
              </div>
              <div className="meter">
                <b style={{ width: `${linear}%` }} />
                <span>O(n) compute</span>
              </div>
            </div>
          </div>

          <div className="lab-note">
            <strong>{gap}×</strong>
            <span>
              relative scaling gap
              <br />
              <small>illustrative at {formatContextLength(length)}</small>
            </span>
          </div>
        </div>
      </section>

      <section className="compare" id="compare">
        <div className="section-head">
          <div>
            <p className="kicker">THE TRADE-OFF TABLE</p>
            <h2>Efficiency is multidimensional</h2>
          </div>
          <p>
            Big-O notation describes growth, not real-world speed. Hardware
            utilization, kernels, batch size, model quality, and sequence length
            still decide the winner. Values are architecture-level tendencies.
          </p>
        </div>
        <div className="table-wrap">
          <table>
            <caption className="sr-only">
              Comparison of sequence compute, decode state, parallel training,
              token recall, and maturity across architectures
            </caption>
            <thead>
              <tr>
                <th scope="col">Architecture</th>
                <th scope="col">Sequence compute</th>
                <th scope="col">Decode state</th>
                <th scope="col">Parallel training</th>
                <th scope="col">Exact token recall</th>
                <th scope="col">LLM maturity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Transformer</th>
                <td>
                  <mark className="bad">O(n²)</mark>
                </td>
                <td>Growing KV cache</td>
                <td>Excellent</td>
                <td>Strong</td>
                <td>
                  <mark className="good">Dominant</mark>
                </td>
              </tr>
              {architectures.map((a) => (
                <tr key={a.id}>
                  <th scope="row">
                    {a.name}
                    {a.complement ? (
                      <span className="table-note"> (complement)</span>
                    ) : null}
                  </th>
                  <td>
                    <mark className="good">{a.complexity}</mark>
                  </td>
                  <td>{a.memory}</td>
                  <td>
                    {a.parallelTrain}
                    {a.parallelTrain.includes("*") ? (
                      <span className="sr-only">
                        {" "}
                        Star note: expert routing adds communication overhead
                      </span>
                    ) : null}
                  </td>
                  <td>{a.recall}</td>
                  <td>{a.maturity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-footnote">
          * MoE parallel training is strong on paper but routing and
          all-to-all communication can dominate wall-clock cost at scale.
        </p>
      </section>

      <section className="timeline" id="timeline">
        <div className="section-head">
          <div>
            <p className="kicker">A 70-YEAR SEARCH</p>
            <h2>Attention is one chapter</h2>
          </div>
          <p>
            The field repeatedly moves between explicit memory, convolution,
            recurrence, routing, and learned dynamics.
          </p>
        </div>
        <div className="timeline-track">
          {timeline.map(([year, label]) => (
            <div
              key={`${year}-${label}`}
              className={label === "Transformer" ? "pivot" : undefined}
            >
              <b>{year}</b>
              <i aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="future">
        <p className="kicker">WHAT TO WATCH</p>
        <h2>The post-transformer era may still contain transformers.</h2>
        <div className="future-grid">
          <article>
            <b>01</b>
            <h3>Hybrid backbones</h3>
            <p>
              Small attention layers mixed with SSMs, recurrence, convolutions,
              or local windows.
            </p>
          </article>
          <article>
            <b>02</b>
            <h3>Inference-first design</h3>
            <p>
              Architectures optimized for memory bandwidth, continuous batching,
              and on-device state.
            </p>
          </article>
          <article>
            <b>03</b>
            <h3>Hardware–model co-design</h3>
            <p>
              Neuromorphic chips, analog compute, and custom kernels changing
              what “efficient” means.
            </p>
          </article>
        </div>
      </section>

      <section className="sources">
        <div className="section-head">
          <div>
            <p className="kicker">PRIMARY SOURCES</p>
            <h2>Read the papers, not the hype</h2>
          </div>
          <p>
            Claims throughout this guide are framed as architecture-level
            tendencies. Reported speedups are hardware- and
            implementation-specific.
          </p>
        </div>
        <div className="source-list">
          {sources.map((s, i) => (
            <a
              key={s[0]}
              href={s[2]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>
                <strong>{s[0]}</strong>
                <small>{s[1]}</small>
              </span>
              <i aria-hidden="true">↗</i>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <div className="brand">
          BEYOND <b>/</b> TRANSFORMERS
        </div>
        <p>
          An educational atlas of architectures competing to make machine
          intelligence faster, leaner, and stranger.
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>

      <a
        className="back-to-top"
        href="#top"
        aria-label="Back to top"
        title="Back to top"
      >
        <span aria-hidden="true">↑</span>
      </a>
    </main>
  );
}
