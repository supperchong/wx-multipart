# Summary
小程序官方提供的api wx.uploadFile一次只能上传一个文件，Multipart实现了一般的表单上传，无文件数量限制

# Usage
1. 直接传递给构造函数
```js
const Multipart=require('wx-multipart')
const fields=[{
  name:'username',
  value:'小黄'
},{
  name:'number',
  value:'13812345678'
}]
const files=[{
  filePath:'http://example.png'
}]
new Multipart({
  fields,
  files
}).submit('http://localhost:3000/upload')
```
2. 单个字段和文件添加
```js
const Multipart=require('wx-multipart')
let m=new Multipart()
m.field({
  name:'username',
  value:'小黄'
})
m.files({
  filePath:'http://example.png'
})
m.files({
  filePath:'http://example2.png'
})
m.submit('http://localhost:3000/upload')
```
# detail

## Syntax
```
new Multipart(config)
```

## Multipart Instances

### Methods
* Multipart.prototype.field(field)  
    增加表单字段
* Multipart.prototype.file(file)  
    增加文件
* Multipart.prototype.submit(url)  
    上传表单

# Demo
examples文件夹下有两个目录
* backend  
后端
* wx_demo  
小程序

1. 运行后端
```js
npm i
npm run build 
npm run test
```

2. 测试小程序
用微信开发者工具打开wx_demo,提交表单后，上传的文件保存在./examples/tempFiles