<template>
	<view style="margin: 10px">
		<uv-list>
			<uv-list-item v-for="item in data">
				<view style="border: 1px #2979ff solid; margin: 10px; padding: 5px;">
					<view>
						<uv-row customStyle="{margin:0}">
							<uv-col span="4">
								<uv-image :src="item.images" mode="aspectFill" width="100" height="100"></uv-image>
							</uv-col>
							<uv-col span="8">
								<view @click="goGoodsManger(item.gtin)">
									<uv-row customStyle="{margin:0}">
										<uv-col span="6">
											<view>{{item.name_en}}</view>
											<view>{{item.name_chi}}</view>
										</uv-col>
										<uv-col span="3">
											<view><uv-icon name="arrow-downward" color="#fc0107" size="12" :label="`$${item.low_price}`"></uv-icon></view>
										</uv-col>
										<uv-col span="3">
											<view><uv-icon name="arrow-upward" color="#fc0107" size="12" :label="`$${item.high_price}`"></uv-icon></view>
										</uv-col>
									</uv-row>
								</view>
								<view style="margin-top:5px; padding: 0 20rpx"><uv-tags :text="item?.brand?.name" plain size="mini" type="warning"></uv-tags></view>
								<view style="margin-top:5px; padding: 0 20rpx"><uv-button size="small" @click="showPrices(item.gtin)" type="primary" :plain="true" :hairline="true" text="Get Prices"></uv-button></view>
							</uv-col>
						</uv-row>
					</view>
				</view>
			</uv-list-item>
		</uv-list>
		<uv-popup ref="popup" mode="center" customStyle="width: 90%; padding: 20rpx 10rpx">
			<view v-if="prices">
				<uv-cell-group customStyle="border: 1px #E5E5E5 solid">
					<uv-cell v-for="pricesitem in prices" :title="`${pricesitem.shop_name_english}(${pricesitem.shop_name})`" :value="`${pricesitem.prices}/${pricesitem.sku}p`" :label="`Last Update: ${pricesitem.update}`"></uv-cell>
				</uv-cell-group>
			</view>
			<view v-if="prices.length < 1">
				<uv-alert type="warning" :show-icon="true" description="Sorry, please wait set"></uv-alert>
			</view>
		</uv-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				prices: null
			}
		},
		onLoad() {
			let that = this;
			uni.$once('searchData', function(data) {
				console.log('data', data)
				if(data.type == 'load') {
					uni.$uv.http.get('commodity/v1/likes/goods', { params: data.data, custom: { loading: true } }).then(res => {
						that.data = res.list
					});
				} else {
					that.data = data.data
				}
			})
		},
		methods: {
			goGoodsManger(gtin) {
				uni.navigateTo({
					url: '/pages/manager/goods/goods?gtin='+gtin
				})
			},
			showPrices(gtin) {
				let that = this;
				that.prices = null;
				uni.$uv.http.get('commodity/v1/goods/price/'+gtin, { params: {}, custom: { loading: true } }).then(res => {
					that.prices = res.prices;
					that.$refs.popup.open();
				});
			}
		}
	}
</script>

<style>

</style>