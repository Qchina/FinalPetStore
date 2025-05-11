import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCartShopping, faMinus, faPlus, faTrash, faCartPlus, faClipboardList }
  from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:9090'
library.add(faCartShopping, faMinus, faPlus, faTrash, faCartPlus, faClipboardList);
const app = createApp(App)
app.use(router)

app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app')
