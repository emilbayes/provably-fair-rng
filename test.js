var HashChain = require('hash-chain')

var nonce = Buffer.from('0000000000000000000ea81bb2476eeb976af760d27217708a73889a95e1ea2d'.slice(-48), 'hex')
const seed = Buffer.from('a7ef01a27343cc545f366cbb62db523d02c2f2eab316f51f87524bfc6886e6e3', 'hex')

const ch = HashChain.generate(seed, 10)

var rng = require('.')

for (const key of ch) {
  var n = rng(key, nonce)

  console.log(n(10))
  console.log(n.uniform(Number.MAX_SAFE_INTEGER))
  console.log(n.double())
  console.log(n.sample(5, 10))
  console.log(n.bytes)
  console.log(n.trails)
}
