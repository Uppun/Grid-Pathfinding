export default class Heap {
    heap = [];
    _nodeIndicies = new Map();

    getLength() {
        return this.heap.length;
    }

    extractRoot() {
        this.swap(0, this.heap.length - 1);

        const node = this.heap.pop();

        this._nodeIndicies.delete(node.node);
        this.minHeapify(0);

        return node; 
    }

    setFscore(node, key) {
        const nodeIndex = this._nodeIndicies.get(node);
        if (nodeIndex && nodeIndex !== 0) {
            this.heap[nodeIndex].f = key;
        }

        this.buildMinHeap();
    }

    minHeapify(position) {
        if (position >= this.heap.length) {
            return;
        }

        let smallest = position;
        const leftChild = 2 * position + 1;
        const rightChild = 2 * position + 2;
            
        if (leftChild <= this.heap.length - 1 && this.compare(this.heap[leftChild], this.heap[position]) < 0) {
            smallest = leftChild;
        }

        if (rightChild <= this.heap.length - 1 && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
            smallest = rightChild;
        }
            
        if (smallest !== position) {
            this.swap(position, smallest);
            this.minHeapify(smallest);
        }
        
    }

    buildMinHeap() { 
        const lastParent = Math.floor((this.heap.length - 2) / 2);

        for (let i = lastParent; i >= 0; i--) {
            this.minHeapify(i);
        }
    }

    heapCheck(length) {
        if (length > 0) {
            const position = Math.floor((length - 2) / 2);
            this.minHeapify(position);
            this.heapCheck(position);
        }
    }

    insert(node, f) {
        this.heap.push({node, f});
        this._nodeIndicies.set(node.node, this.heap.length - 1);
        this.heapCheck(this.heap.length - 1);
    }

    compare(a, b) {
        if (a && b) {
            return a.f - b.f;
        }

        return 0;
    }

    swap(a, b) {
        const temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
        this._nodeIndicies.set(this.heap[a].node, a);
        this._nodeIndicies.set(this.heap[b].node, b);
    }
}

