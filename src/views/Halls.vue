<template>
  <div>
    <section class="bg-gradient-to-b from-dark-800 to-dark-900 text-center py-16">
      <h1 class="text-5xl font-black mb-4">Nuestras Salas</h1>
      <p class="text-gray-400">Descubre la capacidad y características de cada una de nuestras salas</p>
    </section>

    <main class="max-w-7xl mx-auto px-4 py-12">
      <div v-if="loading" class="text-center text-xl text-gray-400">
        Cargando salas...
      </div>
      <div v-else-if="error" class="text-center text-xl text-red-500">
        Error al cargar las salas: {{ error }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="hall in halls" 
          :key="hall.id" 
          class="bg-dark-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-dark-700"
        >
          <img
            src="https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/cultura/PublishingImages/Recursos/151223-sala-de-cine.jpg?RenditionID=33"
            :alt="hall.name"
            class="w-full h-40 object-cover rounded-lg mb-4"
          />
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">{{ hall.name }}</h2>
            <svg class="w-6 h-6 text-cinema-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <p class="text-gray-400 mb-2">
            <strong class="font-bold">Capacidad:</strong> {{ hall.capacity }} personas
          </p>
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
/* ¡Ya no necesitas nada aquí! 🎉 */
</style>