<template>
  <div class="category-detail-container">
    <div class="auth-form">
      <div class="header-container">
        <h2>{{ category }}</h2>
        <button type="button" @click="returnToMainMenu" class="return-button">Return to Main Menu</button>
      </div>
      <div class="form-container">
        <div class="form-group header-group">
          <div class="col">Product ID</div>
          <div class="col">Name</div>
        </div>
        <div v-for="product in products" :key="product.productId" class="form-group product-item">
          <div class="col">
            <a href="#" @click.prevent="viewProduct(product.productId)">{{ product.productId }}</a>
          </div>
          <div class="col">{{ product.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catalogApi } from '@/api/catalog';

export default {
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      products: [],
      categoryName: ''
    };
  },
  watch: {
    category: {
      immediate: true,
      handler: 'fetchProducts'
    }
  },
  methods: {
    // 添加getCategoryId方法，将前端分类名称转换为后端需要的格式
    getCategoryId(categoryName) {
      // 根据您的后端API要求进行转换
      // 这里假设categoryName就是categoryId，如果不是，请根据实际情况修改
      return categoryName;
    },
    
    async fetchProducts() {
      try {
        // 将前端分类名称转换为后端API需要的categoryId格式
        const categoryId = this.getCategoryId(this.category);
        this.categoryName = this.category;
        
        console.log('Fetching products for category:', categoryId);
        
        // 获取分类信息
        const categoryResponse = await catalogApi.getCategory(categoryId);
        console.log('Category API response:', categoryResponse);
        
        if (categoryResponse.data && categoryResponse.data.status === 0) {
          // 如果API返回成功，使用API返回的数据
          this.categoryName = categoryResponse.data.data.name || this.category;
          this.products = categoryResponse.data.data.productList || [];
          console.log('Products loaded successfully:', this.products);
        } else {
          console.error('Failed to fetch category:', categoryResponse?.data?.msg || 'Unknown error');
          // 如果API调用失败，使用模拟数据作为备份
          this.useMockData();
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // 如果API调用出错，使用模拟数据作为备份
        this.useMockData();
      }
    },
    
    // 其他方法保持不变
    viewProduct(productId) {
      this.$emit('view-product', productId, this.category);
      console.log('Emitting view-product event:', productId, this.category);
    },
    
    returnToMainMenu() {
      this.$emit('switch-to-commodity-list');
    },
    
    useMockData() {
      // 修改模拟数据结构，使其与API返回的数据结构一致
      this.products = [
        { productId: 'FI-SW-01', name: '金鱼' },
        { productId: 'K9-DL-01', name: '斑点狗' },
        { productId: 'RP-SN-01', name: '响尾蛇' }
      ];
      console.log('Using mock data for products');
    }
  }
};
</script>

<style scoped>
.category-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
}

.auth-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.auth-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

h2 {
  text-align: left;
  margin-bottom: 0;
  font-size: 20px;
}

.return-button {
  width: auto;
  padding: 8px 16px;
  font-size: 14px;
}

.form-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

button {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #0b7dda;
  transform: scale(1.02);
}

.form-group {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.form-group:last-child {
  border-bottom: none;
}

.header-group {
  background-color: #f5f5f5;
  font-weight: bold;
}

.col {
  flex: 1;
  padding: 12px;
  word-break: break-word;
  border-right: 1px solid #e0e0e0;
}

.col:last-child {
  border-right: none;
}

.product-item:nth-child(even) {
  background-color: #fafafa;
}

.product-item:hover {
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
}

.col a {
  color: #2196F3;
  text-decoration: none;
}

.col a:hover {
  text-decoration: underline;
}
</style>