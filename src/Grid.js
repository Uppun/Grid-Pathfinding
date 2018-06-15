import Cell from './Cell';

export default class Grid {
    constructor() {
        this.height = 50;
        this.width = 50;
        this.grid = this.generateGrid();
        this.offsets = [{coords: [-1, -1], cost: 1.5},
                        {coords: [0, -1], cost: 1},
                        {coords: [1, -1], cost: 1.5},
                        {coords: [-1, 0], cost: 1},
                        {coords: [1, 0], cost: 1},
                        {coords: [-1, 1], cost: 1.5},
                        {coords: [0, 1], cost: 1},
                        {coords: [1, 1], cost: 1.5}]
    }

    generateGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const newCell = new Cell(x, y, this);
                row.push(newCell);
            }
            grid.push(row);
        }

        return grid;
    }

    getNeighbors(cell) {
        const neighbors = [];

        for (const offset of this.offsets) {
            const row = this.grid[cell.y + offset.coords[1]];

            if (!row) {
                continue;
            }

            const neighbor = row[cell.x + offset.coords[0]];

            if (!neighbor || !neighbor.passable) {
                continue;
            }

            neighbors.push({node: neighbor, cost: offset.cost});

            return neighbors;
        }
    }
}