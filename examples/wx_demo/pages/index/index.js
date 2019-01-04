//index.js
//获取应用实例
/*global Page,getApp,wx*/
const app = getApp()
import { regeneratorRuntime } from '../../utils/runtime.js'
const Multipart = require('../../utils/Multipart.min.js')

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		files:[],
		hasUserInfo: false,
		videoCount:0
	},
	chooseImage: function (e) {
		var that = this
		wx.chooseImage({
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				let tempFiles = res.tempFilePaths.map(tempPath=>({
					filePath: tempPath
				}))
				that.setData({
					files: that.data.files.concat(tempFiles)
				})
			}
		})
	},
	formSubmit(e){
		let body=e.detail.value
		let fields = Object.keys(body).map(key => ({
			name: key,
			value: body[key]
		}))
		let files = this.data.files
		console.log(files)
		new Multipart({
			files,
			fields
		}).submit('http://localhost:3000/upload')
	},
	onLoad: function () {
    
	},
})
