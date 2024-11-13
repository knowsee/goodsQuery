<template>
	<view>
		<uv-search placeholder="enter keyword" v-model="keyword" shape="square" :showAction="false"
			@search="searchFunc"></uv-search>
		<view class="paddingView">
			<uv-button type="primary" :plain="true" text="創建品牌" @click="open"></uv-button>
		</view>
		<uv-loading-page :loading="isLoading" loading-text="loading..." font-size="24"></uv-loading-page>
		<view>
			<uv-list>
				<uv-list-item :clickable="true" :border="true" v-for="brand in dataList" :title="brand.name_en"
					:note="brand.name" @click="onSelect(brand)"></uv-list-item>
			</uv-list>
		</view>
		<uv-popup ref="popup">
			<view class="content">
				<uv-form labelPosition="left" :model="brandInfo" ref="form" labelWidth="120">
					<uv-form-item label="名稱" prop="brandInfo.name" borderBottom>
						<uv-input v-model="brandInfo.name" border="none">
						</uv-input>
					</uv-form-item>
					<uv-form-item label="英文名" prop="brandInfo.name_en" borderBottom>
						<uv-input v-model="brandInfo.name_en" border="none">
						</uv-input>
					</uv-form-item>
					<uv-form-item label="簡介" prop="brandInfo.desc" borderBottom>
						<uv-input v-model="brandInfo.desc" border="none">
						</uv-input>
					</uv-form-item>
					<uv-form-item label="英文簡介" prop="brandInfo.desc_en" borderBottom>
						<uv-input v-model="brandInfo.desc_en" border="none">
						</uv-input>
					</uv-form-item>
					<uv-form-item label="產地" prop="brandInfo.country" borderBottom @click="showCountrySelect">
						<uv-input v-model="brandInfo.country" disabled disabledColor="#ffffff" placeholder="請選擇屬地" border="none">
						</uv-input>
						<template v-slot:right>
							<uv-icon name="arrow-right"></uv-icon>
						</template>
					</uv-form-item>
					<uv-button type="primary" text="提交" customStyle="margin-top: 10px" @click="onBrandSave"></uv-button>
				</uv-form>
				<button type="primary" :plain="true" size="mini" @click="close">關閉</button>
			</view>
		</uv-popup>
		<uv-picker ref="countrySelect" :columns="country" keyName="name" @confirm="countrySelect"></uv-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				keyword: '',
				isLoading: false,
				brandInfo: {
					name: null,
					name_en: null,
					desc: 'n',
					desc_en: 'n',
					country: null
				},
				country: [[
					{
						name: 'HK',
					},{
						name: 'TW',
					},{
						name: 'MEX',
					},{
						name: 'BR',
					},{
						name: 'THAI',
					},{
						name: 'MYS',
					},{
						name: 'PHL',
					},{
						name: 'AUS',
					}, {
						name: 'US',
					}, {
						name: 'CA',
					}, {
						name: 'CN',
					}, {
						name: 'JP',
					}, {
						name: 'KR',
					}, {
						name: 'DE',
					}, {
						name: 'FR',
					}, {
						name: 'UK',
					}, {
						name: 'OTHER'
					}
				]]
				
			}
		},
		onReady() {

		},
		onLoad() {
			uni.$uv.http.get('commodity/app/brand/list', {
				params: {
					page: 1,
					limit: 100
				},
				custom: {
					loading: true
				}
			}).then(res => {
				this.dataList = res;
			}).catch((err) => {

			})
		},
		onShow() {},
		methods: {
			open() {
				this.$refs.popup.open();
			},
			close() {
				this.$refs.popup.close();
			},
			onBrandSave() {
				uni.$uv.http.post('commodity/v1/brand',this.brandInfo, { custom: { loading: true }}).then(res => {
					this.keyword = this.brandInfo.name;
					this.searchFunc();
					this.brandInfo = {
						name: null,
						name_en: null,
						desc: 'n',
						desc_en: 'n',
						country: null
					};
					this.close();
					this.toast('保存成功', 'success');
				})
			},
			toast(title, type, url) {
				if(type == undefined) {
					type = 'default';
				}
				this.$refs.toast.show({
					type: type,
					title: title,
					message: title,
					duration: 4000,
					complete() {
						url !== undefined && uni.navigateTo({
							url: url
						})
					}
				})
			},
			onSelect(item) {
				uni.$emit('updateBrand', item);
				uni.navigateBack({
					delta: 1
				});
			},
			searchFunc() {
				let that = this;
				let searchList = [];
				if ((that.keyword).length < 1 || that.keyword == '') {
					that.dataList = that.cacheList;
					return;
				}
				this.dataList = [];
				that.isLoading = true;
				that.keyword = (that.keyword).toLocaleUpperCase();
				uni.$uv.http.get('commodity/app/brand/search', {
					params: {
						keyword: that.keyword
					},
					custom: {
						loading: true
					}
				}).then(res => {
					this.dataList = res;
				}).catch((err) => {

				})
				that.isLoading = false;
			},
			showCountrySelect() {
				this.$refs.countrySelect.open();
				this.hideKeyboard();
			},
			countrySelect(e) {
				this.brandInfo.country = e.value[0].name;
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		}
	}
</script>

<style>
.content {
	padding: 20px 15px
}
</style>