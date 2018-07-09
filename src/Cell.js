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

export default class Cell {
    constructor(x, y, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.passable = true;
        this.terrain = 'normal';
    }

    static heuristic(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        let terrainCost = 0;
    
        if (a.terrain !== b.terrain) {
            if (a.terrain === 'normal') {
                terrainCost = 2; 
            } else {
                terrainCost = -.75;
            }
        }
    
        if (dx < dy) {
            return dx * 1.5 + (dy - dx) + terrainCost;
        } else {
            return dy * 1.5 + (dx - dy) + terrainCost;
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
                if (neighbor.terrain === 'normal') {
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