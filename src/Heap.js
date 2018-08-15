export default class Heap {
    heap = [];
    _nodeIndices = new Map();

    get length() {
        return this.heap.length;
    }
    
    checkNode(node) {
        return this._nodeIndices.has(node);
    }

    pop() {
        const root = this.top();
        this.remove(root.node);
        return root;
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

    filterUp(index) {
        let parent = index;
        while(parent > 0) {
            parent = Math.floor((parent - 1) / 2);
            if (this.compare(index, parent) < 0) {
                this.swap(index, parent);
                index = parent;
            } else {
                break;
            }
        }
    }

    minHeapify(position) {
        if (position >= this.heap.length) {
            return;
        }

        let smallest = position;
        const leftChild = 2 * position + 1;
        const rightChild = 2 * position + 2;
        if (leftChild < this.heap.length && this.compare(leftChild, smallest) < 0) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.compare(rightChild, smallest) < 0) {
            smallest = rightChild;
        }
            
        if (smallest !== position) {
            this.swap(position, smallest);
            this.minHeapify(smallest);
        }
        
    }

    buildMinHeap() { 
        const lastParent = Math.floor((this.heap.length - 1) / 2);

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
        this.filterUp(this.heap.length - 1);
    }

    compare(a, b) {
        const aKey = this.heap[a].key;
        const bKey = this.heap[b].key;
        if (Array.isArray(aKey) && Array.isArray(bKey)) {
            if (aKey[0] === bKey[0]) {
                return aKey[1] - bKey[1];
            }
            return aKey[0] - bKey[0];
        }
        return aKey - bKey;
    }

    remove(node) {
        const index = this._nodeIndices.get(node);
        if (index == null) {
            return;
        }

        const lastIndex = this.heap.length - 1;

        this.swap(index, lastIndex);
        console.log(this.heap)
        const item = this.heap.pop();
        this._nodeIndices.delete(item.node);
        console.log('removed')
        console.log(item.node)
        console.log(this.heap[0])

        if (index === lastIndex) {
            return;
        }

        const parentIndex = Math.floor((index - 1) / 2);
        if (index === 0 || this.compare(parentIndex, index) < 0) {
            this.minHeapify(index);
        } else {
            this.filterUp(index);
        }
    }

    swap(a, b) {
        if (a === b) {
            return;
        }
        const temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
        this._nodeIndices.set(this.heap[a].node, a);
        this._nodeIndices.set(this.heap[b].node, b);
    }
}

