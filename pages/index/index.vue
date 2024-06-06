<template>
	<view style="margin: 10px">
		<uv-search inputAlign="center" height="40" actionText="扫一扫" @search="search" @custom="barCode"></uv-search>
	</view>
	
	<uv-line color="#2979ff"></uv-line>

	<view>
		<uv-grid :border="false">
			<uv-grid-item v-for="(item,index) in baseList" :key="index">
				<uv-icon :customStyle="{paddingTop:20+'rpx'}" :name="item.name" :size="22"></uv-icon>
				<text class="grid-text">{{item.title}}</text>
			</uv-grid-item>
		</uv-grid>
	</view>
</template>

<script>
	import * as util from '@/common/util.js'
	export default {
		data() {
			return {
				baseList: [{
					name: 'photo',
					title: '李白'
				}, {
					name: 'lock',
					title: '韩信'
				}, {
					name: 'star',
					title: '刘备'
				}]
			}
		},
		onLoad() {

		},
		methods: {
			search(value) {
				console.log('value', value)
				let params = {
					page: 1,
					limit: 100,
					ch_name:value,
					en_name:'',
					gtin:''
				}
				uni.$uv.http.get('commodity/v1/likes/goods', {params: params, custom: {loading: true}}).then(res => {
					if(res.list.length > 0) {
						uni.navigateTo({
							url: '/pages/list/result'
						});
						console.log(res.list)
						uni.$emit('searchData',{data: res.list});
					} else {
						console.log('fail')
					}
				})
			},
			barCode(value) {
				
			}
		}
	}
</script>

<style>
	
</style>