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
				if (custom?.loading) {
					uni.hideLoading()
				}
				if (response.data.code !== 200) {
					return Promise.reject(response.data.msg, 'msg');
				}
				console.log(response.data);
				return response.data.data || null
			}, (response) => {
				return Promise.reject(response, 'error')
			})
			await uni.$uv.http.get('commodity/v1/config').then(res => {
				uni.setStorageSync('configApp', res);
			});
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