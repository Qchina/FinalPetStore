<template>
    <Header />
    <div class="auth-background"></div>
    <div class="confirm-container">
      <h2>Please confirm the information below and then press continue</h2>
      
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
  
      <h3>Billing Address</h3>
      <table class="address-table">
        <tbody>
          <tr>
            <td>First Name:</td>
            <td>{{ billing.firstName }}</td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>{{ billing.lastName }}</td>
          </tr>
          <tr>
            <td>Address 1:</td>
            <td>{{ billing.address1 }}</td>
          </tr>
          <tr>
            <td>Address 2:</td>
            <td>{{ billing.address2 }}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{{ billing.city }}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{{ billing.state }}</td>
          </tr>
          <tr>
            <td>Zip:</td>
            <td>{{ billing.zip }}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{{ billing.country }}</td>
          </tr>
        </tbody>
      </table>
  
      <h3>Shipping Address</h3>
      <table class="address-table">
        <tbody>
          <tr>
            <td>First Name:</td>
            <td>{{ shipping.firstName }}</td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>{{ shipping.lastName }}</td>
          </tr>
          <tr>
            <td>Address 1:</td>
            <td>{{ shipping.address1 }}</td>
          </tr>
          <tr>
            <td>Address 2:</td>
            <td>{{ shipping.address2 }}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{{ shipping.city }}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{{ shipping.state }}</td>
          </tr>
          <tr>
            <td>Zip:</td>
            <td>{{ shipping.zip }}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{{ shipping.country }}</td>
          </tr>
        </tbody>
      </table>
  
      <button class="continue-btn" @click="proceedToOrderDetails">Continue</button>
    </div>
  </template>
  
  <script>
import Header from '@/components/CommonTop.vue'
  export default {
    components: {
    Header
  },
    data() {
      return {
        order: {
            orderId: "",
            orderDate: ""
        },
        shipping: {
          firstName: "",
          lastName: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          country: ""
        },
        billing: {
          firstName: "",
          lastName: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          country: ""
        }
      };
    },
    mounted() {
      // 获取初始订单信息
      this.fetchInitialOrderData();
    },
    methods: {
      fetchInitialOrderData() {
        // 调用创建订单API获取初始数据
        fetch("http://localhost:9090/api/v8/users/orders?username=j2ee")
          .then( response => response.json())
          .then(data => {
            if (data.status === 0) {
              const orderData = data.data[0];
              this.order.orderDate=orderData.orderDate || "";
              this.order.orderId=orderData.orderId||"";
              this.shipping.firstName = orderData.shipToFirstName || "";
              this.shipping.lastName = orderData.shipToLastName || "";
              this.shipping.address1 = orderData.shipAddress1 || "";
              this.shipping.address2 = orderData.shipAddress2 || "";
              this.shipping.city = orderData.shipCity || "";
              this.shipping.state = orderData.shipState || "";
              this.shipping.zip = orderData.shipZip || "";
              this.shipping.country = orderData.shipCountry || "";              
              this.billing.firstName = orderData.billToFirstName || "";
              this.billing.lastName = orderData.billToLastName || "";
              this.billing.address1 = orderData.billAddress1 || "";
              this.billing.address2 = orderData.billAddress2 || "";
              this.billing.city = orderData.billCity || "";
              this.billing.state = orderData.billState || "";
              this.billing.zip = orderData.billZip || "";
              this.billing.country = orderData.billCountry || "";
            }
          })
          .catch(error => console.error("Error fetching initial order data:", error));
      },
      proceedToOrderDetails() {
      // 提交订单
      this.$router.push('/order3');
    },
},

  }
  </script>
  
  <style scoped>
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
  
  .confirm-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
  }
  
  .confirm-table th {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: left;
    width: 200px;
  }
  
  .confirm-table td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  .address-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
  }
  
  .address-table td {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }
  
  .continue-btn {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: block;
    margin: 20px auto 0;
  }
  
  .continue-btn:hover {
    background-color: #45a049;
  }
  </style>