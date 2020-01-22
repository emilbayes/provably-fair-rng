var assert = require('nanoassert')

var buf = new Uint8Array(7)
var MAX = Number.MAX_SAFE_INTEGER
module.exports = function secureRandom (rng, limit) {
  assert.ok(Number.isInteger(limit), 'limit must be integer')
  assert.ok(limit > 0, 'limit must be larger than 0')
  assert.ok(limit <= MAX, 'limit must be at most 2^53 - 1')

  // Edge cases:
  // 1: MAX is divisible by limit
  // 2: limit > MAX / 2
  var min = MAX - (MAX % limit)

  var n = 0
  do {
    rng(7, buf)
    // Returns number in [0, 2^53)
    n = ((((buf[6] & 0b00011111) << 16) | (buf[5] << 8) | (buf[4])) >>> 0) * 0x100000000 // 21 bits, shifted left 32 bits
              + (((buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | (buf[0])) >>> 0) // 32 bits
  } while (n >= min)

  return n % limit
}
