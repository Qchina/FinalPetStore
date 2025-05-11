<script>
import { catalogApi } from '@/api/catalog';

export default {
  props: {
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      category: {},
      products: []
    };
  },
  watch: {
    categoryId: {
      immediate: true,
      handler: 'fetchCategoryDetails'
    }
  },
  methods: {
    async fetchCategoryDetails() {
      try {
        // 获取分类信息
        const categoryResponse = await catalogApi.getCategory(this.categoryId);
        if (categoryResponse.data.status === 0) {
          this.category = categoryResponse.data.data;
          this.products = this.category.productList || [];
        } else {
          console.error('Failed to fetch category:', categoryResponse.data.msg);
          // 使用模拟数据作为备份
          this.useMockData();
        }
      } catch (error) {
        console.error('Failed to fetch category details:', error);
        // 使用模拟数据作为备份
        this.useMockData();
      }
    },
    
    // 使用模拟数据的方法
    useMockData() {
      // 根据categoryId设置模拟数据
      // 这里需要根据你的实际情况添加模拟数据
    },
    
    // 其他方法...
  }
};
</script>