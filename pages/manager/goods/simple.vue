<template>
	<view class="paddingView">
		<uv-text type="primary" :text="action" size="18"></uv-text>
		<uv-form labelPosition="left" :model="formDataModel" ref="form" labelWidth="120">
			<uv-form-item label="圖片" borderBottom>
				<uv-upload :fileList="fileList" @afterRead="afterReadUpload" :previewFullImage="true"></uv-upload>
			</uv-form-item>
			<uv-form-item label="條碼" prop="formDataModel.gtin" borderBottom>
				<uv-input v-model="formDataModel.gtin" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="規格(容量/克數等)" prop="formDataModel.specs" borderBottom>
				<uv-input v-model="formDataModel.specs" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="分類" prop="formDataModel.typeName" borderBottom @click="showTypesSelect">
				<uv-input v-model="formDataModel.typeName" disabled disabledColor="#ffffff" placeholder="請選擇分類"
					border="none">
				</uv-input>
				<template v-slot:right>
					<uv-icon name="arrow-right"></uv-icon>
				</template>
			</uv-form-item>
			<uv-form-item label="品牌" prop="formDataModel.brandName" borderBottom @click="brand">
				<uv-input v-model="formDataModel.brandName" disabled disabledColor="#ffffff" placeholder="請選擇品牌"
					border="none">
				</uv-input>
				<template v-slot:right>
					<uv-icon name="arrow-right"></uv-icon>
				</template>
			</uv-form-item>
			<uv-form-item label="價格" borderBottom>
				<uv-input v-model="pricesDataModel.prices" clearable type="text" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="sku" borderBottom>
				<uv-input v-model="pricesDataModel.sku" clearable type="digit" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="商場" borderBottom @click="showShopSelect">
				<uv-input v-model="pricesDataModel.shop_name" disabled disabledColor="#ffffff" placeholder="請選擇商場"
					border="none">
				</uv-input>
				<template v-slot:right>
					<uv-icon name="arrow-right"></uv-icon>
				</template>
			</uv-form-item>
			<uv-button type="primary" text="提交" customStyle="margin-top: 10px" @click="submit"></uv-button>
		</uv-form>
		<uv-picker ref="countrySelect" :columns="country" keyName="name" @confirm="countrySelect"></uv-picker>
		<uv-picker ref="shopSelect" :columns="shopList" keyName="name" @confirm="shopSelect"></uv-picker>
		<uv-picker ref="typeSelectgoods" :columns="typeList" @change="typesChange" keyName="name"
			@confirm="typesSelect"></uv-picker>
		<uv-toast ref="toast"></uv-toast>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				action: 'CREATE GOODS INFO',
				fileList: [],
				formDataModel: {
					id: null,
					gtin: null,
					type: null,
					typeName: null,
					name: null,
					name_en: null,
					desc: null,
					desc_en: null,
					specs: '1pcs',
					brand: null,
					brandName: null,
					country: null,
					files_id: null
				},
				pricesDataModel: {
					shop_id: 0,
					shop_name: null,
					sku: 1,
					prices: 0.00
				},
				country: [
					[{
						name: 'HK',
					}, {
						name: 'TW',
					}, {
						name: 'MEX',
					}, {
						name: 'BR',
					}, {
						name: 'THAI',
					}, {
						name: 'MYS',
					}, {
						name: 'PHL',
					}, {
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
					}]
				],
				shopList: [
					[{
						name: null
					}]
				],
				typesOne: [],
				typesTwo: [],
				pickerValue: [0, 0],
				defaultValue: [1, 2],
				radio: '',
				switchVal: false
			}
		},
		onLoad(options) {
			if (options.gtin !== undefined) {
				this.formDataModel.gtin = uni.$uv.trim(options.gtin);
				if (options.action == undefined) {
					uni.$uv.http.get('commodity/v1/goods/' + this.formDataModel.gtin, {
						custom: {
							loading: true
						}
					}).then(res => {
						let brand = res.brand;
						this.formDataModel = res;
						this.fileList = [];
						if (res.files_id !== null) {
							console.log('res.files_id', res.files_id);
							this.fileList.push({
								url: `${res.images}?timestamp=${uni.$uv.guid(20)}`,
								status: 'success',
								message: ''
							});
						}
						this.formDataModel.brand = brand?.id;
						this.formDataModel.brandName = brand?.name;
						this.$refs.countrySelect.setIndexs([this.country.findIndex(item => item.name == this
							.formDataModel.country)], true);
						this.defaultValue = res.type;
						this.action = 'EDIT GOODS INFO'
					}).catch((err) => {

					})
				}
			}
		},
		onShow() {
			let shopId = uni.getStorageSync('lastShopId');
			if (shopId && shopId !== undefined) {
				let shopIndex = this.shopList[0].findIndex(item => Number(item.id) === shopId);
				if (this.shopList[0][shopIndex] !== undefined) {
					this.pricesDataModel.shop_name = this.shopList[0][shopIndex].name;
					this.pricesDataModel.shop_id = this.shopList[0][shopIndex].id;
				}
			}
		},
		created() {
			let config = uni.getStorageSync('configApp');
			if (config && typeof(config) == 'object' && config.cate[0] !== undefined) {
				(config.cate).forEach(element => {
					this.typesOne.push(element)
				});
				this.handlePickValueDefault()
			}
			if (config && typeof(config) == 'object' && config.shop[0] !== undefined) {
				(config.shop).forEach(element => {
					this.shopList[0].push({
						id: element.id,
						name: element.name
					})
				});
			}
		},
		computed: {
			typeList() {
				return [this.typesOne, this.typesTwo];
			}
		},
		destroyed() {
			uni.$off('updateBrand')
		},
		onBackPress() {
			uni.$off('updateBrand')
		},
		methods: {
			uploadFilePromise(url) {
				let files_id = this.formDataModel.files_id || 0;
				let that = this;
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://upc-api.ckc.im/commodity/app/files', // 僅為示例，非真實的接口地址
						filePath: url,
						name: 'images',
						formData: {
							files_id
						},
						success: (res) => {
							resolve(JSON.parse(res.data));
						}
					});
				})
			},
			async afterReadUpload(event) {
				this[`fileList`] = [];
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList`].length
				lists.map((item) => {
					this[`fileList`].push({
						...item,
						status: 'uploading',
						message: '上傳中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList`][fileListLen]
					this.formDataModel.files_id = result.data.id;
					this[`fileList`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: `${result.data.files}?timestamp=${uni.$uv.guid(20)}`
					}))
					console.log('this.formDataModel-file', this.formDataModel)
					fileListLen++
				}
			},
			brand() {
				let that = this;
				uni.navigateTo({
					url: '/pages/manager/brand/brand'
				});
				uni.$once('updateBrand', function(data) {
					that.formDataModel.brand = data.id;
					that.formDataModel.brandName = data.name;
				})
			},
			handlePickValueDefault() {
				this.pickerValue[0] = this.typesOne.findIndex(item => Number(item.id) === this.defaultValue[0]);
				this.typesTwo = this.typesOne[this.pickerValue[0]]?.sub || [];
				this.pickerValue[1] = this.typesTwo.findIndex(item => Number(item.id) === this.defaultValue[1]);
				if (this.$refs.typeSelectgoods !== undefined) {
					this.$refs.typeSelectgoods.setIndexs([this.pickerValue[0], this.pickerValue[1]], true);
				}
			},
			toast(title, type, url) {
				if (type == undefined) {
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
			submit() {
				let postData = uni.$uv.deepClone(this.formDataModel);
				postData.type = ',' + (postData.type).join(',') + ',';
				console.log('this.formDataModel', postData)
				if (this.formDataModel.id > 0) {
					uni.$uv.http.put('commodity/v1/goods/' + this.formDataModel.id, postData, {
						custom: {
							loading: true
						}
					}).then(res => {
						this.toast('修改成功', 'success');
					}).catch((err, type) => {
						this.toast(err, 'error');
					})
				} else {
					uni.$uv.http.post('commodity/v1/goods/' + this.formDataModel.gtin, postData, {
						custom: {
							loading: true
						}
					}).then(res => {
						this.formDataModel.id = res.id;
						this.toast('創建成功', 'success');
						uni.$uv.http.put('commodity/v1/goods/price/' + this.formDataModel.id, this.pricesDataModel, {
							custom: {
								loading: true
							}
						}).then(res => {
							this.toast('價格已更新', 'success');
						}).catch((err, type) => {
							this.toast(err, 'error');
						})
					}).catch((err, type) => {
						this.toast(err, 'error');
					})
				}
			},
			submitPrices() {
				if (this.formDataModel.id < 1) {
					this.toast('商品未創建', 'error');
				}
				uni.$uv.http.put('commodity/v1/goods/price/' + this.formDataModel.id, this.pricesDataModel, {
					custom: {
						loading: true
					}
				}).then(res => {
					this.pricesDataModel.prices = 0.00;
					this.pricesDataModel.sku = 1;
					this.toast('價格已更新', 'success');
				}).catch((err, type) => {
					this.toast(err, 'error');
				})
			},
			showShopSelect() {
				let shopId = uni.getStorageSync('lastShopId');
				if (shopId && shopId !== undefined) {
					this.$refs.shopSelect.setIndexs([this.shopList[0].findIndex(item => Number(item.id) === shopId)],
						true);
				}
				this.$refs.shopSelect.open();
				this.hideKeyboard();
			},
			shopSelect(e) {
				this.pricesDataModel.shop_name = e.value[0].name;
				this.pricesDataModel.shop_id = e.value[0].id;
				uni.setStorageSync('lastShopId', e.value[0].id);
			},
			showCountrySelect() {
				this.$refs.countrySelect.open();
				this.hideKeyboard();
			},
			showTypesSelect() {
				this.$refs.typeSelectgoods.open();
				this.hideKeyboard();
				this.handlePickValueDefault();
			},
			countrySelect(e) {
				this.formDataModel.country = e.value[0].name;
			},
			typesChange(e) {
				const {
					columnIndex,
					index,
					indexs
				} = e
				if (columnIndex === 0) {
					this.typesTwo = this.typesOne[index]?.sub || []
					this.$refs.typeSelectgoods.setIndexs([index, 0], true)
				}
			},
			typesSelect(e) {
				this.formDataModel.type = [];
				(this.formDataModel.type).push(e.value[0].id);
				(this.formDataModel.type).push(e.value[1].id);
				this.formDataModel.typeName = `${e.value[0].name}/${e.value[1].name}`;
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		}
	}
</script>