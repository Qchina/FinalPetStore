<template>
  <div class="cart-container">
    <div class="cart-form">
      <h2>
        Shopping Cart 
        <FontAwesomeIcon icon="cart-shopping" /> {{ cart.length }}
      </h2>
      
      <table class="cart">
        <thead>
          <th style="width: 48px;"></th>
          <th>Item ID</th>
          <th>Product ID</th>
          <th>Description</th>
          <th>In Stock</th>
          <th>Quantity</th>
          <th>List Price</th>
          <th>Total Cost</th>
          <th style="width: 180px;">Option</th>
        </thead>

        <tbody> 
          <!-- 空购物车 -->
          <td style="background-color: #fff;"></td>
          <div v-if="cart.length === 0" class="empty-cart" colspan="6">
            <p class="empty">您的购物车是空的</p>
          </div>
          
          <tr v-for="cartitem in cart" :key="cartitem.itemid" :id="`row-${cartitem.itemid}`" :style="rowStyle(cartitem)">
            <td>
              <button v-if="!cartitem.isInTrash" @click="select(cartitem.itemid)" 
                :id="`select-${cartitem.itemid}`" class="roundBtn selectbtn"
                :style="selectBtnStyle(cartitem)"></button>
            </td>
            <td>{{ cartitem.itemid }}</td>
            <td>{{ cartitem.productid }}</td>
            <td>{{ cartitem.description }}</td>
            <td>{{ cartitem.instock }}</td>
            <td>
              <button @click="subtract(cartitem.itemid)" class="roundBtn">
                <FontAwesomeIcon icon="minus" /> 
              </button>
              <input type="text" v-model="cartitem.quantity" @keyup="calculate,updateCartItemQuantity(cartitem.itemid,cartitem.quantity)">
              <button @click="add(cartitem.itemid)" class="roundBtn">
                <FontAwesomeIcon icon="plus" /> 
              </button>
            </td>
            <td>${{ cartitem.listprice }}</td>
            <td>${{ cartitem.listprice * cartitem.quantity }}</td>
            <td v-if="!cartitem.isInTrash">
              <button @click="toBeRemove(cartitem.itemid)" :id="`btn-${cartitem.itemid}`" 
                class="removeBtn roundBtn">
                <FontAwesomeIcon icon="minus" /> 
              </button>
            </td>
            <td v-if="cartitem.isInTrash">
              <button @click="addToCart(cartitem.itemid)" :id="`btn-${cartitem.itemid}`" 
                class="removeBtn roundBtn">
                <FontAwesomeIcon icon="cart-plus" /> 
              </button>
              <button @click="remove(cartitem.itemid)" :id="`btn-${cartitem.itemid}`" 
                class="removeBtn roundBtn">
                <FontAwesomeIcon icon="trash" /> 
              </button>
            </td>
          </tr>
          
          <tr>
            <td colspan="1">
              <button @click="selectAll()" :style="selectAllBtnStyle()"
                id="selectAllBtn" class="roundBtn">
              </button>
            </td>
            <td id="selectAllText">全选</td>
            <td colspan="2" id="subTotal"> 总价 ：$ {{ subTotal }}</td>
            <td colspan="5">
              <button @click="proceed()" id="btnProceed">
                <FontAwesomeIcon icon="clipboard-list" /> 
                提交订单
              </button>
              <button @click="removeSelected()" id="btnRemoveSelected">
                <FontAwesomeIcon icon="trash" /> 
                删除选中
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = 'http://localhost:9090/api/cart';

export default {
  data() {
    return {
      subTotal: 0,
      isAllSelected: false,
      cart: [],
      cartService: {
        // 获取商品列表
        async getCartItems() {
          return axios.get(API_URL).then(response => response.data);
        },
        // 更新购物车某商品数量
        async updateCartItem(id, quantity) {
          return axios.put(`${API_URL}/items/${id}`, null, {
            params: {
              quantity: quantity,
              username: "j2ee"
            }
          }).then(response => response.data);
        },
        // 删除某商品
        async removeFromCart(id) {
          return axios.delete(`${API_URL}/items/${id}`, {
            params: {
              itemId: id,
              username: "j2ee"
            }
          });
        },
        async proceedToCheckout() {
          
          // 跳转至 确认提交订单页面
        
          // 确认提交订单后 删除已选中的商品
          this.subTotal = 0
        this.isAllSelected = false
        let i = 0
        while (i < this.cart.length) {
          if (this.cart[i].isSelected) {
            this.remove(this.cart[i].itemid)
          } else {
            i++
          }
        }
        }
      }
    }
  },
  
  mounted() {
    this.loadCartData();
  },
  
  methods: {
    // 数据加载方法
    async loadCartData() {
      try {
        const response = await this.cartService.getCartItems();
        response.data.items.forEach(element => {
          console.log(element)
          let cartitem = {
            itemid: element.cart.itemId,
            productid: element.cart.productId,
            description: element.cart.description,
            instock: element.cart.in_stock,
            quantity: element.cart.quantity,
            listprice: this.createPrice(element.cart.listPrice),
            isSelected: false,
            isInTrash: false
          }
          this.cart.push(cartitem)
        });
      } catch (error) {
        console.error('加载购物车数据失败:', error);
      }
    },
    
    // 商品操作方法
    async updateCartItemQuantity(itemid, quantity) {
      try {
        await this.cartService.updateCartItem(itemid, quantity);
      } catch (error) {
        console.error('更新数量失败:', error);
      }
    },
    
    async remove(itemid) {
      this.cart.forEach(async item => {
        if (item.itemid === itemid) { 
          this.cart.splice(this.cart.indexOf(item), 1);
          await this.cartService.removeFromCart(itemid)
        }
      });
    },
    
    // 数量操作方法
    async subtract(itemid) {
      this.cart.forEach(async item => {
        if (item.itemid === itemid) { 
          item.quantity--;
          await this.updateCartItemQuantity(itemid, item.quantity);
        }
      });
      this.calculate(); 
    },
    
    async add(itemid) {
      this.cart.forEach(async item => {
        if (item.itemid === itemid) { 
          item.quantity++;
          await this.updateCartItemQuantity(itemid, item.quantity);
        }
      });
      this.calculate(); 
    },
    
    // 选择操作方法
    select(itemid) {
      this.cart.forEach(async item => {
        if (item.itemid === itemid) {
          if (item.isSelected) {
            item.isSelected = false
          } else {
            item.isSelected = true
          }
          await this.updateCartItemQuantity(itemid, item.quantity);
        }
      });
      this.calculate(); 
      this.isAllSelect();
    },
    
    isAllSelect() {
      if (this.cart.some(item => !item.isInTrash && !item.isSelected)) {
        this.isAllSelected = false
        return;
      }
      this.selectAll()
    },
    
    selectAll() {
      if (!this.isAllSelected) {
        this.cart.forEach(item => {
          if (!item.isInTrash) {
            item.isSelected = true 
          }
        });
        this.isAllSelected = true
      } else {
        this.cart.forEach(item => {
          item.isSelected = false
        });
        this.isAllSelected = false
      }
      this.calculate()
    },
    
    // 计算和价格方法
    calculate() {
      this.subTotal = 0
      this.cart.forEach(async item => {
        if (item.isSelected) {
          this.subTotal += item.quantity * item.listprice
        }
      });  
    },
    
    isTwoDecimal(num) {
      return /^-?\d+(\.\d{1,2})?$/.test(num.toString());
    },
    
    createPrice(value) {
      if (!this.isTwoDecimal(value)) {
        throw new Error('价格必须保留至多两位小数');
      }
      return parseFloat(value.toFixed(2));
    },
    
    // 其他操作方法
    toBeRemove(itemid) {
      this.cart.forEach(async item => {
        if (item.itemid === itemid) { 
          this.cart.push(item)
          this.cart.splice(this.cart.indexOf(item), 1);
          this.cart[this.cart.length - 1].isInTrash = true;
          this.cart[this.cart.length - 1].isSelected = false;
          this.calculate()
          return;
        }
      });
    },
    
    addToCart(itemid) {
      this.cart.forEach(async item => {
        if (item.itemid === itemid) { 
          this.cart.unshift(item)
          this.cart.splice(this.cart.indexOf(item)+1, 1);
          this.cart[0].isInTrash = false;
        }
      });
      this.isAllSelected = false
    },
    
    proceed() {
      // 提交订单
      this.$router.push('/order1');
    },
    
    async removeSelected() {
      if (confirm("确认删除所选中的商品？")) { 
        this.subTotal = 0
        this.isAllSelected = false
        let i = 0
        while (i < this.cart.length) {
          if (this.cart[i].isSelected) {
            this.remove(this.cart[i].itemid)
          } else {
            i++
          }
        }
      }
    },
    
    // 样式方法
    rowStyle(item) {
      return {
        backgroundColor: item.isInTrash ? '#ccc' : ''
      }
    },
    
    selectAllBtnStyle() {
      return {
        backgroundColor: this.isAllSelected ? 'rgb(22,92,145,0.2)' : '#fff'
      }
    },
    
    selectBtnStyle(item) {
      return {
        backgroundColor: item.isSelected ? 'rgb(22,92,145,0.2)' : '#fff'
      }
    }
  }
}
</script>

<style scoped>
.cart-container {
  margin: 0 auto;
  width: 100%;
  padding: 30px;
}

.cart-form {
  width: 95%;
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

.cart-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

h2 {
  width: 100%;
  text-align: center;
  word-spacing: 5px;
  margin: 0;
  height: 60px;
  line-height: 0px;
  color: rgb(22,92,145);
  text-shadow: 0 0 5px #fff; 
  font-size: 40px;
}

.cart {
  color: rgb(22,92,145);
  text-align: center;
  margin: 0 auto;
  width: 100%;
  border-radius: 10px;
}

th {
  background-color: rgba(22, 92, 145, 0.4);
  font-size: 24px;
  text-shadow: 0 0 5px #fff; 
  font-style: oblique;
}

tr {
  background-color: rgba(22, 92, 145, 0.1);
  font-size: 20px;
}

td {
  padding-inline: 5px;
  text-shadow: 0 0 5px rgba(22, 92, 145, 0.2); 
}

input {
  height: 35px;
  font-size: 20px;
  margin: 2px 0px;
  width: 100px;
  padding-left: 10px;
  border-radius: 10px;
}

.roundBtn {
  font-size: 20px;
  padding: 0%;
  height: 36px;
  width: 36px;
  border-radius: 50%;
}

.selectbtn {
  padding-inline: 13px; 
  background-color: #fff;
}

button {
  margin: 5px;
  padding: 5px 10px;
  background-color: rgb(22,92,145,0.8);
  color: #fff;
  text-shadow: 0 0 1px #fff;
  border-radius: 20px;
  font-size: 18px;
  border: gray 1px solid;
}

button:hover {
  background-color: rgb(22,92,145,0.6);
}

.empty {
  font-size: 28px;
}

#subTotal {
  font-size: 24px;
  text-align: left;
}

#selectAllText {
  text-align: left;
}

#btnProceed, #btnRemoveSelected {
  margin: 5px 50px;
  font-size: 25px;
}
</style>