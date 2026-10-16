// Turns a Markdown image that stands alone in its paragraph into a framed, numbered figure.
// The image's title picks the frame:  ![Caption](path "window")  – a macOS window with traffic lights,
//   "diagram" – a white card with padding, "natural" – its own size, centred. No title: "natural".
// The alt text becomes the caption (and stays the alt text).
const KINDS = new Set(["window", "diagram", "natural"]);

const el = (tagName, className, children = []) => ({
  type: "element", tagName, properties: className ? { className: [className] } : {}, children,
});

function onlyImage(node) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  const real = node.children.filter((c) => !(c.type === "text" && !c.value.trim()));
  return real.length === 1 && real[0].type === "element" && real[0].tagName === "img" ? real[0] : null;
}

function figure(img) {
  const kind = KINDS.has(img.properties?.title) ? img.properties.title : "natural";
  delete img.properties.title;
  const frame = el("div", "shot-frame", kind === "window"
    ? [el("div", "shot-bar", [el("span"), el("span"), el("span")]), img]
    : [img]);
  const caption = String(img.properties?.alt ?? "");
  return el("figure", `shot shot-${kind}`, caption ? [frame, el("figcaption", "", [{ type: "text", value: caption }])] : [frame]);
}

function walk(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    const img = onlyImage(child);
    if (img) return figure(img);
    walk(child);
    return child;
  });
}

export default function rehypeFigures() {
  return (tree) => walk(tree);
}
