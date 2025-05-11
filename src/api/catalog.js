import axios from 'axios';

export const catalogApi = {
  getCategory(categoryId) {
    return axios.get('/api/catalog/category', {
      params: { categoryId }
    });
  },

  getProduct(productId) {
    return axios.get('/api/catalog/product', {
      params: { productId }
    });
  },

  getItem(itemId) {
    return axios.get('/api/catalog/item', {
      params: { itemId }
    });
  },

  searchProducts(keyword) {
    return axios.get('/api/catalog/search', {
      params: { keyword }
    });
  },

  getAutoComplete(keyword) {
    return axios.get('/api/catalog/autocomplete', {
      params: { keyword }
    });
  }
};
