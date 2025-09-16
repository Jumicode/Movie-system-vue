<template>
  <div class="min-h-screen bg-dark-950 text-gray-100 relative overflow-hidden">
    <!-- Animated background particles -->
    <div class="floating-particles">
      <div class="particle animate-drift"></div>
      <div class="particle animate-drift"></div>
      <div class="particle animate-drift"></div>
      <div class="particle animate-drift"></div>
      <div class="particle animate-drift"></div>
    </div>

    <!-- Background shimmer effect -->
    <div class="absolute inset-0 shimmer opacity-20"></div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 py-12">
      <!-- Header Section -->
      <div class="text-center mb-16 animate-fade-in">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent animate-slide-up animate-glow">
          Horarios de la Película
        </h1>
        <div class="w-24 h-1 bg-gradient-to-r from-cinema-600 to-cinema-400 mx-auto rounded-full animate-shimmer"></div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-cinema-400 border-t-transparent animate-glow"></div>
          <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cinema-400 opacity-20"></div>
        </div>
        <p class="text-gray-400 text-lg mt-6 animate-pulse">Cargando horarios disponibles...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20 animate-scale-in">
        <div class="bg-red-900/20 border border-red-800 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <div class="animate-bounce mb-4">
            <svg class="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-400 mb-2">Error al cargar</h3>
          <p class="text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- No Showtimes State -->
      <div v-else-if="filteredShowtimes.length === 0" class="text-center py-20 animate-scale-in">
        <div class="bg-dark-900/50 border border-dark-700 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <div class="animate-float mb-4">
            <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">Sin horarios disponibles</h3>
          <p class="text-gray-400">No hay funciones programadas para esta película en este momento.</p>
        </div>
      </div>

      <!-- Showtimes List -->
      <div v-else class="space-y-6 animate-fade-in">
        <div 
          v-for="(showtime, index) in filteredShowtimes" 
          :key="showtime.id"
          class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-dark-800/70 hover:border-dark-700 animate-slide-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <!-- Showtime Info -->
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-3">
                <!-- Hall Icon -->
                <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cinema-600 to-cinema-500 rounded-xl shadow-lg animate-glow">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"/>
                  </svg>
                </div>
                
                <!-- Hall and Time Info -->
                <div>
                  <h3 class="text-xl font-bold text-gray-100 mb-1">
                    Sala #{{ showtime.hall_id }}
                  </h3>
                  <div class="flex items-center text-cinema-400 font-medium">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ formatTime(showtime.starts_at) }}
                  </div>
                </div>
              </div>
              
              <!-- Additional Info -->
              <div class="flex flex-wrap gap-2 text-sm text-gray-400">
                <span class="bg-dark-800 px-3 py-1 rounded-full border border-dark-700">
                  Función disponible
                </span>
              </div>
            </div>

            <!-- Reserve Button -->
            <div class="w-full sm:w-auto">
              <button 
                @click="goToReserve(showtime.id)"
                class="w-full sm:w-auto bg-gradient-to-r from-cinema-600 to-cinema-500 hover:from-cinema-700 hover:to-cinema-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:ring-opacity-50 animate-glow group"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                  Reservar Asientos
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-16 animate-slide-up" style="animation-delay: 0.5s">
        <router-link 
          to="/" 
          class="inline-flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 group"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver a la Cartelera
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MoviesShowtimes',
  data() {
    return {
      allShowtimes: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    // Filtra los horarios basados en el movie_id de los parámetros de la ruta
    filteredShowtimes() {
      const movieId = this.$route.params.movieId;
      return this.allShowtimes.filter(s => s.movie_id == movieId);
    },
  },
  mounted() {
    this.fetchShowtimes();
  },
  methods: {
    async fetchShowtimes() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/showtimes`);
        this.allShowtimes = response.data;
      } catch (err) {
        this.error = 'Error al cargar los horarios. Por favor, inténtalo más tarde.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      const options = {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      };
      return date.toLocaleString('es-ES', options);
    },
    goToReserve(showtimeId) {
      // Navega a la vista de reserva con el showtime_id
      this.$router.push({ name: 'Reserve', params: { showtimeId: showtimeId } });
    },
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>