export default class MapWithDefault extends Map {
    constructor(defaultValue) {
      super();
      this._default = defaultValue;
    }
    
    get(key) {
      return this.has(key) ? super.get(key) : this._default;
    }
  }