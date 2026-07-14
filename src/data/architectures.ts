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
  | "symbol";

export type FilterMode = "all" | "backbone" | "complement";

export interface Architecture {
  id: string;
  n: string;
  name: string;
  short: string;
  color: ArchColor;
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
  /** True when this family typically complements transformers rather than replacing them. */
  complement?: boolean;
}

export const architectures: Architecture[] = [
  {
    id: "ssm",
    n: "01",
    name: "State-space models",
    short: "SSM",
    color: "teal",
    tags: ["Linear time", "Streaming"],
    maturity: "Scaling now",
    complexity: "O(n)",
    memory: "Fixed state",
    parallelTrain: "Good",
    recall: "Variable",
    idea:
      "Compress the past into a continuously updated hidden state instead of revisiting every token.",
    best: "Long sequences, audio, genomics",
    catch: "Compression can lose exact details",
    examples: "S4 · Mamba · Mamba-2/3",
    source: "https://arxiv.org/abs/2312.00752",
    glyph: "wave",
  },
  {
    id: "rnn",
    n: "02",
    name: "Modern recurrence",
    short: "RNN+",
    color: "blue",
    tags: ["Constant decode", "Streaming"],
    maturity: "Open ecosystem",
    complexity: "O(n)",
    memory: "Fixed state",
    parallelTrain: "Good",
    recall: "Variable",
    idea:
      "Revive recurrent memory with parallel-friendly training and much stronger update rules.",
    best: "Low-latency and edge inference",
    catch: "Sequential decoding limits batching",
    examples: "RWKV · xLSTM",
    source: "https://arxiv.org/abs/2305.13048",
    glyph: "loop",
  },
  {
    id: "retention",
    n: "03",
    name: "Retention networks",
    short: "RetNet",
    color: "coral",
    tags: ["Three modes", "Long context"],
    maturity: "Research",
    complexity: "O(n)",
    memory: "Fixed / chunked",
    parallelTrain: "Good",
    recall: "Medium–strong",
    idea:
      "Express the same operator in parallel, recurrent, or chunkwise form depending on the job.",
    best: "Train parallel, serve recurrently",
    catch: "Less mature tooling",
    examples: "RetNet",
    source: "https://arxiv.org/abs/2307.08621",
    glyph: "retention",
  },
  {
    id: "hyena",
    n: "04",
    name: "Long convolutions",
    short: "Hyena",
    color: "teal",
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
  {
    id: "linear",
    n: "05",
    name: "Linear attention",
    short: "Linear",
    color: "violet",
    tags: ["Kernelized", "Fast"],
    maturity: "Hybrid adoption",
    complexity: "O(n)",
    memory: "Fixed / linear",
    parallelTrain: "Good",
    recall: "Medium–strong",
    idea:
      "Reorder or approximate attention so keys and values are summarized before querying.",
    best: "Long context with familiar attention",
    catch: "Approximation may reduce sharp recall",
    examples: "Performer · GLA · Kimi Linear",
    source: "https://arxiv.org/abs/2009.14794",
    glyph: "matrix",
  },
  {
    id: "moe",
    n: "06",
    name: "Mixture of experts",
    short: "MoE",
    color: "lime",
    tags: ["Sparse compute", "High capacity"],
    maturity: "Production",
    complexity: "Sparse",
    memory: "Large weights",
    parallelTrain: "Good*",
    recall: "Medium–strong",
    idea:
      "Route each token through only a small subset of specialized feed-forward networks.",
    best: "More capacity per active FLOP",
    catch: "Routing and communication overhead",
    examples: "Switch · Mixtral · DeepSeekMoE",
    source: "https://arxiv.org/abs/2101.03961",
    glyph: "router",
    complement: true,
  },
  {
    id: "liquid",
    n: "07",
    name: "Liquid networks",
    short: "Liquid",
    color: "ochre",
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
    n: "08",
    name: "Spiking networks",
    short: "SNN",
    color: "coral",
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
    n: "09",
    name: "Neuro-symbolic systems",
    short: "Neuro↔Symbolic",
    color: "blue",
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
];

export const sources: [string, string, string][] = [
  [
    "Mamba",
    "Selective state spaces; linear scaling and recurrent inference.",
    "https://arxiv.org/abs/2312.00752",
  ],
  [
    "Hyena Hierarchy",
    "Gated long convolutions as an attention replacement.",
    "https://arxiv.org/abs/2302.10866",
  ],
  [
    "RWKV",
    "Parallelizable training with RNN-style constant-state inference.",
    "https://arxiv.org/abs/2305.13048",
  ],
  [
    "RetNet",
    "Parallel, recurrent, and chunkwise retention modes.",
    "https://arxiv.org/abs/2307.08621",
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
  ["2021", "S4 · Switch"],
  ["2023", "Hyena · RWKV · RetNet · Mamba"],
  ["2024–26", "xLSTM · Mamba-2/3 · new hybrids"],
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
  if (mode === "backbone") return list.filter((a) => !a.complement);
  return list.filter((a) => a.complement);
}

/** Illustrative asymptotic scaling for the efficiency lab (not a hardware benchmark). */
export function efficiencyMetrics(lengthK: number) {
  const quadratic = Math.min(100, 18 + lengthK * 0.62);
  const linear = Math.min(58, 14 + lengthK * 0.16);
  const gap = Math.round(quadratic / linear);
  const density = Math.max(3, Math.round(lengthK / 8));
  return { quadratic, linear, gap, density };
}
