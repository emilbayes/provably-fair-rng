const write = Buffer.alloc(8)
const read = new Float64Array(write.buffer)
//           s|exponent
write[7] = 0b00111111

module.exports = function (rng) {
  rng(7, write)
  //                 exponent|
  write[6] = write[6] | 0b11110000
  return read[0] - 1
}

module.exports.BASE = 10000000000000000000000000000000000000000000000000000n
module.exports.DISTANCE = 2220446049250313080847263336181640625n
module.exports.POINTS = 4503599627370496n // 2 ** 52 - 1 points and '0'
