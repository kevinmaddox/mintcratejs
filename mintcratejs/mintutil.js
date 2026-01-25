// -----------------------------------------------------------------------------
// MintCrate - MintUtil
// A utility library for assorted helper functions
// -----------------------------------------------------------------------------

export class MintUtil {
  constructor() {
    
  }
  
  static rgbToString(r, g, b, a = null) {
    if (a === null) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgb(${r}, ${g}, ${b}, ${a})`;
    }
  }
}