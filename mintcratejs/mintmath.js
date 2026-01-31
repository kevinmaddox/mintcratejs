// -----------------------------------------------------------------------------
// MintCrate - MintMath
// A utility library for assorted mathematical functions
// -----------------------------------------------------------------------------

export let MintMath  = {};

MintMath.clamp = function(value, limitLower, limitUpper) {
  return Math.max(limitLower, Math.min(limitUpper, value));
};

MintMath.rad = function(degrees) {
  return degrees * (Math.PI / 180);
}