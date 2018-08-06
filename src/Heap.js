export default class Heap {
    heap = [];
    _nodeIndices = new Map();

    get length() {
        return this.heap.length;
    }
    
    checkNode(node) {
        return this._nodeIndices.has(node);
    }

    extractRoot() {
        this.swap(0, this.heap.length - 1);

        const node = this.heap.pop();

        this._nodeIndices.delete(node);
        this.minHeapify(0);

        return node; 
    }

    top() {
        return this.heap[0];
    }

    topKey() {
        if (this.heap.length > 0) {
            return this.heap[0].key;
        }

        return [Infinity, Infinity];
    }

    setKey(node, key) {
        const nodeIndex = this._nodeIndices.get(node);
        if (nodeIndex != null) {
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
            
        if (leftChild < this.heap.length && this.compare(this.heap[leftChild].key, this.heap[position].key) < 0) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.compare(this.heap[rightChild].key, this.heap[smallest].key) < 0) {
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
        while (position > 0) {
            position = Math.floor((position - 1) / 2);
            this.minHeapify(position);
        }
    }

    insert(node, key) {
        this.heap.push({node, key});
        this._nodeIndices.set(node, this.heap.length - 1);
        this.checkHeap(this.heap.length - 1);
    }

    compare(a, b) {
        if (a && b) {
            if (Array.isArray(a) && Array.isArray(b)) {
                if (a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) {
                    return 1;
                }

                return -1;
            }

            return a - b;
        }

        return 0;
    }

    remove(node) {
        const index = this._nodeIndices.get(node);
        if (index == null) {
            return;
        }
        if (index === this.heap.length - 1) {
            this._nodeIndices.delete(this.heap.pop().node);
            return;
        }

        const lastElement = this.heap.pop();
        this._nodeIndices.set(lastElement.node, index);
        this._nodeIndices.delete(this.heap[index].node)
        this.heap[index] = lastElement;
        this.checkHeap(this.heap.length - 1);
    }

    swap(a, b) {
        const temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
        this._nodeIndices.set(this.heap[a].node, a);
        this._nodeIndices.set(this.heap[b].node, b);
    }
}

