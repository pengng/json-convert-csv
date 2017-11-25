const Transform = require('stream').Transform

const JSONStream = function (options) {
  if (!(this instanceof JSONStream)) {
    return new JSONStream(options)
  }
  Transform.call(this)
  options = options || {}
  this.value = ''
  this.isQuotaOdd = false // 当前是否双引号打开状态
  this.lineCount = 0 // 当前行
  this.ignoreFirstLine = options.ignoreFirstLine || true
  this.fieldNames = options.fieldNames || []
  this.lineEnding = options.lineEnding || /\n/ // 换行符
  this.separator = options.separator || /[,]/ // 分隔符
  this.lineValue = []
  this.result = []
}

const proto = JSONStream.prototype = Object.create(Transform.prototype, {
  constructor: JSONStream
})

proto._transform = function (chunk, encoding, callback) {
  chunk = chunk.toString()
  for (let i = 0, len = chunk.length; i < len; i++) {
    const byte = chunk[i]
    const preByte = chunk[i - 1]
    const nextByte = chunk[i + 1]
    if (byte === '"' && (preByte !== '"' || nextByte !== '"')) {
      this.isQuotaOdd = !this.isQuotaOdd
    } else if (this.separator.test(byte) && !this.isQuotaOdd) {
      this.lineValue.push(this.value)
      this.value = ''
    } else if (this.lineEnding.test(byte)) {
      this.lineValue.push(this.value)
      this.value = ''
      this.lineCount++
      this.createObj()
    } else {
      this.value += byte
    }
  }
  callback()
}

proto._flush = function (callback) {
  this.push(']')
  callback()
}

proto.createObj = function () {
  let data = {}
  if (this.fieldNames.length === 0) {
    data = this.lineValue.concat()
  } else {
    for (let i = 0, len = this.fieldNames.length; i < len; i++) {
      data[this.fieldNames[i]] = this.lineValue[i]
    }
  }
  this.lineValue.length = 0
  if (this.ignoreFirstLine && this.lineCount === 1) {
    return
  }
  // 如果是第一段json的话在开头填充“[“，否则填充”，“。
  if (this.result.length === 0) {
    this.push('[')
  } else {
    this.push(',')
  }
  this.push(JSON.stringify(data))
  this.result.push(data)
  this.emit('line', data)
}

module.exports = JSONStream