import Heap from './Heap';
import MapWithDefault from './MapWithDefault';

export default function A_star(start, goal, heuristic) {
    const closedNodes = new Set();
    const openNodes = new Heap();
    const cameFrom = new Map();
    const gScore = new MapWithDefault(Infinity);

    openNodes.insert({node: start, f: heuristic(start, goal)});
    gScore.set(start, 0);

    while (openNodes.getLength() > 0) {
        const current = openNodes.extractRoot();

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        closedNodes.add(current);

        for (const neighbor of current.getNeighbors()) {
            if (closedNodes.has(neighbor.node)) {
                continue;
            }

            openNodes.insert(neighbor.node, Infinity);

            const tentativeScore = gScore.get(current) + neighbor.cost;

            if (tentativeScore >= gScore.get(neighbor.node)) {
                continue;
            }

            cameFrom.set(neighbor.node, current);
            gScore.set(neighbor.node, tentativeScore);
            openNodes.setFscore(neighbor.node, tentativeScore + heuristic(neighbor.node, goal));
        }
    }
}

function reconstructPath(cameFrom, current) {
    const path = [current];

    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        path.unshift(current);
    }
    return path;
}