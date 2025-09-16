<template>
  <header class="header-navbar">
    <nav class="navbar-container">
      <router-link to="/" class="app-logo-title">
        <span>CINEMA<span class="highlight">HUB</span></span>
      </router-link>

      <div class="main-nav-links">
        <a href="#cartelera">Cartelera</a>
        <router-link to="/halls" class="text-yellow-400 font-semibold">Salas</router-link>
        <a href="#">Próximamente</a>
        <a href="#">Promociones</a>
      </div>

      <div class="auth-section">
        <div v-if="!authStore.isLoggedIn" class="auth-links">
          <router-link to="/login" class="login-link">
            Iniciar sesión
          </router-link>
        </div>

        <div v-else class="user-menu-wrapper" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <a href="#" class="user-auth-link">
            <span>Hola {{ authStore.user.name }}</span>
          </a>

          <div v-if="showDropdown" class="user-dropdown">
            <router-link to="/my-reservations" class="dropdown-item">Mis reservas</router-link>
            <a @click.prevent="handleLogout" class="dropdown-item logout-link">Cerrar sesión</a>
          </div>
        </div>
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
      authStore, // Make the store accessible in the template
      showDropdown: false,
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authStore.logout(); // Update the global state
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Estilos básicos para ver la estructura */
.header-navbar {
  background-color: #0d0d0d;
  color: #fff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #333;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-logo-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.highlight {
  color: #ffc107; /* Amarillo */
}

.main-nav-links a,
.auth-links a {
  color: #ccc;
  text-decoration: none;
  margin-left: 1.5rem;
  transition: color 0.3s;
}

.main-nav-links a:hover,
.auth-links a:hover {
  color: #ffc107;
}

.login-link {
  border: 1px solid #ffc107;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}
</style>