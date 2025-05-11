<template>
  <div class="commodity-container">
    <div class="commodity-content">
      <div class="category-sidebar">
        <div class="category-item" @click="navigateToCategory('Fish')">
          <h3>Fish</h3>
          <p>Saltwater, Freshwater</p>
        </div>
        <div class="category-item" @click="navigateToCategory('Dogs')">
          <h3>Dogs</h3>
          <p>Various Breeds</p>
        </div>
        <div class="category-item" @click="navigateToCategory('Cats')">
          <h3>Cats</h3>
          <p>Various Breeds, Exotic Varieties</p>
        </div>
        <div class="category-item" @click="navigateToCategory('Reptiles')">
          <h3>Reptiles</h3>
          <p>Lizards, Turtles, Snakes</p>
        </div>
        <div class="category-item" @click="navigateToCategory('Birds')">
          <h3>Birds</h3>
          <p>Exotic Varieties</p>
        </div>
      </div>
      <div class="main-display">
        <div class="pet-collage-wrapper">
          <!-- 使用单张图片和图像映射 -->
          <img src="@/assets/pet-collage.jpg" alt="Pet Categories" usemap="#pet-map" class="pet-collage">
          
          <map name="pet-map">
            <!-- 鱼类区域 - 左上角圆形 -->
            <area shape="circle" coords="40,240,40" alt="Fish" @click="navigateToCategory('Fish')">
            
            <!-- 鸟类区域 - 右上角圆形 -->
            <area shape="circle" coords="340,240,40" alt="Birds" @click="navigateToCategory('Birds')">
            
            <!-- 狗区域 - 左下角圆形 -->
            <area shape="circle" coords="90,310,40" alt="Dogs" @click="navigateToCategory('Dogs')">
            
            <!-- 爬行动物区域 - 底部中间圆形 -->
            <area shape="circle" coords="200,310,40" alt="Reptiles" @click="navigateToCategory('Reptiles')">
            
            <!-- 猫区域 - 右下角圆形 -->
            <area shape="circle" coords="290,280,40" alt="Cats" @click="navigateToCategory('Cats')">
            
            <!-- 中心区域 - 大圆形 -->
            <area shape="circle" coords="200,210,60" alt="All Pets" @click="navigateToCategory('Fish')">
          </map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 删除未使用的导入
// import { catalogApi } from '@/api/catalog';

export default {
  data() {
    return {
      categories: [
        { id: 'FISH', name: 'Fish', description: 'Saltwater, Freshwater' },
        { id: 'DOGS', name: 'Dogs', description: 'Various Breeds' },
        { id: 'CATS', name: 'Cats', description: 'Various Breeds, Exotic Varieties' },
        { id: 'REPTILES', name: 'Reptiles', description: 'Lizards, Turtles, Snakes' },
        { id: 'BIRDS', name: 'Birds', description: 'Exotic Varieties' }
      ]
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        // 这里假设后端有一个获取所有分类的API
        // 如果没有这样的API，可以保留使用静态数据
        // 如果后端提供了获取所有分类的API，可以取消下面的注释
        
        // 由于后端API中没有看到获取所有分类的接口，所以这里保留使用静态数据
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },
    navigateToCategory(category) {
      // 将前端显示的分类名称传递给父组件
      this.$emit('switch-to-category-detail', category);
    }
  }
};
</script>

<style scoped>
.commodity-container {
  width:1000px;
  min-height: 90vh;
  margin: 0;
  padding: 40px 0;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  /* gap: 40px;  // 移除gap，交给内部flex容器控制 */
}

.commodity-content {
  display: flex;           /* 横向并排 */
  flex-direction: row;     /* 明确横向 */
  gap: 40px;               /* 横向间隔 */
  width: auto;
  background: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  /* 其余样式可根据需要保留或精简 */
}

/* 分开侧边栏和主展示区，分别做磨砂和阴影 */
.category-sidebar {
  width: 300px;
  min-width: 300px;
  background: rgba(255,255,255,0.45);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  padding: 32px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: 1px solid rgba(255,255,255,0.18);
}

.category-item {
  margin: 0;
  padding: 18px 20px;
  border-radius: 16px;
  background: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-size: 18px;
}

.category-item:hover {
  background: rgba(255,255,255,0.95);
  transform: translateX(8px) scale(1.03);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.category-item h3 {
  margin: 0 0 6px 0;
  color: #1a2a3a;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
}

.category-item p {
  margin: 0;
  color: #5a6a7a;
  font-size: 14px;
  opacity: 0.85;
}

.main-display {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.35);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  padding: 32px 0;
  margin-left: 0;
  border: 1px solid rgba(255,255,255,0.18);
}

.pet-collage-wrapper {
  width: 600px;
  max-width: 600px;
  height:400px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: none;
  border-radius: 20px;
  transition: transform 1s;
}

/* 响应式优化 */
@media (max-width: 1100px) {
  .commodity-container {
    flex-direction: column;
    gap: 24px;
    padding: 24px 0;
  }
  .main-display, .category-sidebar {
    width:600px;
    max-width: 600px;
    margin: 0 auto;
  }
  .main-display {
    padding: 24px 0;
  }
}

@media (max-width: 600px) {
  .category-sidebar, .main-display {
    width: 98vw;
    max-width: 98vw;
    padding: 10px 0;
    border-radius: 12px;
  }
  .pet-collage-wrapper {
    max-width: 98vw;
  }
}


</style>
