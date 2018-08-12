import Heap from './Heap';
import Cell from './Cell';

export default class Dstarlite {
    constructor(start, goal, heuristic) {
        this.heap = new Heap();
        this.km = 0;
        this.rhs = new Map();
        this.gscore = new Map();
        this.heuristic = heuristic;
        this.start = start;
        this.goal = goal;
    }

    initialize() {
        const grid = this.goal.grid;
        for (const cell of grid) {
            this.gscore.set(cell, Infinity);
            this.rhs.set(cell, Infinity);
        }

        this.rhs.set(this.goal, 0);
        this.heap.insert(this.goal, this.calculateKey(this.goal));
    }

    calculateKey(node) {
        const min = Math.min(this.gscore.get(node), this.rhs.get(node));
        return [
            min + this.heuristic(this.start, node) + this.km,
            min,
        ];
    }

    compareKeys(key1, key2) {
        if (key1[0] === key2[0]) {
            return key1[1] - key2[1];
        }
        return key1[0] - key2[0];
    }

    updateVertex(u) {
        if (u !== this.goal) {
            let rhs = Infinity;
            for (const {node: successor} of u.getNeighbors(true)) {
                rhs = Math.min(rhs, Cell.calculateCost(u, successor) + this.gscore.get(successor));
            }
            this.rhs.set(u, rhs);
        }

        this.heap.remove(u);

        if (this.gscore.get(u) !== this.rhs.get(u)) {
            this.heap.insert(u, this.calculateKey(u));
        }
    }

    computeShortestPath() {
        let loopCounter = 0;       
        while (loopCounter < 1000000) {
            loopCounter++;
            if (this.compareKeys(this.heap.topKey(), this.calculateKey(this.start)) >= 0 && 
                this.rhs.get(this.start) === this.gscore.get(this.start)) {
                break;
            }
            const {node: u, key: k_old} = this.heap.pop();
            if (this.compareKeys(k_old, this.calculateKey(u)) < 0) {
                this.heap.insert(u, this.calculateKey(u));
            } else if (this.gscore.get(u) > this.rhs.get(u)) {
                this.gscore.set(u, this.rhs.get(u));
                for (const {node} of u.getNeighbors(true)) {
                    this.updateVertex(node);
                }
            } else {
                this.gscore.set(u, Infinity);
                const predeccesors = [...u.getNeighbors(true), {node: u}];
                for (const {node} of predeccesors) {
                    this.updateVertex(node);
                }
            }
        }
    }

    beginPathfinding() {
        this.last = this.start;
        this.initialize();
        this.computeShortestPath();
    }

    nextStep() {
        if (this.gscore.get(this.start) === Infinity) {
            return null; 
        }
        let best;
        for (const {node} of this.start.getNeighbors(true)) {
            const val = Cell.calculateCost(this.start, node) + this.gscore.get(node);
            if (best == null || val < best.val) {
                best = {node, val};
            }
        }
        this.start = best.node;

        return {x: this.start.x, y: this.start.y};
    }

    updateCost(changedCells) {
        this.km += this.heuristic(this.last, this.start);
        this.last = this.start;

        for (const [cell] of changedCells) {
            this.updateVertex(cell);
            for (const neighbor of cell.getNeighbors(true)) {
                this.updateVertex(neighbor.node);
            }
        }

        this.computeShortestPath();
    }
}