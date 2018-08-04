export default class PairSet {
    pairSetMap = new Map();

    add(a, b) {
        const value = this.pairSetMap.get(a);
        if (value) {
            value.add(b);
        } else {
            this.pairSetMap.set(a, new Set([b]));
        }
    }

    has(a, b) {
        const value = this.pairSetMap.get(a);
        return value && value.has(b);
    }
}