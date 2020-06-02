# `provably-fair-rng`

> A provably fair RNG based on a stream cipher

## Usage

```js
var pfRng = require('provably-fair-rng')

// Key could come from a hash-chain
var key = Buffer.from('256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610', 'hex')
// Nonce could be something public, here the bitcoin block hash #611707
// Nonces are 24 bytes, hence we use the 24 low order bytes
var nonce = Buffer.from('0000000000000000000ea81bb2476eeb976af760d27217708a73889a95e1ea2d'.slice(-48), 'hex')

var rng = pfRng(key, nonce)

console.log(rng(8)) // 8 Random bytes
console.log(rng.bytes) // 8
console.log(rng.double()) // Random double. Consumes 7 bytes
console.log(rng.uniform(1001)) // Random integer between [0, 1000]. Consumes 7 bytes for each iteration
console.log(rng.bytes) // 8 + 7 + 7 = 22
console.log(rng.trails) // 3
console.log(rng.sample(3, 10)) // Return 3 integers in [0, 10)
console.log(rng.shuffle(['a', 'b', 'c'])) // Permute a, b, c
```

## API

### `const rng = pfRng(key, nonce)`

Create a new RNG from a `key` and a `nonce`, which must be `pfRng.KEYBYTES` and
`pfRng.NONCEBYTES` long respectively. Uses `chacha20` as the underlying primitive

Other options include:
  - `const rng = pfRng.xchacha(key, nonce)`
  - `const rng = pfRng.salsa(key, nonce)`
  - `const rng = pfRng.xsalsa(key, nonce)`

Each with associated constants on `pfRng.*.KEYBYTES` and `pfRng.*.NONCEBYTES`

### `const bytes = rng.bytes`

How many bytes have been read from the current instance

### `const trails = rng.trails`

How many times was a read call made from the instance

### `const buf = rng(bytes)`

Return a `Buffer` of `bytes` from the stream

### `const num = rng.double()`

Return a random double in the interval `[0, 1)`, which is unbiased, uniform and
equidistant. Consumes 7 bytes

### `const n = rng.uniform(max)`

Read a random integer uniformly and unbiased in the interval `[0, max)`.
Consumes 7 bytes for each trail, but may do multiple trails in a single call
due to rejection sampling

### `const xs = rng.sample(n, p)`

Pick `n` unique, random integers from the interval `[0, p)` which can be used as
indexes into another table. Uses rejection sampling multiple times so the above
note from `rng.uniform` applies

### `const arr = rng.shuffle(arr)`

Unbiased shuffle (Fisher-Yates/Knuth) of `arr`. Note that this mutates `arr` and
returns it (for convenience). Uses rejection sampling multiple times so the
above note from `rng.uniform` applies

### `const idx = rng.weighted(weights)`

Samples an index from `weights`, which are decimal proportions.
Samples a single double from `rng.double` above

### `const idx = rng.weightedIntegers(weights)`

Samples an index from `weights`, which are integer proportions.
Uses rejection sampling once so the above note from `rng.uniform` applies

## Install

```sh
npm install provably-fair-rng
```

## License

[ISC](LICENSE)
