import Cell from './Cell';

export default class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this._initializeGrid();
    }

    *[Symbol.iterator]() {
        for (let y = 0; y < this.height; y++) {
            yield* this.grid[y];
        }
    }

    clone() {
        const newGrid = new Grid(this.width, this.height);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                newGrid.grid[i][j].terrain = this.grid[i][j].terrain;
            }
        }

        return newGrid;
    }

    copyCells(cells) {
        const changedCells = new Map();
        for (const cell of cells) {
            const newCell = this.grid[cell.y][cell.x];
            if (cell.terrain !== newCell.terrain) {
                changedCells.set(cell, cell.terrain);
            }
            cell.terrain = newCell.terrain;
        }

        return changedCells;
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
        if (this.grid[y]) {
            if (this.grid[y][x]) {
                return this.grid[y][x];
            }
        }

        return null;
    }

    getVisible(x, y) {
        const visibleCells = new Set();

        for (let row = y - 2; row <= y + 2; row++) {
            for (let column = x - 2; column <= x + 2; column++) {
                const cell = this.getCell(column, row);
                if (cell) {
                    visibleCells.add(cell);
                }
            }
        }

        return visibleCells;
    }
}