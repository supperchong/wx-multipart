const formidable = require('formidable'),
	http = require('http'),
	util = require('util'),
	path = require('path'),
	fs=require('fs')
const uploadDir=path.resolve(__dirname,'../tempFiles')
try {
	fs.mkdirSync(uploadDir)
} catch (err) {
	if (err.code === 'EEXIST') console.log('uploadDir has existed')
	else console.log(err)
}
http
	.createServer(function(req, res) {
		if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
			// parse a file upload
			let form = new formidable.IncomingForm()
			form.uploadDir =uploadDir 
			form.type=true
			form.keepExtensions = true
			form.parse(req, function(err, fields, files) {
				if(err) console.log(err)
				res.writeHead(200, { 'content-type': 'text/plain' })
				res.write('received upload:\n\n')
				res.end(util.inspect({ fields: fields, files: files }))
			})

			return
		}

		res.writeHead(200)
		res.end(
			'<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
		)
	})
	.listen(3000)
