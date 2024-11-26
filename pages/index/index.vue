<template>
	<view style="margin: 10px">
		<uv-search inputAlign="center" height="40" actionText="QR SCAN" @search="search" @custom="barCode"></uv-search>
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
						<view v-if="item.images" class="waterfall-item__image" :style="[imageStyle(item)]">
							<uv-image :src="item.images" mode="aspectFill" width="180"></uv-image>
						</view>
						<view class="waterfall-item__ft">
							<view @click="goGoodsManger(item.gtin)" class="waterfall-item__ft__title">
								<text class="value">{{ item.name_chi }}</text>
							</view>
							<view @click="goGoodsManger(item.gtin)" class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.name_en }}</text>
							</view>
							<view style="margin-top:3px;">
								<uv-row justify="space-between" gutter="10">
									<uv-col span="6">
										<view style="display: inline-block;">
											<uv-tags :text="item.brand?.name"size="mini"></uv-tags>
										</view>
									</uv-col>
									<uv-col span="5">
										<view style="display: inline-block;">
											<uv-tags :text="item.specs"size="mini"></uv-tags>
										</view>
									</uv-col>
								</uv-row>
							</view>
						</view>
					</view>
				</view>
			</template>
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list2" :key="item.id" class="waterfall-item">
						<view v-if="item.images" class="waterfall-item__image" :style="[imageStyle(item)]">
							<uv-image :src="item.images" mode="aspectFill" width="180"></uv-image>
						</view>
						<view class="waterfall-item__ft">
							<view @click="goGoodsManger(item.gtin)" class="waterfall-item__ft__title">
								<text class="value">{{ item.name_chi }}</text>
							</view>
							<view @click="goGoodsManger(item.gtin)" class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.name_en }}</text>
							</view>
							<view style="margin-top:3px;">
								<uv-row justify="space-between" gutter="10">
									<uv-col span="6">
										<view style="display: inline-block;">
											<uv-tags :text="item.brand?.name"size="mini"></uv-tags>
										</view>
									</uv-col>
									<uv-col span="5">
										<view style="display: inline-block;">
											<uv-tags :text="item.specs"size="mini"></uv-tags>
										</view>
									</uv-col>
								</uv-row>
							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
		<uv-load-more :status="loadStatus"></uv-load-more>
		<uv-toast ref="toast"></uv-toast>
		
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
		if (config && typeof(config) == 'object' && config.cate[0] !== undefined) {
			(config.cate).forEach(element => {
				this.cateList.push({
					name: element.name,
					id: element.id
				})
			});
		}
		await this.indexGoodsList();
	},
	computed: {
		imageStyle(item) {
			return item => {
				const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
				const w = v/2;
				const rate = w / item.w;
				const h = rate* item.h;
				return {
					width: w + 'px',
					height: h + 'px'
				}
			}
		}
	},
	methods: {
		toast(title, type, url) {
			if(type == undefined) {
				type = 'default';
			}
			this.$refs.toast.show({
				type: type,
				title: title,
				message: title,
				complete() {
					url !== undefined && uni.navigateTo({
						url: url
					})
				}
			})
		},
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
					uni.$emit('searchData', { data: res.list, type: 'cate' });
				} else {
					this.toast('没有相关结果')
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
					uni.$emit('searchData', { data: params, type: 'load' });
				} else {
					this.toast('没有相关结果')
				}
			}).catch((error, typeError) => {
				console.log('error', error);
				if (error == 'Goods not found') {
					error = '没有相关结果';
				}
				if(type == 'gtin') {
					this.toast('page', getApp().globalData.setting.goodsInsert);
					if(getApp().globalData.setting.goodsInsert == 'simple') {
						this.toast(error, 'default', '/pages/manager/goods/simple?gtin='+value);
					} else {
						this.toast(error, 'default', '/pages/manager/goods/goods?action=create&gtin='+value);
					}
				} else {
					this.toast(error)
				}
			})
		},
		barCode(value) {
			let that = this;
			util.qrScan(function (result) {
				if(result == 'goods_simple') {
					that.toast('change to simple');
					getApp().globalData.setting.goodsInsert = 'simple';
					uni.setStorageSync('setting', getApp().globalData.setting);
				}
				if(result == 'goods_default') {
					that.toast('change to default');
					getApp().globalData.setting.goodsInsert = 'default';
					uni.setStorageSync('setting', getApp().globalData.setting);
				}
				if(result !== 'goods_default' && result !== 'goods_simple') {
					that.search(result, 'gtin');
				}
				
			})
		},
		goGoodsManger(gtin) {
			uni.navigateTo({
				url: '/pages/manager/goods/goods?gtin='+gtin
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
	padding: 10rpx;
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