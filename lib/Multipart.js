const LINE_BREAK = '\r\n'
const mime = require('mime-types')
const { regeneratorRuntime } = require('./runtime')
const stringToBuffer = require('./strToBuf')

/*global wx */
const FileSystemManager = wx.getFileSystemManager()
class Multipart {
	/**
   *
   * @param {object} [config]
   * @param {object[]} config.fields 表单字段
   * @param {object[]} config.files 文件路径集合
   * @example
   * new Multipart({
   *  fields:[{
   *      name:'password',
   *      value:'123456'
   *  }],
   *  files:[{
   *      filePath:'http://example.png'
   *  }]
   * })
   */
	constructor(config) {
		this.config = config || {}
	}
	field(field) {
		this.config.fields.push(field)
	}
	/**
   *
   * @param {object} file
   * @param {string} file.filePath 文件路径
   * @param {string} file.filename 文件名
   * @param {string} file.name 字段名
   */
	file(file) {
		this.config.files.push(file)
	}
	append() {}
	/**
   * 表单提交
   * @param {string} url
   */
	async submit(url) {
		url = url || this.config.url
		if (!url) {
			return Promise.reject('请输入url')
		}
		let buf = await this.convertToBuffer()
		return new Promise((resolve, reject) => {
			wx.request({
				url,
				data: buf,
				header: {
					'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
				},
				method: 'post',
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err)
				}
			})
		})
	}
	/**
   * 将表单字段和文件路径转化为arrayBuffer数据
   * @return {ArrayBuffer}
   */
	async convertToBuffer() {
		let buffers = []
		let data = ''
		let { fields, files } = this.config
		for (let i = 0; i < fields.length; i++) {
			let { name, value } = fields[i]
			data += `${this._getMultiPartHeader()}Content-Disposition:form-data;name="${name}"${LINE_BREAK}${LINE_BREAK}`
			data += `${value}${LINE_BREAK}`
		}
		let fieldbuf = stringToBuffer(data)
		buffers.push(fieldbuf)
		for (let j = 0; j < files.length; j++) {
			let { filePath, value, filename, name } = files[j]
			let contentType = mime.lookup(filePath || filename)
			if (!filename) {
				let matchArr = filePath.match(/(?:(?!\/).)*$/)
				if (!matchArr) {
					filename = ''
				} else {
					filename = matchArr[0]
				}
			}
			let header = `${this._getMultiPartHeader()}Content-Disposition:form-data;name="${name}";filename="${filename}"${LINE_BREAK}`
			header += `Content-Type: ${contentType}${LINE_BREAK}${LINE_BREAK}`
			buffers.push(stringToBuffer(header))

			let fileBuf = await this._getFile(filePath)
			buffers.push(new Uint8Array(fileBuf))
			buffers.push(stringToBuffer(LINE_BREAK))
		}
		buffers.push(stringToBuffer(this._getLastMultiPart()))
		let len = buffers.reduce((prev, cur) => {
			return prev + cur.length
		}, 0)
		let arrayBuffer = new ArrayBuffer(len)
		let buffer = new Uint8Array(arrayBuffer)
		let sum = 0
		for (let i = 0; i < buffers.length; i++) {
			for (let j = 0; j < buffers[i].length; j++) {
				buffer[sum + j] = buffers[i][j]
			}
			sum += buffers[i].length
		}
		return arrayBuffer
	}
	_getMultiPartHeader() {
		return '--' + this.getBoundary() + LINE_BREAK
	}
	_getLastMultiPart() {
		return '--' + this.getBoundary() + '--' + LINE_BREAK
	}
	_getFile(filePath) {
		return new Promise((resolve, reject) => {
			FileSystemManager.readFile({
				filePath,
				success(res) {
					resolve(res.data)
				},
				fail(err) {
					reject(err)
				}
			})
		})
	}

	_generateBoundary() {
		var boundary = '------'
		for (var i = 0; i < 24; i++) {
			boundary += Math.floor(Math.random() * 10).toString(16)
		}

		this._boundary = boundary
	}
	getBoundary() {
		if (!this._boundary) {
			this._generateBoundary()
		}

		return this._boundary
	}
	_lastBoundary() {
		return '--' + this.getBoundary() + '--' + LINE_BREAK
	}
}
module.exports = Multipart
