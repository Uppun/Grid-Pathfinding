export default function A_star(start, goal) {
    const closedSet = new Set();
    const openSet = new Set([start]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(start, 0);
    fScore.set(start, heuristic(start, goal));

    while (openSet.size > 0) {
        let current;
        for (const node of openSet) {
            if (!current) {
                current = node;
                continue;
            }

            if (getOrDefault(fScore, current, Infinity) > getOrDefault(fScore, node, Infinity)) {
                current = node;
            }
        }

        if (current === goal) {
            return reconstruct_path(cameFrom, current);
        }

        openSet.delete(current);
        closedSet.add(current);

        const neighbors = current.getNeighbors();
        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor.node)) {
                continue;
            }

            openSet.add(neighbor.node);

            const tentative_score = getOrDefault(gScore, current, Infinity) + neighbor.cost;

            if(tentative_score >= getOrDefault(gScore, neighbor.node, Infinity)) {
                continue;
            }

            cameFrom.set(neighbor.node, current);
            gScore.set(neighbor.node, tentative_score);
            fScore.set(neighbor.node, gScore.get(neighbor.node) + heuristic(neighbor.node, goal));
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
    return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
}