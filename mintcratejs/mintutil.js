// -----------------------------------------------------------------------------
// MintCrate - MintUtil
// A utility library for assorted helper functions
// -----------------------------------------------------------------------------

export class MintUtil {
  static rgbToString(r, g, b, a = null) {
    if (a === null) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgb(${r}, ${g}, ${b}, ${a})`;
    }
  }
  
  static getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  static deleteInCollection(item, collection) {
    let found = false;
    
    // Check if the item is in the current collection and delete if found
    if (Array.isArray(collection)) {
      let index = collection.findIndex((val) => val === item);
      if (index !== -1) {
        collection.splice(index, 1);
        found = true;
      }
    } else {
      let key = this.getKeyByValue(collection, item);
      if (key) {
        delete collection[key];
        found = true;
      }
    }
    
    // If not, then enter into any sub-collections and search through them
    if (!found) {
      for (const subCollection of Object.values(collection)) {
        found = this.deleteInCollection(item, subCollection);
        
        if (found) {
          break;
        }
      }
    }
    
    return found;
  }
}