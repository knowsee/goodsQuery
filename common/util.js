function qrScan(func, error) {
	const scanner = uni.requireNativePlugin('Ba-Scanner')
	var scanOption = {
		scanMode: 'defaultMode',
		scanType: ["QR", "EAN-13", "EAN-8", "Code128"],
		scanResultImage: false
	}
	scanner.onScan({
		isContinuous: false,
		barcodeFormats: ["QR Code", "Code 128", "EAN-8", "EAN-13"],
		scanTimeSpace: 2000,
		isShowVibrate: true,
		isShowBeep: false,
		isShowToast: false,
	}, (ret) => {
		if (ret.result) {
			func(ret.result)
		}
	});
}

export {
	qrScan
}