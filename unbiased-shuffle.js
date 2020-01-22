var uniform = require('./unbiased-uniform')

module.exports = function (rng, arr) {
  var N = arr.length
  for (var i = 0; i < N - 1; i++) {
    var j = uniform(rng, N - i) + i
    var tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }

  return arr
}
