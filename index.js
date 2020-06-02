const sodium = require('sodium-native')
const uniform = require('./unbiased-uniform')
const double = require('./unbiased-double')
const shuffle = require('./unbiased-shuffle')
const sample = require('./unbiased-sample')
const weighted = require('./unbiased-weighted-sample')
const weightedInteger = require('./unbiased-weighted-sample-integer')

console.log(sodium.crypto_stream_chacha20_xor_update)

module.exports = function (key, nonce) {
  var state = Buffer.alloc(sodium.crypto_stream_chacha20_xor_STATEBYTES)
  sodium.crypto_stream_chacha20_xor_init(state, nonce, key)
  return create(sodium.crypto_stream_chacha20_xor_update, state, key, nonce)
}

module.exports.xchacha = function (key, nonce) {
  var state = Buffer.alloc(sodium.crypto_stream_xchacha20_xor_STATEBYTES)
  sodium.crypto_stream_xchacha20_xor_init(state, nonce, key)
  return create(sodium.crypto_stream_xchacha20_xor_update, state, key, nonce)
}

module.exports.salsa = function (key, nonce) {
  var state = Buffer.alloc(sodium.crypto_stream_salsa20_xor_STATEBYTES)
  sodium.crypto_stream_salsa20_xor_init(state, nonce, key)
  return create(sodium.crypto_stream_salsa20_xor_update, state, key, nonce)
}

module.exports.xsalsa = function (key, nonce) {
  var state = Buffer.alloc(sodium.crypto_stream_xsalsa20_xor_STATEBYTES)
  sodium.crypto_stream_xsalsa20_xor_init(state, nonce, key)
  return create(sodium.crypto_stream_xsalsa20_xor_update, state, key, nonce)
}

function create (method, state, key, nonce) {
  function next (bytes, buf) {
    if (buf == null) buf = Buffer.alloc(bytes)
    else {
      buf = buf.subarray(0, bytes)
      buf.fill(0)
    }

    // Can be optimised if we export the proper function from sodium
    method(state, buf, buf)
    next.bytes += bytes
    next.trails++

    return buf
  }
  next.bytes = 0
  next.trails = 0

  next.uniform = uniform.bind(null, next)
  next.double = double.bind(null, next)
  next.shuffle = shuffle.bind(null, next)
  next.sample = sample.bind(null, next)
  next.weighted = weighted.bind(null, next)
  next.weightedInteger = weightedInteger.bind(null, next)

  return next
}

module.exports.NONCEBYTES = sodium.crypto_stream_chacha20_NONCEBYTES
module.exports.KEYBYTES = sodium.crypto_stream_chacha20_KEYBYTES

module.exports.xchacha.NONCEBYTES = sodium.crypto_stream_xchacha20_NONCEBYTES
module.exports.xchacha.KEYBYTES = sodium.crypto_stream_xchacha20_KEYBYTES

module.exports.salsa.NONCEBYTES = sodium.crypto_stream_salsa20_NONCEBYTES
module.exports.salsa.KEYBYTES = sodium.crypto_stream_salsa20_KEYBYTES

module.exports.xsalsa.NONCEBYTES = sodium.crypto_stream_xsalsa20_NONCEBYTES
module.exports.xsalsa.KEYBYTES = sodium.crypto_stream_xsalsa20_KEYBYTES
