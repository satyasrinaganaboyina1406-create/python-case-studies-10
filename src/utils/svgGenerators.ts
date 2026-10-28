import { CaseStudy } from '../types/caseStudy';

export function generateFlowchartSvg(cs: CaseStudy): string {
  const nodes = cs.deliverables.flowchart.nodes;
  const edges = cs.deliverables.flowchart.edges;

  // Compute bounding box
  const maxY = Math.max(...nodes.map(n => n.y)) + 120;
  const width = 640;
  const height = maxY;

  let nodesSvg = '';
  for (const n of nodes) {
    const isTerminal = n.type === 'terminal';
    const isDecision = n.type === 'decision';
    const isInput = n.type === 'input';
    const isOutput = n.type === 'output';

    let shapeMarkup = '';
    const nodeW = n.width || (isDecision ? 180 : 190);
    const nodeH = n.height || (isDecision ? 70 : 54);
    const rx = isTerminal ? 26 : 8;

    if (isDecision) {
      // Diamond polygon
      const halfW = nodeW / 2;
      const halfH = nodeH / 2;
      const points = `${n.x},${n.y - halfH} ${n.x + halfW},${n.y} ${n.x},${n.y + halfH} ${n.x - halfW},${n.y}`;
      shapeMarkup = `
        <polygon points="${points}" fill="#1e1b4b" stroke="#818cf8" stroke-width="2" />
      `;
    } else if (isTerminal) {
      shapeMarkup = `
        <rect x="${n.x - nodeW / 2}" y="${n.y - nodeH / 2}" width="${nodeW}" height="${nodeH}" rx="${rx}" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
      `;
    } else if (isInput || isOutput) {
      // Parallelogram
      const skew = 14;
      const left = n.x - nodeW / 2;
      const top = n.y - nodeH / 2;
      const points = `${left + skew},${top} ${left + nodeW},${top} ${left + nodeW - skew},${top + nodeH} ${left},${top + nodeH}`;
      shapeMarkup = `
        <polygon points="${points}" fill="#14532d" stroke="#4ade80" stroke-width="2" />
      `;
    } else {
      // Standard process box
      shapeMarkup = `
        <rect x="${n.x - nodeW / 2}" y="${n.y - nodeH / 2}" width="${nodeW}" height="${nodeH}" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.8" />
      `;
    }

    const sublabelMarkup = n.sublabel
      ? `<text x="${n.x}" y="${n.y + 12}" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">${escapeXml(n.sublabel)}</text>`
      : '';

    const yOffset = n.sublabel ? -4 : 4;

    nodesSvg += `
      <g id="node-${n.id}">
        ${shapeMarkup}
        <text x="${n.x}" y="${n.y + yOffset}" fill="#f8fafc" font-size="12" font-weight="600" font-family="system-ui, sans-serif" text-anchor="middle">${escapeXml(n.label)}</text>
        ${sublabelMarkup}
      </g>
    `;
  }

  let edgesSvg = '';
  for (const e of edges) {
    const fromNode = nodes.find(n => n.id === e.from);
    const toNode = nodes.find(n => n.id === e.to);
    if (!fromNode || !toNode) continue;

    let pathD = '';
    const fromH = (fromNode.type === 'decision' ? 70 : 54) / 2;
    const toH = (toNode.type === 'decision' ? 70 : 54) / 2;

    if (Math.abs(fromNode.x - toNode.x) < 20) {
      // Straight down
      pathD = `M ${fromNode.x} ${fromNode.y + fromH} L ${toNode.x} ${toNode.y - toH}`;
    } else if (toNode.x > fromNode.x) {
      // Branching right
      const fromW = (fromNode.type === 'decision' ? 180 : 190) / 2;
      pathD = `M ${fromNode.x + fromW} ${fromNode.y} L ${toNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y - toH}`;
    } else {
      // Return or side branch
      pathD = `M ${fromNode.x} ${fromNode.y + fromH} L ${toNode.x} ${toNode.y - toH}`;
    }

    const labelMarkup = e.label
      ? `<text x="${(fromNode.x + toNode.x) / 2 + 10}" y="${fromNode.y + 16}" fill="#fbbf24" font-size="10" font-family="monospace" font-weight="bold">${escapeXml(e.label)}</text>`
      : '';

    edgesSvg += `
      <g>
        <path d="${pathD}" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        ${labelMarkup}
      </g>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #0b1120;">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
    </marker>
  </defs>
  <!-- Background Header -->
  <rect x="0" y="0" width="${width}" height="60" fill="#020617" />
  <text x="20" y="36" fill="#38bdf8" font-size="15" font-weight="bold" font-family="system-ui, sans-serif">CASE STUDY ${cs.id}: FLOWCHART SPECIFICATION</text>
  <text x="20" y="52" fill="#64748b" font-size="11" font-family="system-ui, sans-serif">${escapeXml(cs.title)}</text>
  
  <!-- Flowchart Diagram -->
  <g transform="translate(40, 50)">
    ${edgesSvg}
    ${nodesSvg}
  </g>
</svg>`;
}

export function generateTerminalOutputSvg(cs: CaseStudy): string {
  const terminal = cs.deliverables.outputScreenshot;
  const lines = terminal.rawConsoleOutput.split('\n');
  const width = 840;
  const height = Math.max(480, lines.length * 20 + 140);

  let textLinesSvg = '';
  lines.forEach((line, index) => {
    const y = 90 + index * 19;
    let color = '#e2e8f0';
    if (line.startsWith('=')) color = '#38bdf8';
    else if (line.startsWith('-')) color = '#475569';
    else if (line.includes('ERROR') || line.includes('PROBATION') || line.includes('CRITICAL') || line.includes('RECKLESS') || line.includes('FAILED')) color = '#f87171';
    else if (line.includes('PASS') || line.includes('SATISFACTORY') || line.includes('OPTIMAL') || line.includes('COMPLIANT')) color = '#4ade80';
    else if (line.includes('WARNING') || line.includes('REORDER') || line.includes('MEDIUM')) color = '#fbbf24';
    else if (line.startsWith('[')) color = '#a855f7';

    textLinesSvg += `<text x="24" y="${y}" fill="${color}" font-size="13" font-family="'JetBrains Mono', monospace" xml:space="preserve">${escapeXml(line)}</text>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #030712;">
  <!-- Terminal Window Chrome -->
  <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
  <rect x="0" y="0" width="${width}" height="42" rx="12" fill="#0f172a"/>
  
  <!-- Window Buttons -->
  <circle cx="22" cy="21" r="6" fill="#ef4444"/>
  <circle cx="42" cy="21" r="6" fill="#f59e0b"/>
  <circle cx="62" cy="21" r="6" fill="#10b981"/>

  <!-- Window Title -->
  <text x="${width / 2}" y="25" fill="#94a3b8" font-size="12" font-weight="600" font-family="system-ui, sans-serif" text-anchor="middle">terminal ~ python3 ${cs.slug}/solution.py</text>
  
  <!-- Execution Prompt -->
  <text x="24" y="66" fill="#38bdf8" font-size="13" font-weight="bold" font-family="'JetBrains Mono', monospace">$ ${escapeXml(terminal.terminalCommand)}</text>

  <!-- Output Lines -->
  ${textLinesSvg}
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
