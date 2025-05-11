<template>
    <Header />
    <div class="auth-background"></div>
    <div class="order-details-container">
      <h2>Order Details</h2>
            <table class="confirm-table">
        <tbody>
          <tr>
            <td rowspan="2" class="order-info">Order Information</td>
            <td class="order-label">Order ID:</td>
            <td class="order-value">{{ order.orderId }}</td>
          </tr>
          <tr>
            <td class="order-label">Order Date:</td>
            <td class="order-value">{{order.orderDate}}</td>
          </tr>
        </tbody>
      </table>
      <table class="order-main-table">
<h3>Billing Address</h3>
      <table class="address-table">
        <tbody>
          <tr>
            <td>First Name:</td>
            <td>{{ order.billToFirstName }}</td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>{{ order.billToLastName }}</td>
          </tr>
          <tr>
            <td>Address 1:</td>
            <td>{{ order.billAddress1 }}</td>
          </tr>
          <tr>
            <td>Address 2:</td>
            <td>{{ order.billAddress2 }}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{{ order.billCity }}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{{ order.billState }}</td>
          </tr>
          <tr>
            <td>Zip:</td>
            <td>{{ order.billZip }}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{{ order.billCountry }}</td>
          </tr>
        </tbody>
      </table>
      <h3>Shipping Address</h3>
      <table class="address-table">
        <tbody>
          <tr>
            <td>First Name:</td>
            <td>{{ order.shipToFirstName }}</td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>{{ order.shipToLastName }}</td>
          </tr>
          <tr>
            <td>Address 1:</td>
            <td>{{ order.shipAddress1 }}</td>
          </tr>
          <tr>
            <td>Address 2:</td>
            <td>{{ order.shipAddress2 }}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{{ order.shipCity }}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{{ order.shipState }}</td>
          </tr>
          <tr>
            <td>Zip:</td>
            <td>{{ order.shipZip }}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{{ order.shipCountry }}</td>
          </tr>
        </tbody>
      </table>
        
        <!-- 商品列表 -->
        <tbody v-for="(item, index) in order.lineItems" :key="index">
          <tr>
            <td class="item-header">Item ID</td>
            <td class="item-header">Description</td>
            <td class="item-header">Quantity</td>
            <td class="item-header">Price</td>
            <td class="item-header">Total Cost</td>
          </tr>
          <tr>
            <td class="item-cell">{{ item.itemId }}</td>
            <td class="item-cell">{{ item.descriptionText || item.descriptionImage }}</td>
            <td class="item-cell">{{ item.quantity }}</td>
            <td class="item-cell">${{ item.unitPrice.toFixed(2) }}</td>
            <td class="item-cell">${{ (item.unitPrice * item.quantity).toFixed(2) }}</td>
          </tr>
        </tbody>
        
        <!-- 订单总计 -->
        <tfoot>
          <tr>
            <td colspan="4" class="total-row">
              Total: ${{ order.totalPrice.toFixed(2) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import Header from '@/components/CommonTop.vue'
  export default {
    components: {
    Header
  },
    name: 'OrderDetails',
    data() {
      return {
        order: {
          orderId: '',
          username: '',
          orderDate: '',
          shipAddress1: '',
          shipAddress2: '',
          shipCity: '',
          shipState: '',
          shipZip: '',
          shipCountry: '',
          billAddress1: '',
          billAddress2: '',
          billCity: '',
          billState: '',
          billZip: '',
          billCountry: '',
          courier: '',
          totalPrice: 0.00,
          billToFirstName: '',
          billToLastName: '',
          shipToFirstName: '',
          shipToLastName: '',
          creditCard: '',
          expiryDate: '',
          cardType: '',
          locale: '',
          lineItems: []
        }
      }
    },
    methods: {
      fetchOrder(id) {
        axios.get(`http://localhost:9090/api/v8/orders/${id}`)
          .then(response => {
            const res = response.data;
            if (res.status === 0) {
              const orderData = res.data.order;
              const lineItemsData = res.data.lineItems;
              const itemDetailsData = res.data.itemDetails;
  
              // 构建 itemId 到 itemDetails 的映射
              const itemDetailsMap = {};
              for (let i = 0; i < itemDetailsData.length; i++) {
                const item = itemDetailsData[i];
                itemDetailsMap[item.itemId] = item;
              }
  
              // 处理 lineItems，手动添加对应的 itemDetails 信息
              const enrichedLineItems = [];
              for (let j = 0; j < lineItemsData.length; j++) {
                const lineItem = lineItemsData[j];
                const itemDetail = itemDetailsMap[lineItem.itemId] || {};
  
                enrichedLineItems.push({
                  orderId: lineItem.orderId,
                  lineNumber: lineItem.lineNumber,
                  quantity: lineItem.quantity,
                  itemId: lineItem.itemId,
                  unitPrice: lineItem.unitPrice,
                  productId: itemDetail.productId || '',
                  productName: itemDetail.productName || '',
                  descriptionImage: itemDetail.descriptionImage || '',
                  descriptionText: itemDetail.descriptionText || '',
                  listPrice: itemDetail.listPrice || 0,
                  attributes: itemDetail.attributes || '',
                  inventoryQuantity: itemDetail.quantity || 0
                });
              }
  
              // 更新订单数据
              this.order.orderId = orderData.orderId;
              this.order.username = orderData.username;
              this.order.orderDate = orderData.orderDate;
              this.order.shipAddress1 = orderData.shipAddress1;
              this.order.shipAddress2 = orderData.shipAddress2;
              this.order.shipCity = orderData.shipCity;
              this.order.shipState = orderData.shipState;
              this.order.shipZip = orderData.shipZip;
              this.order.shipCountry = orderData.shipCountry;
              this.order.billAddress1 = orderData.billAddress1;
              this.order.billAddress2 = orderData.billAddress2;
              this.order.billCity = orderData.billCity;
              this.order.billState = orderData.billState;
              this.order.billZip = orderData.billZip;
              this.order.billCountry = orderData.billCountry;
              this.order.courier = orderData.courier;
              this.order.totalPrice = orderData.totalPrice;
              this.order.billToFirstName = orderData.billToFirstName;
              this.order.billToLastName = orderData.billToLastName;
              this.order.shipToFirstName = orderData.shipToFirstName;
              this.order.shipToLastName = orderData.shipToLastName;
              this.order.creditCard = orderData.creditCard;
              this.order.expiryDate = orderData.expiryDate;
              this.order.cardType = orderData.cardType;
              this.order.locale = orderData.locale;
              this.order.lineItems = enrichedLineItems;
            } else {
              alert(res.message || 'Failed to fetch order.');
            }
          })
          .catch(error => {
            console.error('Error fetching order:', error);
            alert('An error occurred while fetching the order.');
          });
      },
      formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      formatCreditCard(cardNumber) {
        if (!cardNumber) return '';
        // 保留最后4位，前面用*号替代
        return cardNumber.replace(/\d{12}(\d{4})/, '**** **** **** $1');
      }
    },
    created() {
      // 页面创建时默认请求id为1的订单
      this.fetchOrder(1);
    }
  }
  </script>
  

  
  <style scoped>
    .confirm-table {
    width: 100%;
    border-collapse: collapse;
  }
    .confirm-table th {
    background-color: #f5f5f5;
    text-align: left;
    width: 200px;
  }
    .confirm-table td {
    border-bottom: 1px solid #ddd;
  }
  .address-table {
    width: 325%;
    border-collapse: collapse;
  }
    .address-table th {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: left;
    width: 400px;
  }
  .address-table td {
    padding: 40px;
    border-bottom: 1px solid #eee;
  }
  .auth-background {
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
  z-index: -1; /* 关键修改：将层级设为-1使其位于内容下方 */
}

.confirm-container {
  position: relative; /* 新增：创建新的层叠上下文 */
  z-index: 1; /* 新增：确保内容在背景之上 */
  max-width: 800px;
  margin: 80px auto 0;
  padding: 20px;
  background: white; /* 可选：添加白色背景增强可读性 */
  box-shadow: 0 0 20px rgba(0,0,0,0.1); /* 可选：添加阴影效果 */
}
  .order-details-container {
  position: relative; /* 新增：创建新的层叠上下文 */
  z-index: 1; /* 新增：确保内容在背景之上 */
  max-width: 800px;
  margin: 80px auto 0;
  padding: 20px;
  background: white; /* 可选：添加白色背景增强可读性 */
  box-shadow: 0 0 20px rgba(0,0,0,0.1); /* 可选：添加阴影效果 */
  }
  
  .order-main-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .order-main-table th {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: left;
  }
  
  .order-main-table td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  .order-info {
    background-color: #f0f8ff;
    font-weight: bold;
  }
  
  .info-label {
    font-weight: bold;
  }
  
  .info-value {
    color: #555;
  }
  
  .item-header {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  .item-cell {
    padding: 8px;
  }
  
  .total-row {
    text-align: center;
    font-weight: bold;
    background-color: #f0f8ff;
  }
  </style>