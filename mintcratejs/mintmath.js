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

// Inclusive
MintMath.randomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

MintMath.midpoint = function(x1, y1, x2, y2) {
  // Calculate midpoint and result result
  return {
    x: ((x1 + x2) / 2),
    y: ((y1 + y2) / 2)
  };
}