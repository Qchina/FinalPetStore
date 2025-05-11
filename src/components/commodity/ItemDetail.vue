<template>
  <div class="item-detail-container">
    <div class="auth-form">
      <div class="header-container">
        <h2>{{ item.productName }}</h2>
        <div class="button-group">
          <button type="button" @click="returnToProduct" class="return-button">Return to {{ productId }}</button>
          <button type="button" @click="returnToMain" class="return-button">Return to Main Menu</button>
        </div>
      </div>
      
      <div class="item-content">
        <div class="item-info">
          <div class="info-row">
            <div class="info-label">Item ID:</div>
            <div class="info-value">{{ item.itemId }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Product ID:</div>
            <div class="info-value">{{ item.productId }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Description:</div>
            <div class="info-value">
              <img v-if="item.descriptionImage" :src="getImageUrl(item.descriptionImage)" alt="Product Image" class="description-image">
              <div>{{ item.descriptionText }}</div>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Attributes:</div>
            <div class="info-value">{{ item.attributes }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">Quantity:</div>
            <div class="info-value">{{ item.quantity }}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">List Price:</div>
            <div class="info-value price">${{ item.listPrice ? item.listPrice.toFixed(2) : '0.00' }}</div>
          </div>
          
          <div class="action-row">
            <button @click="addToCart" class="add-to-cart-btn">Add to Cart</button>
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
    itemId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      item: {},
      product: {}
    };
  },
  watch: {
    itemId: {
      immediate: true,
      handler: 'fetchItemDetails'
    }
  },
  methods: {
    async fetchItemDetails() {
      try {
        // 获取商品详情
        const itemResponse = await catalogApi.getItem(this.itemId);
        if (itemResponse.data.status === 0) {
          this.item = itemResponse.data.data;
          
          // 获取相关产品信息
          const productResponse = await catalogApi.getProduct(this.item.productId);
          if (productResponse.data.status === 0) {
            this.product = productResponse.data.data;
          }
        } else {
          console.error('Failed to fetch item:', itemResponse.data.msg);
          // 使用模拟数据作为备份
          this.useMockData();
        }
      } catch (error) {
        console.error('Failed to fetch item details:', error);
        // 使用模拟数据作为备份
        this.useMockData();
      }
    },
    useMockData() {
      // 根据itemId设置模拟数据
      // 这里需要根据你的实际情况添加模拟数据
    },
    addToCart() {
      console.log('Add to cart:', this.item);
      alert(`Added ${this.item.description} to cart!`);
    },
    returnToProduct() {
      this.$emit('return-to-product');
    },
    returnToMain() {
      this.$emit('return-to-main');
    },
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      // 移除路径中的相对路径标记
      const cleanPath = imagePath.replace('../images/', '');
      // 使用require导入图片
      try {
        return require(`@/assets/images/${cleanPath}`);
      } catch (error) {
        console.error('Failed to load image:', error);
        return ''; // 如果图片加载失败返回空字符串
      }
    }
  }
};
</script>

<style scoped>
.item-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.auth-form {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

h2 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.return-button {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
}

.return-button:hover {
  background-color: #0b7dda;
}

.item-content {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.info-label {
  flex: 0 0 120px;
  font-weight: bold;
  color: #555;
}

.info-value {
  flex: 1;
}

.price {
  font-size: 20px;
  color: #2196F3;
  font-weight: bold;
}

.action-row {
  margin-top: 20px;
}

.add-to-cart-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

.add-to-cart-btn:hover {
  background-color: #0b7dda;
}

.description-image {
  max-width: 200px;
  margin-bottom: 10px;
  border-radius: 4px;
}
</style>