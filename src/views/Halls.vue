<template>
  <div>
    <section class="hero-section">
      <h1 class="hero-title">Nuestras Salas</h1>
      <p class="hero-subtitle">Descubre la capacidad y características de cada una de nuestras salas</p>
    </section>

    <main class="main-content">
      <div v-if="loading" class="loading-message">
        Cargando salas...
      </div>
      <div v-else-if="error" class="error-message">
        Error al cargar las salas: {{ error }}
      </div>
      <div v-else class="halls-grid">
        <div v-for="hall in halls" :key="hall.id" class="hall-card">
          <img
            src="https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/cultura/PublishingImages/Recursos/151223-sala-de-cine.jpg?RenditionID=33"
            :alt="hall.name"
            class="hall-image"
          />
          <div class="hall-details">
            <h2 class="hall-name">{{ hall.name }}</h2>
            <svg xmlns="http://www.w3.org/2000/svg" class="hall-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <p class="hall-capacity"><strong>Capacidad:</strong> {{ hall.capacity }} personas</p>
        </div>
      </div>
    </main>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CineHalls',
  data() {
    return {
      halls: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchHalls();
  },
  methods: {
    async fetchHalls() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/halls`);
        this.halls = response.data;
      } catch (err) {
        this.error = 'No se pudieron cargar las salas. Por favor, inténtalo de nuevo más tarde.';
        console.error('Error fetching halls:', err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Las clases de Tailwind van aquí. Se han simplificado los nombres en el template para la migración. */
.hero-section {
  background-image: linear-gradient(to bottom, #1f2937, #111827);
  text-align: center;
  padding: 4rem 0;
}
.hero-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
}
.hero-subtitle {
  color: #9ca3af;
}
.main-content {
  max-width: 84rem;
  margin-left: auto;
  margin-right: auto;
  padding: 3rem 1rem;
}
.loading-message, .error-message {
  text-align: center;
  font-size: 1.25rem;
  color: #9ca3af;
}
.halls-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}
@media (min-width: 640px) {
  .halls-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .halls-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1280px) {
  .halls-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.hall-card {
  background-color: #1f2937;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition-property: all;
  transition-duration: 0.3s;
}
.hall-card:hover {
  box-shadow: 0 10px 15px -3px rgba(252, 211, 77, 0.2), 0 4px 6px -2px rgba(252, 211, 77, 0.1);
}
.hall-image {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
.hall-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.hall-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
}
.hall-icon {
  height: 1.5rem;
  width: 1.5rem;
  color: #fcd34d;
}
.hall-capacity {
  color: #9ca3af;
  margin-bottom: 0.5rem;
}
</style>