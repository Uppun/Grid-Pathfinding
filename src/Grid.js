import Cell from './Cell';

export default class Grid {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this._initializeGrid();
    }

    _initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(new Cell(x, y, this));
            }
            this.grid.push(row);
        }
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