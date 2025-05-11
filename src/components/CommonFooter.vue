<template>
    <footer>
      <div id="Footer">
        <div id="PoweredBy">
          &nbsp;<a href="http://www.csu.edu.cn">Central South University</a>
        </div>
        <div id="Banner">
          <!-- 显示 favoriteGory 信息 -->
          <!-- <div style="color:red">{{ loginAccount && loginAccount.favoriteGory }}</div> -->
          <img v-if="loginAccount && loginAccount.favoriteGory" 
          :src="getBannerSrcByFavCategory(loginAccount.favoriteGory)" 
          class="banner-img"/>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'CommonFooter',
    props: {
      loginAccount: Object,
      authenticated: Boolean
    },
    methods: {
      // 根据 favoriteGory 拼接图片路径
    getBannerSrcByFavCategory(favoriteGory) {
      if (!favoriteGory) return '';
      // 统一大写转小写，去除空格
      const key = favoriteGory.trim().toLowerCase();
      // 支持的类别
      const valid = ['birds', 'cats', 'dogs', 'fish', 'reptiles'];
      if (valid.includes(key)) {
        return `http://localhost:9090/images/banner_${key}.gif`;
      }
      return '';
    }
    }
  };
  </script>
  
  <style scoped>
  #Footer {
    background-color: black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    position: fixed;
    bottom: 40px;
    left: 0;
    right: 0;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
  }
  
  #Banner {
    width: 100%;
    height: 9ex;
    margin: 0ex 0ex 0ex 0ex;
    padding: 0ex 0ex 0ex 0ex;
    border-width: .3ex 0ex .3ex 0px;
    border-style: solid;
    border-color: #ccc;
    float: left;
    background-color: #000;
    color: #fff;
    line-height: 9ex;
  }
  
  /* 新增图片样式 */
  .banner-img {
    max-height: 50px;
    max-width: 100%;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
    object-fit: contain;
  }
  #PoweredBy {
    width: 30%;
    height: 9ex;
    margin: 0ex 0ex 0ex 0ex;
    padding: 0ex 0ex 0ex 0ex;
    border-width: .3ex 0ex .3ex 0px;
    border-style: solid;
    border-color: #ccc;
    float: left;
    background-color: #000;
    color: #fff;
    line-height: 9ex;
    /* 兼容老IE的语音属性，可省略 */
    /* voice-family: "\"}\""; */
    /* voice-family: inherit; */
  }
  
  body > #PoweredBy {
    height: 9ex;
  }
  </style>