const assert = require('nanoassert')
const uniform = require('./unbiased-uniform')

module.exports = function (rng, weights) {
  const max = weights.reduce((w, s) => w + s, 0)
  assert(max <= Number.MAX_SAFE_INTEGER, 'Sum of weights must be less than Number.MAX_SAFE_INTEGER')

  const r = uniform(rng, max)

  for (var i = 0, w = 0; i < weights.length; i++) {
    w += weights[i]
    if (r < w) return i
  }
}
