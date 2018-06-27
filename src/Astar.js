import Heap from './Heap';

export default function A_star(start, goal) {
    const closedSet = new Set();
    const openSet = new Heap();
    const cameFrom = new Map();
    const gScore = new Map();

    openSet.insert({node: start, f: heuristic(start, goal)});
    gScore.set(start, 0);

    while (openSet.heap.length > 0) {
        const current = openSet.extractRoot();

        if (current.node === goal) {
            return reconstruct_path(cameFrom, current.node);
        }

        closedSet.add(current.node);

        const neighbors = current.node.getNeighbors();
        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor.node)) {
                continue;
            }

            openSet.insert({node: neighbor.node, f: Infinity});

            const tentative_score = getOrDefault(gScore, current.node, Infinity) + neighbor.cost;

            if(tentative_score >= getOrDefault(gScore, neighbor.node, Infinity)) {
                continue;
            }

            cameFrom.set(neighbor.node, current.node);
            gScore.set(neighbor.node, tentative_score);
            openSet.setFscore(neighbor.node, gScore.get(neighbor.node) + heuristic(neighbor.node, goal));
        }
    }
}

function reconstruct_path(cameFrom, current) {
    const total_path = [current];

    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        total_path.unshift(current);
    }
    return total_path;
}

function getOrDefault(map, node, dValue) {
    return map.has(node) ? map.get(node) : dValue;
}

function heuristic(a, b) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    if (dx < dy) {
        return dx * 1.5 + (dy - dx);
    } else {
        return dy * 1.5 + (dx - dy);
    }
}