/**
 * Renders a left → right architecture graph from data.
 * columns: [{ label, nodes: [{ name, kind }] }]
 * Adjacent columns are joined through a vertical "bus" so the diagram stays readable.
 */
const COL_W = 168;
const NODE_W = 132;
const NODE_H = 34;
const GAP = 12;
const TOP = 30;
const PAD = 8;

export default function ArchitectureDiagram({ columns, title, compact = false }) {
  const maxNodes = Math.max(...columns.map((c) => c.nodes.length));
  const innerH = maxNodes * NODE_H + (maxNodes - 1) * GAP;
  const width = columns.length * COL_W - (COL_W - NODE_W) + PAD * 2;
  const height = TOP + innerH + PAD * 2;

  const layout = columns.map((col, ci) => {
    const colH = col.nodes.length * NODE_H + (col.nodes.length - 1) * GAP;
    const offsetY = TOP + PAD + (innerH - colH) / 2;
    const x = PAD + ci * COL_W;
    return {
      ...col,
      x,
      nodes: col.nodes.map((n, ni) => ({ ...n, x, y: offsetY + ni * (NODE_H + GAP) })),
    };
  });

  const buses = layout.slice(0, -1).map((col, ci) => {
    const next = layout[ci + 1];
    const busX = col.x + NODE_W + (COL_W - NODE_W) / 2;
    const ys = [...col.nodes, ...next.nodes].map((n) => n.y + NODE_H / 2);
    let d = `M${busX},${Math.min(...ys)} V${Math.max(...ys)}`;
    col.nodes.forEach((n) => (d += ` M${n.x + NODE_W},${n.y + NODE_H / 2} H${busX}`));
    next.nodes.forEach((n) => (d += ` M${busX},${n.y + NODE_H / 2} H${n.x}`));
    return d;
  });

  const desc = columns.map((c) => `${c.label}: ${c.nodes.map((n) => n.name).join(", ")}`).join(" → ");

  return (
    <div className={`overflow-x-auto ${compact ? "" : "-mx-1 px-1"}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="bk-diagram block h-auto w-full"
        style={{ minWidth: compact ? 0 : 640 }}
        role="img"
        aria-label={`${title || "Architecture"} diagram. ${desc}`}
      >
        {layout.map((col) => (
          <text key={col.label} x={col.x + NODE_W / 2} y={PAD + 10} textAnchor="middle" className="bk-col-label">
            {col.label}
          </text>
        ))}

        {buses.map((d, i) => (
          <g key={i}>
            <path d={d} className="bk-edge" />
            <path d={d} className="bk-flow" />
          </g>
        ))}

        {layout.map((col) =>
          col.nodes.map((n) => (
            <g key={`${col.label}-${n.name}`} className={`bk-node k-${n.kind}`}>
              <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={7} />
              <text x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + 4} textAnchor="middle">
                {n.name}
              </text>
            </g>
          ))
        )}
      </svg>
    </div>
  );
}

