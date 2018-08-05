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
        if (key1[0] === key2[0] && key1[1] === key2[1]) {
            return 0;
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
        while (this.compareKeys(this.calculateKey(this.start), this.Heap.topKey()) > 0 || this.rhs.get(this.start) > this.gscore.get(this.start)) {
            const u = this.Heap.top().node;
            const k_old = this.Heap.topKey();
            const k_new = this.calculateKey(u);
            if (this.compareKeys(k_old, k_new) < 0) {
                this.Heap.setKey(u, k_new);
            } else if (this.gscore.get(u) > this.rhs.get(u)) {
                this.gscore.set(u, this.rhs.get(u));
                this.Heap.remove(u);
                const predeccesors = u.getNeighbors();
                for (const predeccesor of predeccesors) {
                    if (predeccesor.node !== this.goal) {
                        this.rhs.set(predeccesor.node, Math.min(this.rhs.get(predeccesor.node), this.heuristic(predeccesor.node, u) + this.gscore.get(u)));
                    }
                    this.updateVertex(predeccesor.node);
                }
            } else {
                const g_old = this.gscore.get(u);
                this.gscore.set(u, Infinity);
                const predeccesors = u.getNeighbors();
                predeccesors.push({node: u});
                for (const {node: predeccesor} of predeccesors) {
                    const cost = predeccesor !== u ? Cell.calculateCost(predeccesor, u) : 0;
                    if (this.rhs.get(predeccesor) === cost + g_old) {
                        if (predeccesor === this.goal) {
                            continue;
                        }
                        let bestSuccessor;
                        let minRhs = Infinity;
                        for (const {node: successor} of predeccesor.getNeighbors()) {
                            const rhs = Cell.calculateCost(predeccesor, successor) + this.gscore.get(successor);
                            if (rhs < minRhs) {
                                bestSuccessor = successor;
                                minRhs = rhs;
                            }
                        }
                        if (bestSuccessor == null) {
                            throw new Error('???');
                        }
                        this.rhs.set(predeccesor, minRhs);
                    }
                    this.updateVertex(predeccesor);
                }
            } 
        }
    }

    beginPathfinding() {
        this.initialize();
        this.computeShortestPath();
    }

    nextStep() {
        this.predeccesor = this.start;
        const successors = this.start.getNeighbors();
        this.start = null; 
        for (const successor of successors) {
            if (!this.start) {
                this.start = successor.node;
            } else if (this.heuristic(this.predeccesor, successor.node) + this.gscore.get(successor.node) < this.heuristic(this.predeccesor, this.start) + this.gscore.get(this.start)) {
                this.start = successor.node;
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
                    const successorCost = Cell.calculateCost(u, successor.node) + this.gscore.get(successor.node);
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

        this.km += this.heuristic(this.predeccesor, this.start);
        this.predeccesor = this.start;
        for (const [cell, oldTerrain] of changedCells) {
            const neighbors = cell.getNeighbors();
            for (const neighbor of neighbors) {
                if (!nodeToEdgeCosts.has(cell, neighbor.node)) {
                    this.edgeCostEvaluation(cell, neighbor.node, changedCells);
                    nodeToEdgeCosts.add(cell, neighbor.node);
                    this.updateVertex(cell);
                }
                if (!nodeToEdgeCosts.has(neighbor.node, cell)) {
                    this.edgeCostEvaluation(neighbor.node, cell, changedCells);
                    nodeToEdgeCosts.add(neighbor.node, cell);
                    this.updateVertex(neighbor.node);
                } 
            }
        }
        this.computeShortestPath();
    }
}