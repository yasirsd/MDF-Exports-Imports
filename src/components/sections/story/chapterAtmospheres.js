/**
 * Per-chapter cinematic atmospheres for the Storytelling stage.
 * Each scene gets its own lighting language — not just a tint swap.
 */
export const CHAPTER_ATMOSPHERES = [
  {
    // 01 Origin — warm harvest gold
    base: "#140e0a",
    glow: "radial-gradient(ellipse at 20% 30%, rgba(255,160,40,0.18), transparent 50%), radial-gradient(ellipse at 80% 75%, rgba(120,60,20,0.4), transparent 55%)",
  },
  {
    // 02 People — natural green / earth
    base: "#0c1410",
    glow: "radial-gradient(ellipse at 25% 40%, rgba(74,140,70,0.2), transparent 52%), radial-gradient(ellipse at 85% 70%, rgba(40,70,35,0.35), transparent 50%)",
  },
  {
    // 03 Harvest — golden sunlight (matches framed amber cards)
    base: "#151008",
    glow: "radial-gradient(ellipse at 28% 30%, rgba(255,180,50,0.2), transparent 48%), radial-gradient(ellipse at 75% 75%, rgba(180,90,20,0.28), transparent 55%)",
  },
  {
    // 04 Care — charcoal + soft orange packhouse glow
    base: "#0e0e10",
    glow: "radial-gradient(ellipse at 30% 35%, rgba(255,122,26,0.12), transparent 48%), radial-gradient(ellipse at 70% 80%, rgba(50,50,60,0.45), transparent 50%)",
  },
  {
    // 05 Cold chain — deep navy + icy blue
    base: "#060b14",
    glow: "radial-gradient(ellipse at 30% 35%, rgba(56,160,220,0.18), transparent 50%), radial-gradient(ellipse at 75% 70%, rgba(20,60,120,0.35), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(10,30,60,0.5), transparent 50%)",
  },
  {
    // 06 Arrival — warm amber port glow (distinct from Ch5 navy/ice)
    base: "#0c0906",
    glow: "radial-gradient(ellipse at 70% 35%, rgba(255,130,30,0.2), transparent 48%), radial-gradient(ellipse at 20% 75%, rgba(180,90,20,0.22), transparent 50%), radial-gradient(ellipse at 50% 0%, rgba(60,30,10,0.45), transparent 45%)",
  },
];
