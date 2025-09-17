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

    <div class="relative z-10 min-h-screen py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12 animate-fade-in">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent animate-slide-up animate-glow">
            Reserva tus Asientos
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-cinema-600 to-cinema-400 mx-auto rounded-full animate-shimmer"></div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Seats Section -->
          <div class="xl:col-span-2">
            <div class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
              <!-- Header with back link and available seats -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <router-link
                  v-if="movie"
                  :to="{ name: 'Showtimes', params: { movieId: movie.id } }"
                  class="inline-flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg border border-dark-700 hover:border-dark-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 group"
                >
                  <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  <span>Regresar</span>
                </router-link>
                
                <div class="flex items-center gap-2 bg-cinema-900/30 px-4 py-2 rounded-lg border border-cinema-700/50 animate-glow">
                  <svg class="w-5 h-5 text-cinema-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-cinema-300 font-medium">{{ availableSeats.length }} asientos disponibles</span>
                </div>
              </div>

              <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">
                Selecciona tus <span class="bg-gradient-to-r from-cinema-400 to-cinema-300 bg-clip-text text-transparent">asientos</span>
              </h2>

              <!-- Legend -->
              <div class="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-red-600 rounded-lg shadow-lg"></div>
                  <span class="text-gray-300 text-sm font-medium">Ocupados</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-green-500 rounded-lg shadow-lg"></div>
                  <span class="text-gray-300 text-sm font-medium">Disponible</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-gradient-to-r from-cinema-400 to-cinema-500 rounded-lg shadow-lg animate-glow"></div>
                  <span class="text-gray-300 text-sm font-medium">Seleccionados</span>
                </div>
              </div>

              <!-- Screen -->
              <div class="text-center mb-8 animate-slide-up" style="animation-delay: 0.2s">
                <div class="relative">
                  <div class="h-2 bg-gradient-to-r from-transparent via-cinema-400 to-transparent rounded-full mb-2 animate-glow"></div>
                  <p class="text-cinema-300 text-sm font-bold tracking-widest">PANTALLA</p>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loadingSeats" class="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div class="relative">
                  <div class="animate-spin rounded-full h-16 w-16 border-4 border-cinema-400 border-t-transparent animate-glow"></div>
                  <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cinema-400 opacity-20"></div>
                </div>
                <p class="text-gray-400 text-lg mt-6 animate-pulse">Cargando mapa de asientos...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="seatError" class="text-center py-20 animate-scale-in">
                <div class="bg-red-900/20 border border-red-800 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
                  <div class="animate-bounce mb-4">
                    <svg class="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-red-400 mb-2">Error al cargar</h3>
                  <p class="text-red-300">{{ seatError }}</p>
                </div>
              </div>

              <!-- Seat Map -->
              <div v-else class="space-y-3 animate-fade-in">
                <div 
                  v-for="(row, index) in sortedRows" 
                  :key="row" 
                  class="flex items-center justify-center gap-2 animate-slide-up"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <span class="w-8 text-center text-cinema-400 font-bold text-sm">{{ row }}</span>
                  <div class="flex gap-1">
                    <button
                      v-for="seat in sortedSeatsByRow(row)"
                      :key="seat.id"
                      :class="getSeatClasses(seat)"
                      :disabled="seat.status === 'occupied'"
                      @click="toggleSeat(seat.id)"
                      class="transform transition-all duration-300 hover:scale-110"
                    >
                      {{ seat.number }}
                    </button>
                  </div>
                  <span class="w-8 text-center text-cinema-400 font-bold text-sm">{{ row }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Section -->
          <div class="xl:col-span-1">
            <div class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-2xl p-6 shadow-2xl sticky top-8 animate-slide-up" style="animation-delay: 0.3s">
              <!-- Movie Poster -->
              <div class="relative mb-6 animate-scale-in">
                <div class="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    :src="posterUrl" 
                    :alt="movieTitle" 
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
              </div>

              <!-- Movie Details -->
              <div class="space-y-4 mb-6">
                <h3 class="text-xl font-bold text-gray-100 text-center">{{ movieTitle }}</h3>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <span class="text-gray-400 font-medium">Fecha</span>
                    <span class="text-cinema-300 font-semibold">{{ showtimeDate }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <span class="text-gray-400 font-medium">Hora</span>
                    <span class="text-cinema-300 font-semibold">{{ showtimeTime }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                    <span class="text-gray-400 font-medium">Sala</span>
                    <span class="text-cinema-300 font-semibold">#{{ showtime ? showtime.hall_id : '' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Selected Seats Summary -->
              <div v-if="selectedSeats.length > 0" class="mb-6 animate-scale-in">
                <h4 class="text-lg font-semibold mb-3 text-cinema-300">Asientos Seleccionados</h4>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span 
                    v-for="seatId in selectedSeats" 
                    :key="seatId" 
                    class="bg-gradient-to-r from-cinema-600 to-cinema-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-glow"
                  >
                    {{ getSeatLabel(seatId) }}
                  </span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-cinema-900/30 to-cinema-800/30 rounded-xl border border-cinema-700/50">
                  <span class="text-gray-300 font-medium">Total ({{ selectedSeats.length }} asientos)</span>
                  <span class="text-2xl font-bold text-cinema-300">${{ totalPrice.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Continue Button -->
              <button
                :disabled="selectedSeats.length === 0"
                :class="continueButtonClasses"
                @click="handleReserve"
                class="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:ring-opacity-50"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg v-if="selectedSeats.length > 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                  {{ continueButtonText }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { authStore } from '../store/auth';

export default {
  name: 'MovieReserve',
  data() {
    return {
      showtime: null,
      movie: null,
      seats: [],
      selectedSeats: [],
      loadingSeats: true,
      seatError: null,
      pricePerSeat: 2.5,
    };
  },
  computed: {
    showtimeId() {
      return this.$route.params.showtimeId;
    },
    posterUrl() {
      const path = this.movie ? this.movie.poster_path || this.movie.poster : null;
      if (!path) return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop';
      if (path.startsWith('http')) return path;
      return `${import.meta.env.VITE_API_URL}/storage/${path}`;
    },
    movieTitle() {
      return this.movie ? this.movie.title : 'Cargando...';
    },
    showtimeDate() {
      return this.showtime ? new Date(this.showtime.starts_at).toLocaleDateString('es-ES') : 'Cargando...';
    },
    showtimeTime() {
      return this.showtime ? new Date(this.showtime.starts_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Cargando...';
    },
    sortedRows() {
      return [...new Set(this.seats.map(s => s.row))].sort((a, b) => {
        if (!isNaN(a) && !isNaN(b)) return Number(a) - Number(b);
        return String(a).localeCompare(String(b));
      });
    },
    totalPrice() {
      return this.selectedSeats.length * this.pricePerSeat;
    },
    availableSeats() {
      return this.seats.filter(seat => seat.status === 'available');
    },
    continueButtonText() {
      return this.selectedSeats.length > 0 ? 'Continuar con la compra' : 'Selecciona tus asientos';
    },
    continueButtonClasses() {
      if (this.selectedSeats.length === 0) {
        return 'bg-dark-800 text-gray-500 cursor-not-allowed';
      }
      return 'bg-gradient-to-r from-cinema-600 to-cinema-500 hover:from-cinema-700 hover:to-cinema-600 text-white shadow-lg hover:shadow-xl animate-glow';
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loadingSeats = true;
      try {
        const [showtimeRes, reservedSeatsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/showtimes/${this.showtimeId}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/showtimes/${this.showtimeId}/reserved-seats`),
        ]);
        
        this.showtime = showtimeRes.data;
        this.movie = showtimeRes.data.movie || null;
        
        // Obtener asientos de la sala
        let allSeats = [];
        if (this.showtime.hall && this.showtime.hall.seats) {
          allSeats = this.showtime.hall.seats;
        } else {
          const hallRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/halls/${this.showtime.hall_id}`);
          allSeats = hallRes.data.seats || [];
        }

        const reservedSeatIds = reservedSeatsRes.data;
        
        this.seats = allSeats.map(seat => ({
          ...seat,
          status: reservedSeatIds.includes(seat.id) ? 'occupied' : 'available'
        }));

      } catch (err) {
        this.seatError = 'Error al cargar la información. Por favor, inténtalo de nuevo.';
        console.error('Error fetching data:', err);
      } finally {
        this.loadingSeats = false;
      }
    },
    sortedSeatsByRow(row) {
      return this.seats
        .filter(s => s.row === row)
        .sort((a, b) => Number(a.number) - Number(b.number));
    },
    getSeatClasses(seat) {
      const base = 'w-8 h-8 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg';
      if (seat.status === 'occupied') {
        return `${base} bg-red-600 text-red-200 cursor-not-allowed opacity-60`;
      } else if (this.selectedSeats.includes(seat.id)) {
        return `${base} bg-gradient-to-r from-cinema-400 to-cinema-500 text-white shadow-cinema-400/50 animate-glow`;
      } else {
        return `${base} bg-green-500 hover:bg-green-400 text-white shadow-green-400/25 hover:shadow-green-400/50 hover:animate-glow`;
      }
    },
    toggleSeat(seatId) {
      const index = this.selectedSeats.indexOf(seatId);
      if (index > -1) {
        this.selectedSeats.splice(index, 1);
      } else {
        this.selectedSeats.push(seatId);
      }
    },
    getSeatLabel(seatId) {
      const seat = this.seats.find(s => s.id === seatId);
      return seat ? `${seat.row}${seat.number}` : '';
    },
    handleReserve() {
      // Verificar si el usuario está logueado
      if (!authStore.isLoggedIn) {
        alert('Necesitas iniciar sesión para continuar con tu reserva.');
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      const seatsParam = this.selectedSeats.join(',');
      this.$router.push({
        name: 'Checkout',
        query: {
          showtime_id: this.showtimeId,
          seats: seatsParam,
        }
      });
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