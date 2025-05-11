<template>
    <Header />
    <div class="auth-background"></div>
    <div class="payment-container">
      <h2>Payment Details</h2>
      <form @submit.prevent="continueToConfirm">
        <table class="detail-table">
          <tbody>
            <tr>
              <td>Card Type:</td>
              <td><input type="text" v-model="payment.cardType"></td>
            </tr>
            <tr>
              <td>Credit Card:</td>
              <td><input type="text" v-model="payment.creditCard" placeholder="1234 5678 9012 3456"></td>
            </tr>
            <tr>
              <td>Expiry Date (MM/YYYY):</td>
              <td><input type="text" v-model="payment.expiryDate" placeholder="MM/YYYY"></td>
            </tr>
          </tbody>
        </table>
  
        <table class="detail-table">
          <thead>
            <tr>
              <th colspan="2">Billing Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First Name:</td>
              <td><input type="text" v-model="billing.firstName"></td>
            </tr>
            <tr>
              <td>Last Name:</td>
              <td><input type="text" v-model="billing.lastName"></td>
            </tr>
            <tr>
              <td>Address 1:</td>
              <td><input type="text" v-model="billing.address1"></td>
            </tr>
            <tr>
              <td>Address 2:</td>
              <td><input type="text" v-model="billing.address2"></td>
            </tr>
            <tr>
              <td>City:</td>
              <td><input type="text" v-model="billing.city"></td>
            </tr>
            <tr>
              <td>State:</td>
              <td><input type="text" v-model="billing.state"></td>
            </tr>
            <tr>
              <td>Zip:</td>
              <td><input type="text" v-model="billing.zip"></td>
            </tr>
            <tr>
              <td>Country:</td>
              <td><input type="text" v-model="billing.country"></td>
            </tr>
          </tbody>
        </table>
  
        <button type="submit" class="continue-btn">Continue</button>
      </form>
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
        payment: {
          cardType: "",
          creditCard: "",
          expiryDate: ""
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
              this.payment.cardType = orderData.cardType || "";
              this.payment.creditCard = orderData.creditCard || "";
              this.payment.expiryDate = orderData.expiryDate || "";
              
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
      continueToConfirm() {
        // 准备订单数据
        const orderData = {
          cardType: this.payment.cardType,
          creditCard: this.payment.creditCard,
          expiryDate: this.payment.expiryDate,
          billToFirstName: this.billing.firstName,
          billToLastName: this.billing.lastName,
          billAddress1: this.billing.address1,
          billAddress2: this.billing.address2,
          billCity: this.billing.city,
          billState: this.billing.state,
          billZip: this.billing.zip,
          billCountry: this.billing.country
        };
        
        // 提交订单数据
        fetch("http://localhost:9090/api/v8/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 0) {
            // 跳转到确认页面
            this.$router.push({
              name: "ConfirmOrder",
              params: { orderData: JSON.stringify(data.data) }
            });
          }
        })
        .catch(error => console.error("Error confirming order:", error));
        this.$router.push('/order2');
      },
    }
  };
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

  .payment-container {
    position: relative; /* 新增：创建新的层叠上下文 */
  z-index: 1; /* 新增：确保内容在背景之上 */
  max-width: 800px;
  margin: 80px auto 0;
  padding: 20px;
  background: white; /* 可选：添加白色背景增强可读性 */
  box-shadow: 0 0 20px rgba(0,0,0,0.1); /* 可选：添加阴影效果 */
  }
  
  .detail-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .detail-table th {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: left;
    width: 200px;
  }
  
  .detail-table td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  .detail-table input,
  .detail-table select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
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