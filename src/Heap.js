export default class Heap {
    heap = [];
    _nodeIndices = new Map();

    get length() {
        return this.heap.length;
    }

    extractRoot() {
        this.swap(0, this.heap.length - 1);

        const node = this.heap.pop();

        this._nodeIndices.delete(node.node);
        this.minHeapify(0);

        return node; 
    }

    setKey(node, key) {
        const nodeIndex = this._nodeIndices.get(node);
        if (nodeIndex !== null) {
            this.heap[nodeIndex].key = key;
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
            
        if (leftChild < this.heap.length && this.compare(this.heap[leftChild], this.heap[position]) < 0) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
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

    checkHeap(position) {
        while (position> 0) {
            position = Math.floor((position - 2) / 2);
            this.minHeapify(position);
        }
    }

    insert(node, key) {
        this.heap.push({node, key});
        this._nodeIndices.set(node.node, this.heap.length - 1);
        this.checkHeap(this.heap.length - 1);
    }

    compare(a, b) {
        if (a && b) {
            return a.key - b.key;
        }

        return 0;
    }

    swap(a, b) {
        const temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
        this._nodeIndices.set(this.heap[a].node, a);
        this._nodeIndices.set(this.heap[b].node, b);
    }
}

