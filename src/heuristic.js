export default function heuristic(a, b) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    if (dx < dy) {
        return dx * 1.5 + (dy - dx);
    } else {
        return dy * 1.5 + (dx - dy);
    }
}