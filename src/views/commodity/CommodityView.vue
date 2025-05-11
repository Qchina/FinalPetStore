<template>
    <div>
      <Header />
      <div class="commodity-container">
        <div class="commodity-background"></div>
        <CommodityList 
          v-if="showCommodityList" 
          @switch-to-category-detail="switchToCategoryDetail" 
          class="commodity-content"
        />
        <CategoryDetail 
          v-else-if="showCategoryDetail"
          :category="selectedCategory" 
          @switch-to-commodity-list="showCommodityList = true" 
          @view-product="viewProduct"
          class="commodity-content"
        />
        <ProductDetail
          v-else-if="showProductDetail"
          :productId="selectedProductId"
          :categoryId="selectedCategory"
          @return-to-category="returnToCategory"
          @navigate-to-item="navigateToItem"
          class="commodity-content"
        />
        <ItemDetail
          v-else-if="showItemDetail"
          :itemId="selectedItemId"
          :productId="selectedProductId"
          :categoryId="selectedCategory"
          @return-to-product="returnToProduct"
          @return-to-main="returnToMain"
          class="commodity-content"
        />
      </div>
    </div>
  </template>

<script>
import Header from '@/components/CommonTop.vue';
import CommodityList from '@/components/commodity/CommodityList.vue';
import CategoryDetail from '@/components/commodity/CategoryDetail.vue';
import ProductDetail from '@/components/commodity/ProductDetail.vue';
import ItemDetail from '@/components/commodity/ItemDetail.vue';

export default {
  components: {
    Header,
    CommodityList,
    CategoryDetail,
    ProductDetail,
    ItemDetail
  },
  props: {
    category: {
      type: String,
      default: ''
    },
    productId: {
      type: String,
      default: ''
    },
    itemId: {
      type: String,
      default: ''
    },
    view: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showCommodityList: !this.category && !this.productId && !this.itemId,
      showCategoryDetail: !!this.category && !this.productId && !this.itemId,
      showProductDetail: !!this.productId && !this.itemId,
      showItemDetail: !!this.itemId,
      selectedCategory: this.category || '',
      selectedProductId: this.productId || '',
      selectedItemId: this.itemId || ''
    }
  },
  created() {
    // 组件创建时根据路由参数初始化状态
    this.initializeFromRoute(this.$route);
  },
  watch: {
    // 监听路由参数变化
    $route(to) {
      this.initializeFromRoute(to);
    }
  },
  methods: {
    // 根据路由参数初始化组件状态
    initializeFromRoute(route) {
      if (route.params.itemId) {
        // 如果有商品项ID参数，显示商品项详情
        this.selectedItemId = route.params.itemId;
        this.selectedProductId = route.params.productId;
        this.selectedCategory = route.params.categoryId;
        this.showCommodityList = false;
        this.showCategoryDetail = false;
        this.showProductDetail = false;
        this.showItemDetail = true;
      } else if (route.params.productId) {
        // 如果有产品ID参数，显示产品详情
        this.selectedProductId = route.params.productId;
        this.selectedCategory = route.params.categoryId;
        this.selectedItemId = '';
        this.showCommodityList = false;
        this.showCategoryDetail = false;
        this.showProductDetail = true;
        this.showItemDetail = false;
      } else if (route.params.category) {
        // 如果只有分类参数，显示分类详情
        this.selectedCategory = route.params.category;
        this.selectedProductId = '';
        this.selectedItemId = '';
        this.showCommodityList = false;
        this.showCategoryDetail = true;
        this.showProductDetail = false;
        this.showItemDetail = false;
      } else {
        // 如果没有参数，显示商品列表
        this.selectedCategory = '';
        this.selectedProductId = '';
        this.selectedItemId = '';
        this.showCommodityList = true;
        this.showCategoryDetail = false;
        this.showProductDetail = false;
        this.showItemDetail = false;
      }
    },
    switchToCategoryDetail(category) {
      this.selectedCategory = category;
      this.showCommodityList = false;
      this.showCategoryDetail = true;
      this.showProductDetail = false;
      this.showItemDetail = false;
      // 更新URL，但不重新加载页面
      this.$router.push(`/commodity/${category}`);
    },
    viewProduct(productId, category) {
      this.selectedProductId = productId;
      this.selectedCategory = category;
      this.showCommodityList = false;
      this.showCategoryDetail = false;
      this.showProductDetail = true;
      this.showItemDetail = false;
      // 更新URL以包含产品ID
      this.$router.push(`/commodity/${category}/product/${productId}`);
    },
    navigateToItem(itemId) {
      this.selectedItemId = itemId;
      this.showCommodityList = false;
      this.showCategoryDetail = false;
      this.showProductDetail = false;
      this.showItemDetail = true;
      // 更新URL以包含商品项ID
      this.$router.push(`/commodity/${this.selectedCategory}/product/${this.selectedProductId}/item/${itemId}`);
    },
    returnToCategory() {
      this.showCategoryDetail = true;
      this.showCommodityList = false;
      this.showProductDetail = false;
      this.showItemDetail = false;
      this.selectedProductId = '';
      this.selectedItemId = '';
      this.$router.push(`/commodity/${this.selectedCategory}`);
    },
    returnToProduct() {
      this.showProductDetail = true;
      this.showCategoryDetail = false;
      this.showCommodityList = false;
      this.showItemDetail = false;
      this.selectedItemId = '';
      this.$router.push(`/commodity/${this.selectedCategory}/product/${this.selectedProductId}`);
    },
    returnToMain() {
      this.showCommodityList = true;
      this.showCategoryDetail = false;
      this.showProductDetail = false;
      this.showItemDetail = false;
      this.selectedCategory = '';
      this.selectedProductId = '';
      this.selectedItemId = '';
      this.$router.push('/commodity');
    }
  }
}
</script>

<style scoped>
.commodity-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.commodity-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 0;
}

.commodity-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.commodity-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}
</style>