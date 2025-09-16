<template>
  <div class="register-form-container">
    <form @submit.prevent="handleRegister" class="form-card">
      <h2>Registrarse</h2>
      <input type="text" v-model="form.name" placeholder="Nombre" required />
      <input type="email" v-model="form.email" placeholder="Email" required />
      <input type="password" v-model="form.password" placeholder="Contraseña" required />
      <input type="password" v-model="form.password_confirmation" placeholder="Confirmar contraseña" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Registrarse' }}
      </button>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="link-container">
        <router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { authStore } from '../store/auth';

export default {
    name:'userRegister',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = null;

     try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, this.form);
        const { token, user } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);

          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            authStore.login(user, token); // Update the global state
          }
          authStore.isAuthenticated = true;
          this.$router.push('/');
        } else {
          this.error = 'Error en el registro. Inténtalo de nuevo.';
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error en el registro. Inténtalo de nuevo.';
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
/* Estilos básicos para la estructura. Los de Tailwind irían aquí. */
.form-card {
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>