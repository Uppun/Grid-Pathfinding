import Cell from './Cell';

export default class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this._initializeGrid();
    }

    clone() {
        const newGrid = new Grid(this.width, this.height);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width  ; j++) {
                newGrid.grid[i][j].passable = this.grid[i][j].passable;
            }
        }

        return newGrid;
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