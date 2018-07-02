import Heap from './Heap';

export default function A_star(start, goal, heuristic) {
    const closedNodes = new Set();
    const openNodes = new Heap();
    const cameFrom = new Map();
    const gScore = new Map();

    openNodes.insert(start, heuristic(start, goal));
    gScore.set(start, 0);

    while (openNodes.getLength() > 0) {
        const root = openNodes.extractRoot();
        const current = root.node;

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        closedNodes.add(current);

        for (const neighbor of current.getNeighbors()) {
            if (closedNodes.has(neighbor.node)) {
                continue;
            }

            openNodes.insert(neighbor.node, Infinity);

            const tentativeScore = getOrDefault(gScore, current, Infinity) + neighbor.cost;

            if (tentativeScore >= getOrDefault(gScore, neighbor.node, Infinity)) {
                continue;
            }

            cameFrom.set(neighbor.node, current);
            gScore.set(neighbor.node, tentativeScore);
            openNodes.setFscore(neighbor.node, tentativeScore + heuristic(neighbor.node, goal));
        }
    }
}

function getOrDefault(map, node, dValue) {
    return map.has(node) ? map.get(node) : dValue;
}

function reconstructPath(cameFrom, current) {
    const path = [current];

    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        path.unshift(current);
    }
    return path;
}