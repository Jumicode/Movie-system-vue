<template>
  <div class="reserve-page-container">
    <div class="grid-layout">
      <div class="seats-section">
        <div class="card-container">
          <div class="card-header">
            <router-link
              v-if="movie"
              :to="{ name: 'Showtimes', params: { movieId: movie.id } }"
              class="back-link"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
              <span>Regresar</span>
            </router-link>
            <div class="available-seats-count">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 17l7-7 7 7" /></svg>
              <span>{{ availableSeats.length }} asientos disponibles</span>
            </div>
          </div>
          <h2 class="section-title">Selecciona tus <span class="highlight-text">asientos</span></h2>

          <div class="legend">
            <div class="legend-item">
              <div class="legend-square occupied"></div>
              <span>Ocupados</span>
            </div>
            <div class="legend-item">
              <div class="legend-square available"></div>
              <span>Disponible</span>
            </div>
            <div class="legend-item">
              <div class="legend-square selected"></div>
              <span>Seleccionados</span>
            </div>
          </div>

          <div class="screen-container">
            <div class="screen-line"></div>
            <p class="screen-text">PANTALLA</p>
          </div>

          <div v-if="loadingSeats" class="loading-message">
            Cargando mapa de asientos...
          </div>
          <div v-else-if="seatError" class="error-message">
            Error al cargar los asientos: {{ seatError }}
          </div>
          <div v-else class="seat-map-grid">
            <div v-for="row in sortedRows" :key="row" class="seat-row">
              <span class="row-label">{{ row }}</span>
              <div class="seats-in-row">
                <button
                  v-for="seat in sortedSeatsByRow(row)"
                  :key="seat.id"
                  :class="getSeatClasses(seat)"
                  :disabled="seat.status === 'occupied'"
                  @click="toggleSeat(seat.id)"
                >
                  {{ seat.number }}
                </button>
              </div>
              <span class="row-label">{{ row }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-section">
        <div class="card-container movie-summary-card">
          <div class="movie-poster-container">
            <img :src="posterUrl" :alt="movieTitle" class="movie-poster" />
          </div>
          <div class="summary-details">
            <h3 class="movie-title">{{ movieTitle }}</h3>
            <div class="details-list">
              <div class="detail-item">
                <span class="detail-label">Fecha</span>
                <span class="detail-value">{{ showtimeDate }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Hora</span>
                <span class="detail-value">{{ showtimeTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Sala</span>
                <span class="detail-value">#{{ showtime ? showtime.hall_id : '' }}</span>
              </div>
            </div>
            
            <div v-if="selectedSeats.length > 0" class="selected-seats-summary">
              <h4 class="summary-title">Asientos Seleccionados</h4>
              <div class="selected-seats-list">
                <span v-for="seatId in selectedSeats" :key="seatId" class="selected-seat-tag">
                  {{ getSeatLabel(seatId) }}
                </span>
              </div>
              <div class="summary-total">
                <span class="total-label">Total ({{ selectedSeats.length }} asientos)</span>
                <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <button
              :disabled="selectedSeats.length === 0"
              :class="continueButtonClasses"
              @click="handleReserve"
            >
              {{ continueButtonText }}
            </button>
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
      if (!path) return 'https://via.placeholder.com/400x600?text=No+Poster';
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
      const baseClasses = 'w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300';
      if (this.selectedSeats.length === 0) {
        return `${baseClasses} bg-gray-700 text-gray-400 cursor-not-allowed`;
      }
      return `${baseClasses} bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25`;
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
          const hallRes = await axios.get(`${process.env.VUE_APP_API_URL}/api/halls/${this.showtime.hall_id}`);
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
      const base = 'w-8 h-8 rounded-lg text-xs font-bold transition-all duration-300';
      if (seat.status === 'occupied') {
        return `${base} bg-gray-600 text-gray-400 cursor-not-allowed`;
      } else if (this.selectedSeats.includes(seat.id)) {
        return `${base} bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-400/25 scale-110`;
      } else {
        return `${base} bg-green-500 hover:bg-green-400 text-white shadow-lg hover:shadow-green-400/25`;
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
        name: 'Checkout', // Usaremos un nombre de ruta para el checkout
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
/* Las clases de Tailwind van aquí para replicar el diseño de tu archivo original. */
.reserve-page-container {
  min-height: 100vh;
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: #0d0d0d;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 96rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

.seats-section, .summary-section {
  grid-column: span 2;
}
@media (max-width: 1024px) {
  .seats-section, .summary-section {
    grid-column: span 1;
  }
}
.summary-section {
  position: sticky;
  top: 1.5rem;
}

.card-container {
  background-color: #1f2937;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link, .available-seats-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
  transition-property: color;
  transition-duration: 0.3s;
}

.back-link:hover, .available-seats-count:hover {
  color: #fcd34d;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 2rem;
}

.highlight-text {
  color: #fcd34d;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
}

.legend-square {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
}
.legend-square.occupied {
  background-color: #4b5563;
}
.legend-square.available {
  background-color: #10b981;
}
.legend-square.selected {
  background-image: linear-gradient(to right, #fcd34d, #f97316);
}

.screen-container {
  margin-bottom: 3rem;
}

.screen-line {
  background-image: linear-gradient(to right, transparent, #d1d5db, transparent);
  height: 0.25rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.screen-text {
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
}

.seat-map-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.seat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.row-label {
  width: 1.5rem;
  text-align: center;
  color: #9ca3af;
  font-weight: bold;
  font-size: 0.875rem;
}

.seats-in-row {
  display: flex;
  gap: 0.25rem;
}

.seats-in-row button {
  width: 2rem;
  height: 2rem;
}
.movie-summary-card {
  overflow: hidden;
}

.movie-poster-container {
  position: relative;
  aspect-ratio: 3 / 2;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-details {
  padding: 1.5rem;
}

.movie-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.5rem;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #9ca3af;
  font-weight: 500;
}

.detail-value {
  color: #fff;
  font-weight: 600;
}

.selected-seats-summary {
  background-color: #1f293780;
  border-radius: 1.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.summary-title {
  color: #fff;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.selected-seats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-seat-tag {
  background-image: linear-gradient(to right, #fcd34d, #f97316);
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 0.875rem;
}

.summary-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  color: #9ca3af;
}

.total-price {
  color: #fff;
  font-weight: bold;
  font-size: 1.125rem;
}
</style>