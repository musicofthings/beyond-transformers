export type Theme = "atlas" | "field" | "lab";
export type ArchColor = "teal" | "blue" | "coral" | "violet" | "lime" | "ochre";
export type GlyphType =
  | "wave"
  | "loop"
  | "retention"
  | "filter"
  | "matrix"
  | "router"
  | "liquid"
  | "spike"
  | "symbol"
  | "compress"
  | "hybrid"
  | "think";

/** SOTA tier as of July 2026. */
export type ArchTier = "A" | "B" | "C";

export type FilterMode = "all" | "A" | "B" | "C";

export interface Architecture {
  id: string;
  n: string;
  name: string;
  short: string;
  color: ArchColor;
  tier: ArchTier;
  tags: string[];
  maturity: string;
  complexity: string;
  memory: string;
  parallelTrain: string;
  recall: string;
  idea: string;
  best: string;
  catch: string;
  examples: string;
  source: string;
  glyph: GlyphType;
  /** True when this family typically complements transformers rather than fully replacing them. */
  complement?: boolean;
}

/**
 * Architecture atlas for July 2026 SOTA.
 * Tier A — production / near-production
 * Tier B — strong research alternatives
 * Tier C — emerging / orthogonal bets
 */
export const architectures: Architecture[] = [
  // --- Tier A ---
  {
    id: "efficient-attention",
    n: "01",
    name: "Efficient attention",
    short: "MLA / GQA",
    color: "violet",
    tier: "A",
    tags: ["Attention reform", "Production"],
    maturity: "Production",
    complexity: "Sub-quadratic / sparse",
    memory: "Compressed KV",
    parallelTrain: "Excellent",
    recall: "Strong",
    idea:
      "Keep transformers, but compress, share, or localize attention—multi-latent, grouped-query, sliding-window, and sparse patterns.",
    best: "Frontier LLMs that still need sharp recall",
    catch: "Still pays attention’s structural costs at scale",
    examples: "GQA · MLA (DeepSeek) · sliding window · sparse",
    source: "https://arxiv.org/abs/2405.04434",
    glyph: "compress",
    complement: true,
  },
  {
    id: "moe",
    n: "02",
    name: "Mixture of experts",
    short: "MoE",
    color: "lime",
    tier: "A",
    tags: ["Sparse compute", "High capacity"],
    maturity: "Production",
    complexity: "Sparse",
    memory: "Large weights",
    parallelTrain: "Good*",
    recall: "Medium–strong",
    idea:
      "Route each token through only a small subset of specialized feed-forward networks.",
    best: "More capacity per active FLOP",
    catch: "Routing and all-to-all communication overhead",
    examples: "Switch · Mixtral · DeepSeekMoE",
    source: "https://arxiv.org/abs/2101.03961",
    glyph: "router",
    complement: true,
  },
  {
    id: "ssm",
    n: "03",
    name: "State-space models",
    short: "SSM",
    color: "teal",
    tier: "A",
    tags: ["Linear time", "Streaming"],
    maturity: "Scaling now",
    complexity: "O(n)",
    memory: "Fixed state",
    parallelTrain: "Good",
    recall: "Variable",
    idea:
      "Compress the past into a continuously updated hidden state instead of revisiting every token.",
    best: "Long sequences, audio, genomics, throughput",
    catch: "Compression can lose exact details",
    examples: "S4 · Mamba · Mamba-2/3",
    source: "https://arxiv.org/abs/2312.00752",
    glyph: "wave",
  },
  {
    id: "hybrid",
    n: "04",
    name: "Hybrid SSM–Transformer",
    short: "Hybrid",
    color: "blue",
    tier: "A",
    tags: ["Best of both", "SOTA path"],
    maturity: "Production / open",
    complexity: "Mixed O(n)–O(n²)",
    memory: "State + sparse KV",
    parallelTrain: "Good",
    recall: "Strong",
    idea:
      "Interleave SSM (or recurrence) layers with attention—and often MoE—for quality plus linear-ish prefill and faster decode.",
    best: "Long-context serving without abandoning recall",
    catch: "More moving parts; scheduling and kernels matter",
    examples: "Jamba · Bamba · Nemotron-H · Samba / SambaY",
    source: "https://arxiv.org/abs/2403.19887",
    glyph: "hybrid",
  },
  {
    id: "rnn",
    n: "05",
    name: "Modern recurrence",
    short: "RNN+",
    color: "coral",
    tier: "A",
    tags: ["Constant decode", "Streaming"],
    maturity: "Open ecosystem",
    complexity: "O(n)",
    memory: "Fixed state",
    parallelTrain: "Good",
    recall: "Variable",
    idea:
      "Revive recurrent memory with parallel-friendly training and much stronger update rules.",
    best: "Low-latency and edge inference",
    catch: "Sequential decode still shapes batching trade-offs",
    examples: "RWKV · xLSTM",
    source: "https://arxiv.org/abs/2305.13048",
    glyph: "loop",
  },

  // --- Tier B ---
  {
    id: "linear",
    n: "06",
    name: "Linear attention",
    short: "Linear",
    color: "violet",
    tier: "B",
    tags: ["Kernelized", "Fast"],
    maturity: "Hybrid adoption",
    complexity: "O(n)",
    memory: "Fixed / linear",
    parallelTrain: "Good",
    recall: "Medium–strong",
    idea:
      "Reorder or approximate attention so keys and values are summarized before querying.",
    best: "Long context with familiar attention math",
    catch: "Approximation may blunt sharp associative recall",
    examples: "Performer · GLA · gated linear variants",
    source: "https://arxiv.org/abs/2009.14794",
    glyph: "matrix",
  },
  {
    id: "retention",
    n: "07",
    name: "Retention networks",
    short: "RetNet",
    color: "coral",
    tier: "B",
    tags: ["Three modes", "Long context"],
    maturity: "Research",
    complexity: "O(n)",
    memory: "Fixed / chunked",
    parallelTrain: "Good",
    recall: "Medium–strong",
    idea:
      "Express the same operator in parallel, recurrent, or chunkwise form depending on the job.",
    best: "Train parallel, serve recurrently",
    catch: "Less mature production tooling than hybrids",
    examples: "RetNet",
    source: "https://arxiv.org/abs/2307.08621",
    glyph: "retention",
  },
  {
    id: "hyena",
    n: "08",
    name: "Long convolutions",
    short: "Hyena",
    color: "teal",
    tier: "B",
    tags: ["Subquadratic", "Long range"],
    maturity: "Research",
    complexity: "O(n log n)",
    memory: "Sequence-dependent",
    parallelTrain: "Good",
    recall: "Variable",
    idea:
      "Replace token-to-token attention with gated, implicitly parameterized long filters.",
    best: "Very long structured sequences",
    catch: "Recall behavior can be task-sensitive",
    examples: "Hyena · Monarch Mixer",
    source: "https://arxiv.org/abs/2302.10866",
    glyph: "filter",
  },

  // --- Tier C ---
  {
    id: "liquid",
    n: "09",
    name: "Liquid networks",
    short: "Liquid",
    color: "ochre",
    tier: "C",
    tags: ["Adaptive", "Continuous time"],
    maturity: "Emerging",
    complexity: "O(n)",
    memory: "Compact state",
    parallelTrain: "Research",
    recall: "Variable",
    idea:
      "Let the network’s dynamics adapt continuously to changing input rather than advance in rigid layers.",
    best: "Robotics, sensors, irregular time",
    catch: "Not yet proven at frontier LLM scale",
    examples: "LTC · CfC",
    source: "https://www.nature.com/articles/s42256-022-00556-7",
    glyph: "liquid",
  },
  {
    id: "spiking",
    n: "10",
    name: "Spiking networks",
    short: "SNN",
    color: "coral",
    tier: "C",
    tags: ["Event-driven", "Low power"],
    maturity: "Experimental",
    complexity: "Event-driven",
    memory: "Neuron state",
    parallelTrain: "Research",
    recall: "Variable",
    idea:
      "Communicate with sparse spikes, enabling addition-heavy computation on neuromorphic hardware.",
    best: "Always-on edge intelligence",
    catch: "Training and language quality gap",
    examples: "SpikeGPT · SpikeLLM",
    source: "https://arxiv.org/abs/2302.13939",
    glyph: "spike",
  },
  {
    id: "symbolic",
    n: "11",
    name: "Neuro-symbolic systems",
    short: "Neuro-sym",
    color: "blue",
    tier: "C",
    tags: ["Compositional", "Auditable"],
    maturity: "Research",
    complexity: "Varies",
    memory: "Structured",
    parallelTrain: "Varies",
    recall: "Strong (structured)",
    idea:
      "Combine learned representations with rules, programs, graphs, or formal solvers.",
    best: "Verifiable reasoning and science",
    catch: "Hard interfaces and supervision",
    examples: "Tool solvers · program synthesis",
    source: "https://arxiv.org/abs/2305.00813",
    glyph: "symbol",
  },
  {
    id: "test-time",
    n: "12",
    name: "Test-time compute",
    short: "TTC",
    color: "ochre",
    tier: "C",
    tags: ["Reasoning", "Inference-time"],
    maturity: "Production pattern",
    complexity: "Extra decode / search",
    memory: "Traces + cache",
    parallelTrain: "N/A (serving)",
    recall: "Strong with search",
    idea:
      "Spend more compute at inference—chains of thought, search, verifiers, and multi-sample selection—rather than only at training.",
    best: "Hard reasoning, contests, agent loops",
    catch: "Latency and cost; not a new layer algebra alone",
    examples: "o1-style · process reward · self-consistency",
    source: "https://arxiv.org/abs/2203.11171",
    glyph: "think",
    complement: true,
  },
];

export const TIER_META: Record<
  ArchTier,
  { label: string; blurb: string }
> = {
  A: {
    label: "Production / near-production",
    blurb: "What labs scale and ship for quality × throughput in 2025–26.",
  },
  B: {
    label: "Strong research alternatives",
    blurb: "Credible sequence operators with less production gravity than Tier A.",
  },
  C: {
    label: "Emerging / orthogonal bets",
    blurb: "Hardware, continuous-time, symbolic, and inference-time paths still maturing.",
  },
};

export const sources: [string, string, string][] = [
  [
    "DeepSeek-V2 (MLA)",
    "Multi-head latent attention compresses KV cache at frontier scale.",
    "https://arxiv.org/abs/2405.04434",
  ],
  [
    "Mamba",
    "Selective state spaces; linear scaling and recurrent inference.",
    "https://arxiv.org/abs/2312.00752",
  ],
  [
    "Jamba",
    "Transformer–Mamba–MoE hybrid for long context and throughput.",
    "https://arxiv.org/abs/2403.19887",
  ],
  [
    "Hybrid Mamba-Transformer (NVIDIA)",
    "Interleaved SSM and attention layers can beat pure transformers.",
    "https://arxiv.org/abs/2406.07887",
  ],
  [
    "RWKV",
    "Parallelizable training with RNN-style constant-state inference.",
    "https://arxiv.org/abs/2305.13048",
  ],
  [
    "xLSTM",
    "Exponential gates and matrix memory modernize recurrence.",
    "https://arxiv.org/abs/2405.04517",
  ],
  [
    "Switch Transformer",
    "Sparse expert routing grows capacity per active compute.",
    "https://arxiv.org/abs/2101.03961",
  ],
  [
    "Hyena Hierarchy",
    "Gated long convolutions as an attention replacement.",
    "https://arxiv.org/abs/2302.10866",
  ],
  [
    "RetNet",
    "Parallel, recurrent, and chunkwise retention modes.",
    "https://arxiv.org/abs/2307.08621",
  ],
  [
    "Self-Consistency",
    "Classic seed of test-time compute via multi-sample selection.",
    "https://arxiv.org/abs/2203.11171",
  ],
  [
    "Closed-form continuous-time networks",
    "Compact adaptive dynamics for temporal data.",
    "https://www.nature.com/articles/s42256-022-00556-7",
  ],
  [
    "SpikeGPT",
    "A generative language model built with spiking neurons.",
    "https://arxiv.org/abs/2302.13939",
  ],
];

export const timeline: [string, string][] = [
  ["1957", "Perceptron"],
  ["1982", "Hopfield nets"],
  ["1997", "LSTM"],
  ["2014", "Neural attention"],
  ["2017", "Transformer"],
  ["2020", "Linear attention"],
  ["2021", "S4 · Switch MoE"],
  ["2023", "Hyena · RWKV · RetNet · Mamba"],
  ["2024", "Jamba · GQA wave · xLSTM"],
  ["2025", "MLA · Bamba · Nemotron-H hybrids"],
  ["2026", "Hybrid + sparse + test-time compute"],
];

export const THEME_STORAGE_KEY = "beyond-transformers-theme";

export function isTheme(value: string | null): value is Theme {
  return value === "atlas" || value === "field" || value === "lab";
}

export function filterArchitectures(
  list: Architecture[],
  mode: FilterMode,
): Architecture[] {
  if (mode === "all") return list;
  return list.filter((a) => a.tier === mode);
}

export function tierCount(list: Architecture[], tier: ArchTier | "all"): number {
  if (tier === "all") return list.length;
  return list.filter((a) => a.tier === tier).length;
}

export function padCount(n: number): string {
  return String(n).padStart(2, "0");
}

/** Illustrative asymptotic scaling for the efficiency lab (not a hardware benchmark). */
export function efficiencyMetrics(lengthK: number) {
  // Log progress from 8K → 1024K (1M) so bars stay readable across orders of magnitude.
  const t =
    Math.log2(Math.max(8, lengthK) / 8) / Math.log2(1024 / 8); // 0..1
  const quadratic = Math.min(100, 16 + t * 84);
  const linear = Math.min(48, 12 + t * 28);
  const gap = Math.max(1, Math.round(quadratic / Math.max(linear, 1)));
  const density = Math.max(3, Math.round(3 + t * 29));
  return { quadratic, linear, gap, density };
}
