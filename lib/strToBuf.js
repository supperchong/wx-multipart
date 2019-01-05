let strToBuf = function(utf16Str) {
	let utf8Arr = []
	let byteSize = 0
	for (let i = 0; i < utf16Str.length; i++) {
		let code = utf16Str.charCodeAt(i)

		if (code >= 0x00 && code <= 0x7f) {
			byteSize += 1
			utf8Arr.push(code)
		} else if (code >= 0x80 && code <= 0x7ff) {
			byteSize += 2
			utf8Arr.push(192 | (31 & (code >> 6)))
			utf8Arr.push(128 | (63 & code))
		} else if (
			(code >= 0x800 && code <= 0xd7ff) ||
            (code >= 0xe000 && code <= 0xffff)
		) {
			byteSize += 3
			utf8Arr.push(224 | (15 & (code >> 12)))
			utf8Arr.push(128 | (63 & (code >> 6)))
			utf8Arr.push(128 | (63 & code))
		} else if (code >= 0x10000 && code <= 0x10ffff) {
			byteSize += 4
			utf8Arr.push(240 | (7 & (code >> 18)))
			utf8Arr.push(128 | (63 & (code >> 12)))
			utf8Arr.push(128 | (63 & (code >> 6)))
			utf8Arr.push(128 | (63 & code))
		}
	}
	let arrayBuf = new ArrayBuffer(utf8Arr.length)
	let buf = new Uint8Array(arrayBuf)
	for (let i = 0; i < utf8Arr.length; i++) {
		buf[i] = utf8Arr[i]
	}
	return buf
}

module.exports = strToBuf
