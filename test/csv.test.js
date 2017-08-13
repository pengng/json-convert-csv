var fs = require('fs')
var path = require('path')
var CSV = require('../lib/csv')
var csv = new CSV({
  header: ['name', 'age'],
  headerDisplay: ['姓名', '年龄']
})

fs.createReadStream(path.join(__dirname, '/testData.json'))
  .on('error', console.error)
  .pipe(csv)
  .pipe(fs.createWriteStream(path.join(__dirname, '/testData.csv')))