<template>
  <div class="login-form-container">
    <form @submit.prevent="handleLogin" class="form-card">
      <h2>Iniciar Sesión</h2>
      <input 
        type="email" 
        v-model="form.email" 
        placeholder="Email" 
        required
      />
      <input 
        type="password" 
        v-model="form.password" 
        placeholder="Contraseña" 
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Entrar' }}
      </button>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="link-container">
        <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { authStore } from '../store/auth';

export default {
  name: 'userLogin',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, this.form);
        const { token } = response.data;

        if (token) {
          localStorage.setItem('token', token);

          // Paso 1: Obtener los datos del usuario con el nuevo token
          const userResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/me`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const user = userResponse.data;

          // Paso 2: Almacenar los datos en localStorage y en el store
          localStorage.setItem('user', JSON.stringify(user));
          authStore.login(user, token);

          // Paso 3: Redirigir al usuario al home
          const redirect = this.$route.query.redirect || '/';
          this.$router.push(redirect);

        } else {
          this.error = 'No se recibió un token. Credenciales inválidas.';
        }
      } catch (err) {
        console.error('Login error:', err);
        const message = err.response?.data?.message || 'Credenciales inválidas. Por favor, revisa tu email y contraseña.';
        this.error = message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Estilos básicos para la estructura. Los estilos de Tailwind irían aquí. */
.form-card {
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>