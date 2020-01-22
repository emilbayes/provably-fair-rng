const sodium = require('sodium-universal')
const uniform = require('./unbiased-uniform')
const double = require('./unbiased-double')
const shuffle = require('./unbiased-shuffle')
const sample = require('./unbiased-sample')

module.exports = function (key, nonce) {
  var instance = sodium.crypto_stream_chacha20_xor_instance(nonce, key)

  function next (bytes, buf) {
    if (buf == null) buf = Buffer.alloc(bytes)
    else {
      buf = buf.subarray(0, bytes)
      buf.fill(0)
    }

    // Can be optimised if we export the proper function from sodium
    instance.update(buf, buf)
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

  return next
}

module.exports.NONCEBYTES = sodium.crypto_stream_NONCEBYTES
module.exports.KEYBYTES = sodium.crypto_stream_KEYBYTES
