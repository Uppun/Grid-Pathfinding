const neighborOffsets = [
    {coords: [-1, -1], cost: 1.5},
    {coords: [0, -1], cost: 1},
    {coords: [1, -1], cost: 1.5},
    {coords: [-1, 0], cost: 1},
    {coords: [1, 0], cost: 1},
    {coords: [-1, 1], cost: 1.5},
    {coords: [0, 1], cost: 1},
    {coords: [1, 1], cost: 1.5}
];

const NORMAL_TO_MOUNTAIN_COST_MULTIPLIER = 3;
const MOUNTAIN_TO_NORMAL_COST_MULTIPLIER = .5;

export default class Cell {
    constructor(x, y, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.passable = true;
        this.terrain = Cell.Terrain.NORMAL;
    }


    static Terrain = {
        NORMAL: 'normal',
        MOUNTAIN: 'mountain',
    }

    static heuristic(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);

        const diagonal = Math.min(dx, dy);
        const straight = Math.max(dx, dy) - diagonal;
    
        if (a.terrain === 'normal' && b.terrain === 'mountain') {
            if (diagonal > 0) {
                return (diagonal - 1) * 1.5 + (straight + 1 + NORMAL_TO_MOUNTAIN_COST_MULTIPLIER);
            } else {
                return (straight - 1) + NORMAL_TO_MOUNTAIN_COST_MULTIPLIER;
            }
        } else if (a.terrain === 'mountain' && b.terrain === 'normal') {
            if (diagonal > 0) {
                return (diagonal - 1 + 1.5 * MOUNTAIN_TO_NORMAL_COST_MULTIPLIER) + straight;
            } else {
                return (straight - 1) + MOUNTAIN_TO_NORMAL_COST_MULTIPLIER;
            }
        } else {
            return diagonal * 1.5 + straight;
        }
    }

    getNeighbors() {
        const neighbors = [];

        for (const offset of neighborOffsets) {
            const neighbor = this.grid.getCell(this.x + offset.coords[0], this.y + offset.coords[1]);

            if (!neighbor || !neighbor.passable) {
                continue;
            }

            let cost = offset.cost;

            if (neighbor.terrain !== this.terrain) {
                if (neighbor.terrain === Cell.Terrain.NORMAL) {
                    cost = offset.cost * 0.5;
                } else {
                    cost = offset.cost * 3;
                }
            }

            neighbors.push({node: neighbor, cost});
        }

        return neighbors;
    }
}