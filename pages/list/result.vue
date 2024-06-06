<template>
	<view style="margin: 10px">
		<uv-list>
			<uv-list-item v-for="item in data">
				<view style="border: 1px #2979ff solid; margin: 10px; padding: 5px;">
					<uv-row customStyle="margin-bottom: 10px">
						<uv-col span="6">
							<view>{{item.english}}</view>
							<view>{{item.name}}</view>
						</uv-col>
						<uv-col span="3">
							<view><uv-icon name="arrow-downward" color="#fc0107" size="12" :label="`$${item.low_price}`"></uv-icon></view>
						</uv-col>
						<uv-col span="3">
							<view><uv-icon name="arrow-upward" color="#fc0107" size="12" :label="`$${item.high_price}`"></uv-icon></view>
						</uv-col>
					</uv-row>
					<uv-tags :text="item?.brand?.name" plain size="mini" type="warning"></uv-tags>
				</view>
			</uv-list-item>
		</uv-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: null
			}
		},
		onLoad() {
			let that = this;
			uni.$once('searchData', function(data) {
				console.log('data', data)
				that.data = data.data
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>