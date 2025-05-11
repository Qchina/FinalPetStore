<template>
  <div id="Header">
    <div id="Logo">
      <div id="LogoContent">
        <router-link to="/"><img src="@/assets/images/logo-topbar.gif"></router-link>
      </div>
    </div>

    <div id="Menu">
      <div id="MenuContent">
        <router-link to="/cart"><img align="middle" name="img_cart" src="@/assets/images/cart.gif" /></router-link>
        <img align="middle" src="@/assets/images/separator.gif" />
        
        <template v-if="!isLoggedIn">
          <router-link to="/userauth">Sign In</router-link>
          <img align="middle" src="@/assets/images/separator.gif" />
        </template>
        
        <template v-else>
          <a href="#" @click.prevent="logout">Sign Out</a>
          <img align="middle" src="@/assets/images/separator.gif" />
          <router-link to="/accountauth">My Account</router-link>
          <img align="middle" src="@/assets/images/separator.gif" />
        </template>
        
        <router-link to="/help">?</router-link>
      </div>
    </div>

    <div id="Search">
      <div id="SearchContent">
        <form @submit.prevent="search">
          <input 
            type="text" 
            v-model="keyword" 
            @input="handleInput"
            @focus="showDropdown = true"
            @blur="handleBlur"
            size="14" 
            id="keyword" 
            placeholder="Search pets or products..."
          >
          <input type="submit" value="Search">
        </form>
        <div id="productAutoComplete" v-show="showDropdown && filteredItems.length">
          <ul id="productAutoList">
            <li 
              v-for="item in filteredItems" 
              :key="item.id"
              @mousedown="selectItem(item)"
              class="auto-complete-item"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-category" v-if="item.category">({{ item.category }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="TextLinks">
      <router-link to="/commodity/Fish" class="text-link">Fish</router-link>
      <img src="@/assets/images/separator.gif" />
      <router-link to="/commodity/Dogs" class="text-link">Dogs</router-link>
      <img src="@/assets/images/separator.gif" />
      <router-link to="/commodity/Reptiles" class="text-link">Reptiles</router-link>
      <img src="@/assets/images/separator.gif" />
      <router-link to="/commodity/Cats" class="text-link">Cats</router-link>
      <img src="@/assets/images/separator.gif" />
      <router-link to="/commodity/Birds" class="text-link">Birds</router-link>
    </div> 
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isLoggedIn: false,
      keyword: '',
      showDropdown: false,
      items: [
        { id: 'FISH', name: 'Fish', type: 'category' },
        { id: 'DOGS', name: 'Dogs', type: 'category' },
        { id: 'CATS', name: 'Cats', type: 'category' },
        { id: 'REPTILES', name: 'Reptiles', type: 'category' },
        { id: 'BIRDS', name: 'Birds', type: 'category' },
        { id: 'FI-SW-01', name: 'Angelfish', category: 'Fish', type: 'product' },
        { id: 'FI-SW-02', name: 'Tiger Shark', category: 'Fish', type: 'product' },
        { id: 'FI-FW-01', name: 'Koi', category: 'Fish', type: 'product' },
        { id: 'FI-FW-02', name: 'Goldfish', category: 'Fish', type: 'product' },
        { id: 'EST-1', name: 'Angelfish', category: 'Fish', type: 'product' },
        { id: 'EST-2', name: 'Tiger Shark', category: 'Fish', type: 'product' },
        // 可以继续添加更多产品...
      ]
    }
  },
  computed: {
    filteredItems() {
      if (!this.keyword) return [];
      const searchTerm = this.keyword.toLowerCase();
      return this.items.filter(item => 
        item.id.toLowerCase().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm)
      ).slice(0, 8); // 最多显示8个建议
    }
  },
  created() {
    // 页面加载时判断是否已登录
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
  },
  methods: {
    async logout() {
      try {
        // 调用后端登出接口
        await axios.post('http://localhost:9090/api/v1/accounts/logout', {}, { withCredentials: true });
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.$router.push('/');
      } catch (error) {
        console.error('登出失败:', error);
      }
    },
    handleInput() {
      this.showDropdown = true;
    },
    handleBlur() {
      // 延迟关闭下拉框，确保可以点击选项
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    },
    selectItem(item) {
      this.keyword = item.name;
      this.showDropdown = false;
      if (item.type === 'category') {
        this.$router.push(`/commodity/${item.name}`);
      } else if (item.type === 'product') {
        this.$router.push(`/commodity/${item.category}/product/${item.id}`);
      }
    },
    search() {
      if (!this.keyword) return;
      
      // 先检查是否匹配具体商品ID
      const productMatch = this.items.find(item => 
        item.id.toLowerCase() === this.keyword.toLowerCase() && 
        item.type === 'product'
      );
      if (productMatch) {
        this.$router.push(`/commodity/${productMatch.category}/product/${productMatch.id}`);
        return;
      }

      // 再检查是否匹配分类
      const categoryMatch = this.items.find(item => 
        item.name.toLowerCase() === this.keyword.toLowerCase() && 
        item.type === 'category'
      );
      if (categoryMatch) {
        this.$router.push(`/commodity/${categoryMatch.id}`);
        return;
      }

      // 如果都不匹配，进入搜索结果页
      this.$router.push({ 
        path: '/search', 
        query: { keyword: this.keyword } 
      });
    }
  }
}
</script>

<style scoped>
#Header {
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  position: fixed;
  top:0;
  width: 100%;
  z-index: 1;
}

#LogoContent {
  margin: 0;
}

#LogoContent img {
  border: 0;
  height: 40px;
  width: auto;
}
/* 修改文字链接样式 */
#TextLinks {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  width: auto;
  background-color: transparent;
  border-radius: 0;
}
.text-link {
  color: yellow;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
}

.text-link:hover {
  color: #f40;
}

#TextLinks img {
  border: 0;
  vertical-align: middle;
}
#MenuContent {
  display: flex;
  align-items: center;
  gap: 10px;
}

#MenuContent a {
  color: yellow;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}

#MenuContent a:hover {
  color: #f40;
}

#MenuContent img[name="img_cart"] {
  margin-right: 0;
}

#Search {
  position: static;
  width: auto;
}

#SearchContent {
  display: flex;
  gap: 5px;
}

#SearchContent input[type="text"] {
  width: 140px;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: gray;
  color: white;
  border-radius: 4px;
}

#SearchContent input[type="submit"] {
  padding: 8px 15px;
  background-color: #e0e0e0;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

#SearchContent input[type="submit"]:hover {
  background-color: #ccc;
}

#QuickLinks {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  width: auto;
}

#QuickLinks img {
  border: 0;
  vertical-align: middle;
  transition: transform 0.3s ease;
}

#QuickLinks img:hover {
  transform: scale(1.1);
}

#productAutoComplete {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  width: 180px;
  z-index: 100;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#productAutoList {
  list-style: none;
  padding: 0;
  margin: 0;
}

#productAutoList li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#productAutoList li:hover {
  background-color: #f5f5f5;
}
.auto-complete-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auto-complete-item:hover {
  background-color: #f0f0f0;
}

.item-name {
  font-weight: 500;
}

.item-category {
  color: #666;
  font-size: 0.9em;
}

#productAutoComplete {
  position: absolute;
  top: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 220px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

#productAutoList {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>