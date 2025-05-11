<template>
  <div class="product-detail-container">
    <div class="auth-form">
      <div class="header-container">
        <h2>{{ product.name }}</h2>
        <button type="button" @click="returnToCategory" class="return-button">Return to {{ categoryName }}</button>
      </div>
      <div class="form-container">
        <div class="form-group header-group">
          <div class="col">Item ID</div>
          <div class="col">Product ID</div>
          <div class="col">Description</div>
          <div class="col">List Price</div>
          <div class="col"></div>
        </div>
        <div v-for="item in items" :key="item.itemId" class="form-group product-item" @click="navigateToItem(item.itemId)">
          <div class="col">{{ item.itemId }}</div>
          <div class="col">{{ item.productId }}</div>
          <div class="col">{{ item.description }}</div>
          <div class="col">${{ item.listPrice.toFixed(2) }}</div>
          <div class="col">
            <button @click.stop="addToCart(item)" class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catalogApi } from '@/api/catalog';

export default {
  props: {
    productId: {
      type: String,
      required: true
    },
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      product: {},
      items: [],
      categoryName: ''
    };
  },
  watch: {
    productId: {
      immediate: true,
      handler: 'fetchProductDetails'
    }
  },
  methods: {
    async fetchProductDetails() {
      try {
        // 获取分类信息
        const categoryResponse = await catalogApi.getCategory(this.categoryId);
        if (categoryResponse.data.status === 0) {
          this.categoryName = categoryResponse.data.data.name || this.getCategoryName(this.categoryId);
        } else {
          this.categoryName = this.getCategoryName(this.categoryId);
        }
        
        // 获取产品信息
        const productResponse = await catalogApi.getProduct(this.productId);
        if (productResponse.data.status === 0) {
          this.product = productResponse.data.data;
          // 直接使用产品信息中的 itemList
          this.items = productResponse.data.data.itemList || [];
          
          // 为每个item添加description
          this.items = this.items.map(item => ({
            ...item,
            description: item.attribute1 || 'No description available'
          }));
        } else {
          console.error('Failed to fetch product:', productResponse.data.msg);
          this.useMockData();
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        this.useMockData();
      }
    },
    
    // 使用模拟数据的方法
    useMockData() {
      // 根据productId获取产品信息
      if (this.productId === 'FI-SW-01') {
        this.product = { id: 'FI-SW-01', name: 'Angelfish', categoryId: 'FISH' };
        this.items = [
          { itemId: 'EST-1', productId: 'FI-SW-01', description: 'Large Angelfish', listPrice: 16.50 },
          { itemId: 'EST-2', productId: 'FI-SW-01', description: 'Small Angelfish', listPrice: 16.50 }
        ];
      } else if (this.productId === 'FI-SW-02') {
        this.product = { id: 'FI-SW-02', name: 'Tiger Shark', categoryId: 'FISH' };
        this.items = [
          { itemId: 'EST-3', productId: 'FI-SW-02', description: 'Toothless Tiger Shark', listPrice: 18.50 }
        ];
      }
      // ... 其他模拟数据保持不变 ...
    },
    
    // 其他方法保持不变
    getCategoryName(categoryId) {
      const categories = {
        'FISH': 'FISH',
        'DOGS': 'DOGS',
        'CATS': 'CATS',
        'REPTILES': 'REPTILES',
        'BIRDS': 'BIRDS'
      };
      return categories[categoryId] || categoryId;
    },
    
    addToCart(item) {
      // 这里添加购物车逻辑
      console.log('Add to cart:', item);
      alert(`Added ${item.description} to cart!`);
      this.$router.push('/cart');
    },
    
    returnToCategory() {
      this.$emit('return-to-category');
    },
    
    navigateToItem(itemId) {
      // 修改为发射事件而不是直接导航
      this.$emit('navigate-to-item', itemId);
    }
  }
};
</script>

<style scoped>
.product-detail-container {
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

.add-to-cart-btn {
  padding: 6px 12px;
  font-size: 14px;
  width: 100%;
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

.product-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.product-item:hover {
  background-color: #f0f0f0;
}
</style>