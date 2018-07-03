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
    }

    getNeighbors() {
        const neighbors = [];

        for (const offset of neighborOffsets) {
            const neighbor = this.grid.getCell(this.x + offset.coords[0], this.y + offset.coords[1]);

            if (!neighbor || !neighbor.passable) {
                continue;
            }

            neighbors.push({node: neighbor, cost: offset.cost});
        }

        return neighbors;
    }
}