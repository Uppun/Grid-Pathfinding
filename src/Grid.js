import Cell from './Cell';

export default class Grid {
    constructor() {
        this.height = 50;
        this.width = 50;
        this.grid = this.generateGrid();
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

    getCell(x, y) {
        if(this.grid[y]) {
            if(this.grid[y][x]) {
                return this.grid[y][x];
            }
        }

        return null;
    }
}