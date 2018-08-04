import Heap from './Heap';
import PairSet from './PairSet';
import Cell from './Cell';

export default class Dstarlite {
    constructor(start, goal, heuristic) {
        this.Heap = new Heap();
        this.k_m = 0;
        this.rhs = new Map();
        this.gscore = new Map();
        this.heuristic = heuristic;
        this.start = start;
        this.goal = goal;
    }

    predeccesor; 

    initialize() {
        const grid = this.goal.grid.grid;
        for (const row of grid) {
            for (const column of row) {
                this.gscore.set(column, Infinity);
                this.rhs.set(column, Infinity);
            }
        }

        this.rhs.set(this.goal, 0);
        this.Heap.insert(this.goal, [this.heuristic(this.start, this.goal), 0]);
    }

    calculateKey(node) {
        const min = Math.min(this.gscore.get(node), this.rhs.get(node));
        return [
            min + this.heuristic(this.start, node) + this.k_m,
            min,
        ];
    }

    compareKeys(key1, key2) {
        if (key1[0] > key2[0] || (key1[0] === key2[0] && key1[1] > key2[1])) {
            return 1;
        }

        return -1;
    }

    updateVertex(node) {
        if (this.gscore.get(node) !== this.rhs.get(node)) {
            if (this.Heap.checkNode(node)) {
                this.Heap.setKey(node, this.calculateKey(node));
            } else {
                this.Heap.insert(node, this.calculateKey(node));
            }
        } else if (this.Heap.checkNode(node)) {
            this.Heap.remove(node);
        }
    }

    computeShortestPath() {
        let k_old = this.Heap.topKey();
        while (this.compareKeys(k_old, this.calculateKey(this.start)) < 0 || this.rhs.get(this.start) !== this.gscore.get(this.start)) {
            k_old = this.Heap.topKey();
            const u = this.Heap.extractRoot();
            if (this.compareKeys(k_old, this.calculateKey(u)) < 0) {
                this.Heap.insert(u, this.calculateKey(u));
            } else {
                const neighbors = u.getNeighbors();
                const urhs = this.rhs.get(u);
                if (this.gscore.get(u) > urhs) {
                    this.gscore.set(u, urhs);
                } else {
                    this.gscore.set(u, Infinity);
                    this.updateVertex(u);
                }
                for (const neighbor of neighbors) {
                    this.updateVertex(neighbor);
                }
            } 
        }
    }

    beginPathfinding() {
        console.log("Starting initialize")
        this.initialize();
        console.log("initialize complete")
        this.computeShortestPath();
        console.log("shortest path computed")
    }

    nextStep() {
        this.predeccesor = this.start;
        const successors = this.start.getNeighbors();
        this.start = null; 
        for (const successor of successors) {
            if (!this.start) {
                this.start = successor;
            } else if (this.heuristic(this.predeccesor, successor.node) + this.gscore(successor.node) < this.heuristic(this.predeccesor, this.start) + this.gscore(this.start)) {
                this.start = successor;
            }
        }
        return {x: this.start.x, y: this.start.y};
    }

    edgeCostEvaluation(u, v, changedCells) {
        const oldU = new Cell(u.x, u.y, u.grid);
        oldU.terrain = changedCells.get(u);
        let c_old;
        if (changedCells.has(v)) {
            const oldV = new Cell(v.x, v.y, v.grid);
            oldV.terrain = changedCells.get(v);
            c_old = Cell.calculateCost(oldU, oldV);
        } else {
            c_old = Cell.calculateCost(oldU, v);
        }
        if (c_old > Cell.calculateCost(u, v)) {
            if (u !== this.goal) {
                this.rhs.set(u, Math.min(this.rhs.get(u), Cell.calculateCost(u, v) + this.gscore.get(u)));
            }
        } else if (this.rhs.get(u) === c_old + this.gscore.get(u)) {
            if (u !== this.goal) {
                this.rhs.set(u, null);
                for (const successor of u.getNeighbors()) {
                    const successorCost = Cell.calculateCost(u, successor) + this.gscore.get(successor);
                    const currentRhs = this.rhs.get(u);
                    if (!currentRhs) {
                        this.rhs.set(u, successorCost);
                    } else if (currentRhs > successorCost) {
                        this.rhs.set(u, successorCost);
                    }
                }
            }
        }
    }

    updateCost(changedCells) {

        const nodeToEdgeCosts = new PairSet();

        for (const cell of changedCells) {
            const neighbors = cell.getNeighbors();
            for (const neighbor of neighbors) {
                if (!nodeToEdgeCosts.has(cell, neighbor)) {
                    this.edgeCostEvaluation(cell, neighbor, changedCells);
                    nodeToEdgeCosts.add(cell, neighbor);
                    this.updateVertex(cell);
                }
                if (!nodeToEdgeCosts.has(neighbor, cell)) {
                    this.edgeCostEvaluation(neighbor, cell, changedCells);
                    nodeToEdgeCosts.add(neighbor, cell);
                    this.updateVertex(neighbor);
                } 
            }
        }
        this.computeShortestPath();
    }
}