var stream = require('stream')

function CSV(options) {
  stream.Transform.call(this)
  this.blockValue = ''
  this.index = 0
  this.startString = false
  this.startBlock = false
  this.header = options ? options.header : []
  this.headerDisplay = options ? options.headerDisplay : []
  if (options && options.header) {
    var headerStr = this.initHeader()
    this.push(headerStr)
  }
}

CSV.prototype = Object.create(stream.Transform.prototype)

CSV.prototype._transform = function (chunk, encoding, done) {
  var str = chunk.toString()
  var i = 0
  var len = chunk.length
  for (; i < len; i++) {
    if (str[i] === '{' && !this.startString) {
      this.startBlock = true
    }
    if (str[i] === '}' && !this.startString) {
      this.startBlock = false
      this.blockValue += '}'
      var obj = this.parseObj(this.blockValue)
      if (this.header.length === 0) {
        var headerStr = this.parseHeader(obj)
        this.push(headerStr)
      }
      var csvStr = this.convert(obj)
      this.index++
      this.push(csvStr)
      this.blockValue = ''
    }
    if (str[i] === '"' && str[i - 1] !== '\\') {
      this.startString = !this.startString
    }
    if (this.startBlock) {
      this.blockValue += str[i]
    }
  }
  done()
}

CSV.prototype.convert = function (obj) {
  var i = 0
  var header = this.header
  var len = header.length
  var value = ''
  var values = []
  var key = ''
  for (; i < len; i++) {
    key = header[i]
    value = obj[key]
    if (typeof value == 'string') {
      if (~value.indexOf(',')) {
        value = '"' + value + '"'
      } else if (~value.indexOf('\n')) {
        value = value.replace(/\n/g, '')
      }
    }
    values.push(value || '')
  }
  var str = values.join(',') + '\n'
  this.emit('convert', str, this.index)
  return str
}

CSV.prototype.parseHeader = function (header) {
  for (var key in header) {
    this.header.push(key)
  }
  var str = this.header.join(',') + '\n'
  this.emit('header', str)
  return str
}

CSV.prototype.initHeader = function () {
  var str = this.headerDisplay.join(',') + '\n'
  this.emit('header', str)
  return str
}

CSV.prototype.parseObj = function (jsonStr) {
  try {
    var obj = JSON.parse(jsonStr)
  } catch(err) {
    this.emit('error', err)
  }
  this.emit('parse', obj, this.index)
  return obj
}

module.exports = CSV