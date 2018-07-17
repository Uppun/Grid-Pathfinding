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
            for (let j = 0; j < this.width; j++) {
                newGrid.grid[i][j].passable = this.grid[i][j].passable;
            }
        }

        return newGrid;
    }

    obfuscateGrid(x, y, fullVisibilityMap) {
        const fogGrid = new Grid(this.width, this.height);
        const visibleCells = this.getVisible(x, y);

        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                if (!visibleCells.has(`${column}, ${row}`)) {
                    if (!fullVisibilityMap.has(`${column}, ${row}`)) {
                        fogGrid.grid[row][column].fogVisibility = Cell.fogVisibilityLevels.UNKNOWN;
                    } else {
                        fogGrid.grid[row][column] = this.getCell(column, row);
                        fogGrid.grid[row][column].fogVisibility = Cell.fogVisibilityLevels.SEEN;
                    }
                } else {
                    fogGrid.grid[row][column] = this.getCell(column, row);
                    fogGrid.grid[row][column].fogVisibility = Cell.fogVisibilityLevels.VISIBLE;
                }
            }
        }

        return fogGrid;
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
        const visibleCells = new Map();

        for (let row = y - 2; row <= y + 2; row++) {
            for (let column = x - 2; column <= x + 2; column++) {
                const cell = this.getCell(column, row);
                if (cell) {
                    visibleCells.set(`${column}, ${row}`, cell);
                }
            }
        }

        return visibleCells;
    }
}