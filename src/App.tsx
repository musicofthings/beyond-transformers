
import { useMemo, useState } from "react";

type Theme = "atlas" | "field" | "lab";

const architectures = [
  { id:"ssm", n:"01", name:"State-space models", short:"SSM", color:"teal", tags:["Linear time","Streaming"], maturity:"Scaling now", complexity:"O(n)", memory:"Fixed state", idea:"Compress the past into a continuously updated hidden state instead of revisiting every token.", best:"Long sequences, audio, genomics", catch:"Compression can lose exact details", examples:"S4 · Mamba · Mamba-2/3", source:"https://arxiv.org/abs/2312.00752", glyph:"wave" },
  { id:"rnn", n:"02", name:"Modern recurrence", short:"RNN+", color:"blue", tags:["Constant decode","Streaming"], maturity:"Open ecosystem", complexity:"O(n)", memory:"Fixed state", idea:"Revive recurrent memory with parallel-friendly training and much stronger update rules.", best:"Low-latency and edge inference", catch:"Sequential decoding limits batching", examples:"RWKV · xLSTM", source:"https://arxiv.org/abs/2305.13048", glyph:"loop" },
  { id:"retention", n:"03", name:"Retention networks", short:"RetNet", color:"coral", tags:["Three modes","Long context"], maturity:"Research", complexity:"O(n)", memory:"Fixed / chunked", idea:"Express the same operator in parallel, recurrent, or chunkwise form depending on the job.", best:"Train parallel, serve recurrently", catch:"Less mature tooling", examples:"RetNet", source:"https://arxiv.org/abs/2307.08621", glyph:"retention" },
  { id:"hyena", n:"04", name:"Long convolutions", short:"Hyena", color:"teal", tags:["Subquadratic","Long range"], maturity:"Research", complexity:"O(n log n)", memory:"Sequence-dependent", idea:"Replace token-to-token attention with gated, implicitly parameterized long filters.", best:"Very long structured sequences", catch:"Recall behavior can be task-sensitive", examples:"Hyena · Monarch Mixer", source:"https://arxiv.org/abs/2302.10866", glyph:"filter" },
  { id:"linear", n:"05", name:"Linear attention", short:"Linear", color:"violet", tags:["Kernelized","Fast"], maturity:"Hybrid adoption", complexity:"O(n)", memory:"Fixed / linear", idea:"Reorder or approximate attention so keys and values are summarized before querying.", best:"Long context with familiar attention", catch:"Approximation may reduce sharp recall", examples:"Performer · GLA · Kimi Linear", source:"https://arxiv.org/abs/2009.14794", glyph:"matrix" },
  { id:"moe", n:"06", name:"Mixture of experts", short:"MoE", color:"lime", tags:["Sparse compute","High capacity"], maturity:"Production", complexity:"Sparse", memory:"Large weights", idea:"Route each token through only a small subset of specialized feed-forward networks.", best:"More capacity per active FLOP", catch:"Routing and communication overhead", examples:"Switch · Mixtral · DeepSeekMoE", source:"https://arxiv.org/abs/2101.03961", glyph:"router", complement:true },
  { id:"liquid", n:"07", name:"Liquid networks", short:"Liquid", color:"ochre", tags:["Adaptive","Continuous time"], maturity:"Emerging", complexity:"O(n)", memory:"Compact state", idea:"Let the network’s dynamics adapt continuously to changing input rather than advance in rigid layers.", best:"Robotics, sensors, irregular time", catch:"Not yet proven at frontier LLM scale", examples:"LTC · CfC", source:"https://www.nature.com/articles/s42256-022-00556-7", glyph:"liquid" },
  { id:"spiking", n:"08", name:"Spiking networks", short:"SNN", color:"coral", tags:["Event-driven","Low power"], maturity:"Experimental", complexity:"Event-driven", memory:"Neuron state", idea:"Communicate with sparse spikes, enabling addition-heavy computation on neuromorphic hardware.", best:"Always-on edge intelligence", catch:"Training and language quality gap", examples:"SpikeGPT · SpikeLLM", source:"https://arxiv.org/abs/2302.13939", glyph:"spike" },
  { id:"symbolic", n:"09", name:"Neuro-symbolic systems", short:"Neuro↔Symbolic", color:"blue", tags:["Compositional","Auditable"], maturity:"Research", complexity:"Varies", memory:"Structured", idea:"Combine learned representations with rules, programs, graphs, or formal solvers.", best:"Verifiable reasoning and science", catch:"Hard interfaces and supervision", examples:"Tool solvers · program synthesis", source:"https://arxiv.org/abs/2305.00813", glyph:"symbol" },
];

const sources = [
  ["Mamba", "Selective state spaces; linear scaling and recurrent inference.", "https://arxiv.org/abs/2312.00752"],
  ["Hyena Hierarchy", "Gated long convolutions as an attention replacement.", "https://arxiv.org/abs/2302.10866"],
  ["RWKV", "Parallelizable training with RNN-style constant-state inference.", "https://arxiv.org/abs/2305.13048"],
  ["RetNet", "Parallel, recurrent, and chunkwise retention modes.", "https://arxiv.org/abs/2307.08621"],
  ["xLSTM", "Exponential gates and matrix memory modernize recurrence.", "https://arxiv.org/abs/2405.04517"],
  ["Switch Transformer", "Sparse expert routing grows capacity per active compute.", "https://arxiv.org/abs/2101.03961"],
  ["Closed-form continuous-time networks", "Compact adaptive dynamics for temporal data.", "https://www.nature.com/articles/s42256-022-00556-7"],
  ["SpikeGPT", "A generative language model built with spiking neurons.", "https://arxiv.org/abs/2302.13939"],
];

function Glyph({type}:{type:string}) {
  if(type==="router") return <svg viewBox="0 0 120 72"><circle cx="60" cy="36" r="12"/><path d="M8 8h16M8 22h16M8 36h16M8 50h16M8 64h16M96 8h16M96 25h16M96 47h16M96 64h16M24 8l25 22M24 22l25 10M24 36h25M24 50l25-10M24 64l25-22M71 31L96 8M72 34l24-9M72 39l24 8M71 42l25 22"/></svg>;
  if(type==="matrix") return <svg viewBox="0 0 120 72"><path d="M14 11h92v50H14zM37 11v50M60 11v50M83 11v50M14 28h92M14 45h92"/><path className="accent" d="M16 58L35 47 58 42 81 25 104 14"/></svg>;
  if(type==="loop") return <svg viewBox="0 0 120 72"><path d="M10 36h30M80 36h30M40 18h40v36H40zM60 18V7h31v20"/><path className="accent" d="M88 20l3 7-7-2"/><text x="52" y="41">hₜ</text></svg>;
  if(type==="spike") return <svg viewBox="0 0 120 72"><path d="M5 52h15l5-11 7 11h12l7-38 9 52 8-35 8 21h13l5-14 7 14h15"/></svg>;
  if(type==="symbol") return <svg viewBox="0 0 120 72"><path d="M8 13h40v46H8zM72 12l32 18v30H72L56 36zM48 36h8M72 30l-16 6M72 60L56 36"/><text x="16" y="31">IF</text><text x="16" y="48">THEN</text></svg>;
  if(type==="retention") return <svg viewBox="0 0 120 72"><path d="M7 56h106M14 50c14 0 15-30 30-30s15 24 29 24 15-17 36-31"/><path className="accent" d="M15 58V18M38 58V23M61 58V31M84 58V39M107 58V45"/></svg>;
  return <svg viewBox="0 0 120 72"><path d="M5 42c12-35 24 28 36-6s24 25 37-7 22 22 37-9"/><path className="accent" d="M5 52c17-10 24 8 40-2s25 9 40-4 20 4 30-6"/></svg>;
}

export default function Home() {
  const [theme,setTheme] = useState<Theme>("atlas");
  const [active,setActive] = useState("all");
  const [selected,setSelected] = useState("ssm");
  const [length,setLength] = useState(32);
  const filtered = useMemo(()=>architectures.filter(a=>active==="all" || (active==="backbone" ? !a.complement : a.complement)),[active]);
  const n2 = Math.min(100, 18 + length*.62);
  const linear = Math.min(58, 14 + length*.16);
  return <main className={`site theme-${theme}`}>
    <div className="themebar" aria-label="Choose a visual theme">
      <span>Choose your lens</span>
      <div className="themechoices">
        <button className={theme==="atlas"?"on":""} onClick={()=>setTheme("atlas")}><i>◉</i> Architecture Atlas</button>
        <button className={theme==="field"?"on":""} onClick={()=>setTheme("field")}><i>▤</i> Field Guide</button>
        <button className={theme==="lab"?"on":""} onClick={()=>setTheme("lab")}><i>⌁</i> Efficiency Lab</button>
      </div>
    </div>
    <header>
      <a className="brand" href="#top">BEYOND <b>/</b> TRANSFORMERS</a>
      <nav><a href="#atlas">Architectures</a><a href="#efficiency">Efficiency</a><a href="#compare">Compare</a><a href="#timeline">Timeline</a></nav>
      <a className="outline" href="#atlas">Explore the map <span>→</span></a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">A FIELD GUIDE TO THE POST-TRANSFORMER LANDSCAPE</p>
        <h1>{theme==="field" ? <>THE MACHINES<br/>BEYOND ATTENTION</> : theme==="lab" ? <>Intelligence<br/>beyond attention.</> : <>The future of intelligence is bigger than one architecture.</>}</h1>
        <p className="dek">Transformers changed AI. But attention is not the only path to capable language models. Explore the architectures competing on memory, speed, energy, and scale.</p>
        <div className="hero-actions"><a className="primary" href="#atlas">Explore architectures <span>→</span></a><a href="#why">Why transformers dominate <span>↘</span></a></div>
        <div className="truth"><b>The honest takeaway</b><span>There is no universal winner. The likely future is hybrid.</span></div>
      </div>
      <div className="hero-viz" aria-label="Map of architecture families">
        <div className="reference"><div className="token-grid">{Array.from({length:25}).map((_,i)=><i key={i}/>)}</div><strong>Transformer</strong><span>REFERENCE</span></div>
        {architectures.slice(0,6).map((a,i)=><button key={a.id} className={`orbit orbit-${i} ${selected===a.id?"selected":""}`} onClick={()=>setSelected(a.id)}><Glyph type={a.glyph}/><b>{a.short}</b><small>{a.tags[0]}</small></button>)}
        <svg className="routes" viewBox="0 0 680 520" preserveAspectRatio="none"><path d="M340 260C250 200 190 100 110 74M340 260C430 180 505 74 575 80M340 260C455 245 560 220 620 230M340 260C440 330 520 400 590 430M340 260C300 360 240 440 150 448M340 260C245 285 150 310 70 300"/></svg>
        <div className="selected-note"><span>{architectures.find(a=>a.id===selected)?.name}</span><b>{architectures.find(a=>a.id===selected)?.idea}</b></div>
      </div>
    </section>

    <section className="why" id="why">
      <div><p className="kicker">WHY THE WINNER KEEPS WINNING</p><h2>Transformers dominate for reasons beyond attention.</h2></div>
      <div className="why-grid"><article><b>01</b><h3>Parallel training</h3><p>Every token in a training sequence can be processed together, keeping accelerators busy.</p></article><article><b>02</b><h3>Scaling evidence</h3><p>Years of predictable scaling behavior lowered the risk of billion-dollar training runs.</p></article><article><b>03</b><h3>Software gravity</h3><p>Kernels, compilers, serving stacks, checkpoints, and talent all optimize for attention.</p></article><article><b>04</b><h3>Flexible retrieval</h3><p>Attention can directly compare any token with any other token—powerful for exact recall.</p></article></div>
    </section>

    <section className="architecture-section" id="atlas">
      <div className="section-head"><div><p className="kicker">THE ARCHITECTURE ATLAS</p><h2>Nine paths beyond full attention</h2></div><p>Some replace the backbone. Others complement it. Select a card to see what each design gains—and gives up.</p></div>
      <div className="filters"><button className={active==="all"?"on":""} onClick={()=>setActive("all")}>All families <b>09</b></button><button className={active==="backbone"?"on":""} onClick={()=>setActive("backbone")}>Backbone alternatives <b>08</b></button><button className={active==="complement"?"on":""} onClick={()=>setActive("complement")}>Complementary <b>01</b></button></div>
      <div className="cards">{filtered.map(a=><article key={a.id} className={`arch-card ${a.color}`} tabIndex={0}>
        <div className="card-top"><span>{a.n}</span><em>{a.maturity}</em></div><h3>{a.name}</h3><div className="glyph"><Glyph type={a.glyph}/></div><div className="chips">{a.tags.map(t=><b key={t}>{t}</b>)}</div><p>{a.idea}</p><dl><div><dt>Best at</dt><dd>{a.best}</dd></div><div><dt>Watch out</dt><dd>{a.catch}</dd></div></dl><a href={a.source} target="_blank" rel="noreferrer"><span>{a.examples}</span><b>↗</b></a>
      </article>)}</div>
    </section>

    <section className="efficiency" id="efficiency">
      <div className="section-head"><div><p className="kicker">EFFICIENCY LAB</p><h2>What changes as context grows?</h2></div><p>Drag the context control. This conceptual model shows asymptotic behavior—not a universal hardware benchmark.</p></div>
      <div className="lab-grid">
        <div className="scaler"><div className="scale-top"><span>Sequence length</span><b>{length}K tokens</b></div><input aria-label="Sequence length in thousands of tokens" type="range" min="8" max="128" step="8" value={length} onChange={e=>setLength(+e.target.value)}/><div className="ticks"><span>8K</span><span>32K</span><span>64K</span><span>128K</span></div></div>
        <div className="flows">
          <div className="flow transformer-flow"><div className="flow-label"><i>×²</i><span><b>Full attention</b><small>Token × token interactions</small></span></div><div className="matrix-mini" style={{"--density":`${Math.max(3,Math.round(length/8))}`} as React.CSSProperties}>{Array.from({length:64}).map((_,i)=><i key={i}/>)}</div><div className="meter"><b style={{width:`${n2}%`}}/><span>O(n²) compute</span></div></div>
          <div className="flow linear-flow"><div className="flow-label"><i>→</i><span><b>Recurrent / state-space</b><small>Compact state updates</small></span></div><div className="states">{[1,2,3,4,5].map(i=><i key={i}>s<sub>{i}</sub></i>)}</div><div className="meter"><b style={{width:`${linear}%`}}/><span>O(n) compute</span></div></div>
        </div>
        <div className="lab-note"><strong>{Math.round(n2/linear)}×</strong><span>relative scaling gap<br/><small>illustrative at {length}K</small></span></div>
      </div>
    </section>

    <section className="compare" id="compare">
      <div className="section-head"><div><p className="kicker">THE TRADE-OFF TABLE</p><h2>Efficiency is multidimensional</h2></div><p>Big-O notation describes growth, not real-world speed. Hardware utilization, kernels, batch size, model quality, and sequence length still decide the winner.</p></div>
      <div className="table-wrap"><table><thead><tr><th>Architecture</th><th>Sequence compute</th><th>Decode state</th><th>Parallel training</th><th>Exact token recall</th><th>LLM maturity</th></tr></thead><tbody>
        <tr><th>Transformer</th><td><mark className="bad">O(n²)</mark></td><td>Growing KV cache</td><td>Excellent</td><td>Strong</td><td><mark className="good">Dominant</mark></td></tr>
        {architectures.slice(0,6).map(a=><tr key={a.id}><th>{a.name}</th><td><mark className="good">{a.complexity}</mark></td><td>{a.memory}</td><td>{["ssm","rnn","retention","hyena","linear"].includes(a.id)?"Good":"Good*"}</td><td>{["retention","linear","moe"].includes(a.id)?"Medium–strong":"Variable"}</td><td>{a.maturity}</td></tr>)}
      </tbody></table></div>
    </section>

    <section className="timeline" id="timeline"><div className="section-head"><div><p className="kicker">A 70-YEAR SEARCH</p><h2>Attention is one chapter</h2></div><p>The field repeatedly moves between explicit memory, convolution, recurrence, routing, and learned dynamics.</p></div><div className="timeline-track">{[["1957","Perceptron"],["1982","Hopfield nets"],["1997","LSTM"],["2014","Neural attention"],["2017","Transformer"],["2020","Linear attention"],["2021","S4 · Switch"],["2023","Hyena · RWKV · RetNet · Mamba"],["2024–26","xLSTM · Mamba-2/3 · new hybrids"]].map((x,i)=><div key={i} className={x[1]==="Transformer"?"pivot":""}><b>{x[0]}</b><i/><span>{x[1]}</span></div>)}</div></section>

    <section className="future"><p className="kicker">WHAT TO WATCH</p><h2>The post-transformer era may still contain transformers.</h2><div className="future-grid"><article><b>01</b><h3>Hybrid backbones</h3><p>Small attention layers mixed with SSMs, recurrence, convolutions, or local windows.</p></article><article><b>02</b><h3>Inference-first design</h3><p>Architectures optimized for memory bandwidth, continuous batching, and on-device state.</p></article><article><b>03</b><h3>Hardware–model co-design</h3><p>Neuromorphic chips, analog compute, and custom kernels changing what “efficient” means.</p></article></div></section>

    <section className="sources"><div className="section-head"><div><p className="kicker">PRIMARY SOURCES</p><h2>Read the papers, not the hype</h2></div><p>Claims throughout this guide are framed as architecture-level tendencies. Reported speedups are hardware- and implementation-specific.</p></div><div className="source-list">{sources.map((s,i)=><a key={i} href={s[2]} target="_blank" rel="noreferrer"><b>{String(i+1).padStart(2,"0")}</b><span><strong>{s[0]}</strong><small>{s[1]}</small></span><i>↗</i></a>)}</div></section>
    <footer><div className="brand">BEYOND <b>/</b> TRANSFORMERS</div><p>An educational atlas of architectures competing to make machine intelligence faster, leaner, and stranger.</p><a href="#top">Back to top ↑</a></footer>
    <a className="back-to-top" href="#top" aria-label="Back to top" title="Back to top"><span>↑</span></a>
  </main>
}
