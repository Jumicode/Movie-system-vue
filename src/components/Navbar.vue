<template>
  <header class="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 shadow-lg animate-fade-in-down">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <router-link to="/" class="flex-shrink-0">
        <span class="text-3xl font-black bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent animate-glow transition-transform duration-300 hover:scale-105">
          CINEMA<span class="text-cinema-500 highlight">HUB</span>
        </span>
      </router-link>

      <div class="hidden md:flex flex-grow justify-center space-x-8">
        <a href="#cartelera" class="nav-link">
          Cartelera
        </a>
        <router-link to="/halls" class="nav-link text-cinema-400 font-semibold hover:text-cinema-300">
          Salas
        </router-link>
        <a href="#" class="nav-link">
          Próximamente
        </a>
        <a href="#" class="nav-link">
          Promociones
        </a>
      </div>

      <div class="flex items-center">
        <div v-if="!authStore.isLoggedIn" class="auth-links">
          <router-link 
            to="/login"
            class="bg-gradient-to-r from-cinema-600 to-cinema-500 hover:from-cinema-700 hover:to-cinema-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:ring-opacity-50 animate-glow group"
          >
            Iniciar sesión
          </router-link>
        </div>

        <div v-else class="relative" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <button class="flex items-center gap-2 p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors duration-200 focus:outline-none">
            <span class="text-gray-300 font-medium truncate max-w-[120px]">Hola {{ authStore.user.name }}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition 
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-dark-900 border border-dark-800 rounded-lg shadow-lg py-1 z-10 origin-top-right">
              <router-link to="/my-reservations" class="dropdown-item">Mis reservas</router-link>
              <a @click.prevent="handleLogout" class="dropdown-item text-red-400 hover:text-red-300">Cerrar sesión</a>
            </div>
          </Transition>
        </div>
      </div>

      <div class="md:hidden">
        <button class="text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import { authStore } from '../store/auth';

export default {
  name: 'UserNavbar',
  data() {
    return {
      authStore,
      showDropdown: false,
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authStore.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Las clases CSS personalizadas han sido reemplazadas por clases de utilidad de Tailwind. */

/* Definiciones de clases de utilidad para reutilizar */
.nav-link {
  @apply text-gray-300 font-medium hover:text-white transition-colors duration-200 relative;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 bg-cinema-400 transition-all duration-300;
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  @apply w-full;
}

.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-300 hover:bg-dark-800 hover:text-white transition-colors duration-200 cursor-pointer;
}

.highlight {
    @apply text-cinema-400;
}

@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.5s ease-out;
}
</style>