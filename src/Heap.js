export default class Heap {
    heap = [];
    _nodeToIndexMap = new Map();

    extractRoot(){
        this.swap(0, this.heap.length - 1);

        const node = this.heap.pop();

        this._nodeToIndexMap.delete(node.node);
        this.minHeapify(0);

        return node; 
    }

    setFscore(node, fScore) {
        const nodeIndex = this._nodeToIndexMap.get(node);
        if (nodeIndex) {
            this.heap[nodeIndex].f = fScore;
        }

        this.buildMinHeap();
    }

    minHeapify(position) {
        if (position < this.heap.length) {
            let smallest = position;
            const leftChild = 2 * position + 1;
            const rightChild = 2 * position + 2;
            
            if (leftChild <= this.heap.length - 1 && this.fCompare(this.heap[leftChild], this.heap[position]) < 0) {
                smallest = leftChild;
            }

            if (rightChild <= this.heap.length - 1 && this.fCompare(this.heap[rightChild], this.heap[smallest]) <  0) {
                smallest = rightChild;
            }
            
            if (smallest !== position) {
                this.swap(position, smallest);
                this.minHeapify(smallest);
            }
        }
    }

    buildMinHeap() { 
        const lastParent = Math.floor((this.heap.length - 2) / 2);

        for(let i = lastParent; i >= 0; i--) {
            this.minHeapify(i);
        }
    }

    pushNode(length) {
        if (length > 0) {
            const position = Math.floor((length-2)/2);
            this.minHeapify(position);
            this.pushNode(position);
        }
    }

    insert(node) {
        this.heap.push(node);
        this._nodeToIndexMap.set(node.node, this.heap.length - 1);
        this.pushNode(this.heap.length - 1);
    }

    fCompare(a,b) {
        if(a && b) {
            if (a.f < b.f) {
                return -1;
            }
            if (a.f > b.f) {
                return 1;
            }
        }

        return 0;
    }

    swap(a, b) {
        const temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
        this._nodeToIndexMap.set(this.heap[a].node, a);
        this._nodeToIndexMap.set(this.heap[b].node, b);
    }
}

