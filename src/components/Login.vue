<template>
  <div class="min-h-screen bg-dark-950 text-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent animate-glow animate-slide-up">
          Iniciar Sesión
        </h2>
      </div>

      <form @submit.prevent="handleLogin" class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-3xl p-8 shadow-2xl space-y-6 transform transition-all duration-300 hover:shadow-cinema animate-scale-in">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input 
              id="email-address"
              type="email" 
              v-model="form.email" 
              placeholder="Email" 
              required
              class="appearance-none rounded-t-lg relative block w-full px-4 py-3 border border-dark-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent focus:z-10 bg-dark-800 transition-colors duration-200"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input 
              id="password"
              type="password" 
              v-model="form.password" 
              placeholder="Contraseña" 
              required
              class="appearance-none rounded-b-lg relative block w-full px-4 py-3 border border-dark-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent focus:z-10 bg-dark-800 transition-colors duration-200"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          :class="[
            'w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium transition-all duration-300 transform',
            loading ? 'bg-dark-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-cinema-600 to-cinema-500 hover:from-cinema-700 hover:to-cinema-600 text-white shadow-lg hover:shadow-xl hover:scale-105 animate-glow'
          ]"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </span>
          <span v-else>
            Entrar
          </span>
        </button>

        <div v-if="error" class="text-center text-sm text-red-300 p-4 rounded-lg bg-red-900/20 border border-red-800 animate-fade-in">
          {{ error }}
        </div>

        <div class="text-center text-sm">
          <router-link to="/register" class="font-medium text-cinema-400 hover:text-cinema-300 hover:underline transition-colors duration-200">
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>
      </form>
    </div>
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

          localStorage.setItem('user', JSON.stringify(user));
          authStore.login(user, token);

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
/* Las clases de utilidad de Tailwind han reemplazado los estilos CSS. */

/* Animación de entrada para el formulario */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* Animación de entrada general */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>