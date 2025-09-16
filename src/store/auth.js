import { reactive } from 'vue';

export const authStore = reactive({
  isLoggedIn: false,
  user: null,
  token: null,

  login(userData, token) {
    this.isLoggedIn = true;
    this.user = userData;
    this.token = token;
  },

  logout() {
    this.isLoggedIn = false;
    this.user = null;
    this.token = null;
  }
});