// -----------------------------------------------------------------------------
// MintCrate - MintMath
// A utility library for assorted mathematical functions
// -----------------------------------------------------------------------------

export let MintMath  = {};

MintMath.clamp = function(num, limitLower, limitUpper) {
  return Math.max(limitLower, Math.min(limitUpper, num));
};

MintMath.rad = function(degrees) {
  return degrees * (Math.PI / 180);
}

MintMath.deg = function(radians) {
  return radians * (180 / Math.PI);
}

MintMath.roundPrecise = function(num, numDecimalPlaces) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}