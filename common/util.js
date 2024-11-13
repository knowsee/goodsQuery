function qrScan(func, error) {
	const scanner = uni.requireNativePlugin('Ba-Scanner')
	var scanOption = {
		scanMode: 'defaultMode',
		scanResultImage: false
	}
	scanner.onScan({
		isContinuous: false,
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