

# json-convert-csv

[![npm](https://img.shields.io/npm/v/json-convert-csv.svg?style=plastic)](https://www.npmjs.com/package/json-convert-csv)
[![GitHub stars](https://img.shields.io/github/stars/pengng/json-convert-csv.svg?style=plastic&label=Star)](https://github.com/pengng/json-convert-csv/stargazers)
[![label](https://img.shields.io/github/issues-raw/pengng/json-convert-csv/website.svg?style=plastic)](https://github.com/pengng/json-convert-csv/issues)

##### `json` convert to `csv` or `csv` convert to `json`.

#### `json ` 数据转换为 `csv` 表格。

```javascript
[
  {
    "name": "小白",
    "sex": "男",
    "age": "18",
    "tel": "1383794XXXX"
    "address": "广东省 广州市"
  },
  {
    "name": "小红",
    "sex": "女",
    "age": "14",
    "tel": "1337893XXXX",
    "address": "广东省 广州市"
  }
]
```

| 姓名   |  性别  |  年龄  | 电话          | 地址      |
| ---- | :--: | :--: | ----------- | ------- |
| 小白   |  男   |  18  | 1383794XXXX | 广东省 广州市 |
| 小红   |  女   |  14  | 1337893XXXX | 广东省 广州市 |

### Usage

```bash
npm install -S json-convert-csv
```

- `json` to `csv`

```javascript
const fs = require('fs')
const CSVStream = require('json-convert-csv').CSVStream
const csvSteam = new CSVStream()

const json = fs.createReadStream('path-to-json-file')
const csv = fs.createWriteStream('path-to-csv-file')

json.pipe(csvSteam).pipe(csv)
```

- `csv` to `json`

```javascript
const fs = require('fs')
const JSONStream = require('json-convert-csv').JSONStream
const jsonStream = new JSONStream()

const csv = fs.createReadStream('path-to-csv-file')
const JSONFile = fs.createWriteStream('new-path-to-json-file')

csv.pipe(jsonStream).pipe(JSONFile)
```

### Options

#### new CSVStream([options])

- `options` 配置对象
  - `header` \<string[]\> 数据的字段名。`['name', 'age', 'tel']`
  - `headerDisplay` \<string[]\> 数据的显示名称。`['姓名', '年龄', '电话']`

### Event

- [parse](#parse)
- [convert](#convert)
- [error](#error)

#### new JSONStream([options])

- `options` 配置对象
  - `fieldNames` \<string[]\> 字段名数组。
  - `lineEnding` \<RegExp\> 行结束符。默认为`/\n/` 。也可设置为 `/\r\n/`。
  - `separator` \<RegExp\> 分隔符。默认为 `/[,]/`。可设置为 `/\t/` 或 `/[ ]/` 。
  - `ignoreFirstLine` \<boolean\> 是否忽略首行。默认 `true` 。

### Event

- [line](#line) 当解析每一行时触发。

### parse

##### 参数

| 名称    | 类型     | 描述       |
| ----- | ------ | -------- |
| obj   | Object | 解析的每个对象  |
| index | Number | 第几个解析的对象 |

### convert

##### 参数

| 名称         | 类型     | 描述       |
| ---------- | ------ | -------- |
| convertStr | String | 格式化的字符串。 |
| index      | Number | 第几个解析的对象 |

### error

##### 参数

| 名称    | 类型    | 描述         |
| ----- | ----- | ---------- |
| error | Error | 转换过程出现的错误。 |

### line

##### 参数

| 名称   | 类型     | 描述             |
| ---- | ------ | -------------- |
| obj  | Object | csv 每一行触析出的对象。 |

### Simple

```javascript
const convert = new Csv({
  header: ['name', 'age', 'tel'],
  headerDisplay: ['姓名', '年龄', '电话']
})
/*
<<< Input JSON
[
  {
    "name": "小白",
    "age": "18",
    "tel": "1383794XXXX"
  },
  {
    "name": "小红",
    "age": "14",
    "tel": "1337893XXXX"
  }
]
>>> Output CSV
*/
```

| 姓名   | 年龄   | 电话          |
| ---- | ---- | ----------- |
| 小白   | 18   | 1383794XXXX |
| 小红   | 14   | 1337893XXXX |