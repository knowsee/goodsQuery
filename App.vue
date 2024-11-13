<script>
	export default {
		onLaunch: async function() {
			uni.$uv.http.setConfig((config) => {
				/* config 为默认全局配置*/
				config.baseURL = `https://upc-api.ckc.im/`;
				config.dataType = 'json';
				return config
			})
			uni.$uv.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
				console.log('config', config)
				//config.data = config.data || {}
				if (config?.custom?.loading) {
					uni.showLoading({
						title: 'Loading...'
					})
				}
				return config
			}, config => { // 可使用async await 做异步操作
				return Promise.reject(config)
			})
			uni.$uv.http.interceptors.response.use((response) => {
				const custom = response.config?.custom;
				if (custom.loading) {
					uni.hideLoading()
				}
				if (response.data.code !== 200) {
					return Promise.reject(response.data.msg, 'msg');
				}
				return response.data.data || null
			}, (response) => {
				return Promise.reject(response, 'error')
			})
			let cache = {};
			await uni.$uv.http.get('commodity/v1/config').then(res => {
				cache.cate = res.cate
			});
			await uni.$uv.http.get('commodity/app/shop/list', {params: {page:1,limit:200}}).then(res => {
				cache.shop = res
			});
			uni.setStorageSync('configApp', cache);
			let system = uni.getSystemInfoSync();
			this.globalData.autoWidthCol = Number(system.screenWidth/400).toFixed(0);
			this.globalData.moduleType = system.model;
			this.globalData.statusBarHeight = system.statusBarHeight;
			this.globalData.windowsHeight = system.screenHeight;
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	.paddingView {
		padding: 10px;
	}
</style>