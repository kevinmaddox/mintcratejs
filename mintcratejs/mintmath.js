// -----------------------------------------------------------------------------
// MintCrate - MintMath
// A utility library for assorted mathematical functions
// -----------------------------------------------------------------------------

export class MintMath {
  constructor() {
    
  }
  
  static clamp(value, limitLower, limitUpper) {
    return Math.max(limitLower, Math.min(limitUpper, value))
  }
}