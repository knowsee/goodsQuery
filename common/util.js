function qrScan(func, error) {
	const hwscan = uni.requireNativePlugin('LY-HWScan');
	var scanOption = {
		scanMode: 'defaultMode',
		scanType: ["QR", "EAN-13", "EAN-8", "Code128"],
		scanResultImage: false
	}
	hwscan.hwScan({
		scanOptions: scanOption
	}, (res) => {
		if (res.result !== undefined) {
			func(res.result);
		} else {
			error();
		}
	});
}

export {
	qrScan
}
