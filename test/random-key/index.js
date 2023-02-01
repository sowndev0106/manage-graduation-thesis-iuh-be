const crypto = require('crypto')
const key1 = crypto.randomBytes(45).toString('base64')
const key2 = crypto.randomBytes(45).toString('base64')
console.table({key1, key2 })