export default class Cell {
    constructor(x, y, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.passable = true;
    }

    getNeighbors() {
        return this.grid.getNeighbors(this);
    }
}