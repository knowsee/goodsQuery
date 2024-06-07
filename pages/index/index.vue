<template>
	<view style="margin: 10px">
		<uv-search inputAlign="center" height="40" actionText="扫一扫" @search="search" @custom="barCode"></uv-search>
	</view>

	<uv-line color="#2979ff"></uv-line>

	<view>
		<uv-grid :border="true" col="4">
			<uv-grid-item v-for="(item, index) in cateList" :key="index" @click="goCateList(item.id)"
				style="height: 50px;">
				<text class="grid-text">{{ item.name }}</text>
			</uv-grid-item>
		</uv-grid>
	</view>
	<uv-line color="#2979ff"></uv-line>

	<view class="waterfall">
		<uv-waterfall ref="waterfall" v-model="list" :add-time="10" :left-gap="leftGap" :right-gap="rightGap"
			:column-gap="columnGap">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list1" :key="item.id" class="waterfall-item">
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{ item.name }}</text>
							</view>
							<view class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.english }}</text>
							</view>
							<view style="display: inline-block;margin-top:3px;">
								<uv-tags :text=" item.brand?.name "size="mini"></uv-tags>
							</view>
						</view>
					</view>
				</view>
			</template>
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list2" :key="item.id" class="waterfall-item">
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{ item.name }}</text>
							</view>
							<view class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.english }}</text>
							</view>
							<view style="display: inline-block;margin-top:3px;">
								<uv-tags :text=" item.brand?.name "size="mini"></uv-tags>
							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
		<uv-load-more :status="loadStatus"></uv-load-more>
	</view>
</template>

<script>
import * as util from '@/common/util.js'
export default {
	data() {
		return {
			cateList: [],
			newGoods: [],
			list: [],// 瀑布流全部数据
			list1: [],
			list2: [],
			leftGap: 10,
			rightGap: 10,
			columnGap: 10,
			listPage: 1,
			loadStatus: 'loadmore'
		}
	},
	async onReachBottom() {
		if(this.loadStatus == 'loadmore') {
			this.loadStatus = 'loading';
			this.listPage++;
			await this.indexGoodsList();
			this.loadStatus = 'loadmore';
		}
	},
	async onLoad() {
		let config = uni.getStorageSync('configApp');
		if (config) {
			(config.cate).forEach(element => {
				this.cateList.push({
					name: element.name,
					id: element.id
				})
			});
		}
		await this.indexGoodsList();
	},
	methods: {
		async indexGoodsList() {
			let that = this;
			let res = await uni.$uv.http.get('commodity/app/goods/list', { params: { page: this.listPage, limit: 25 }, custom: { loading: true } });
			console.log('res', res)
			if (res.list.length > 0) {
				that.list.push.apply(that.list,res.list);
				let i = 0;
				(res.list).forEach(element => {
					i++;
					if (i % 2 == 0) {
						that.list2.push(element)
					} else {
						that.list1.push(element)
					}
				});
			}
			that.loadStatus = 'loadmore';
		},
		goCateList(id) {
			uni.$uv.http.get('commodity/v1/goods/cate', { params: { id }, custom: { loading: true } }).then(res => {
				if (res.list.length > 0) {
					uni.navigateTo({
						url: '/pages/list/result'
					});
					console.log(res.list)
					uni.$emit('searchData', { data: res.list });
				} else {
					uni.$uv.toast('没有相关结果')
				}
			})
		},
		search(value, type) {
			console.log('value', value)
			let params = {
				page: 1,
				limit: 100,
				ch_name: type == undefined ? value : '',
				en_name: '',
				gtin: type == 'gtin' ? value : ''
			}
			uni.$uv.http.get('commodity/v1/likes/goods', { params: params, custom: { loading: true } }).then(res => {
				if (res.list.length > 0) {
					uni.navigateTo({
						url: '/pages/list/result'
					});
					uni.$emit('searchData', { data: res.list });
				} else {
					uni.$uv.toast('没有相关结果')
				}
			}).catch((error, type) => {
				if (error == 'Goods not found') {
					error = '没有相关结果';
				}
				uni.$uv.toast(error)
			})
		},
		barCode(value) {
			let that = this;
			util.qrScan(function (result) {
				that.search(result, 'gtin')
			})
		}
	}
}
</script>

<style scoped lang="scss">
$show-lines: 1;
@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

.waterfall-item {
	overflow: hidden;
	margin-top: 10px;
	border-radius: 6px;
	border:1px #2979ff solid;
}

.waterfall-item__ft {
	padding: 20rpx;
	background: #fff;

	&__title {
		margin-bottom: 10rpx;
		line-height: 48rpx;
		font-weight: 700;

		.value {
			font-size: 32rpx;
			color: #303133;
		}
	}

	&__desc .value {
		font-size: 28rpx;
		color: #606266;
	}

	&__btn {
		padding: 10px 0;
	}
}
</style>