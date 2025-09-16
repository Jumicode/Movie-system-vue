<template>
  <div class="my-reservations-container">
    <div class="header-container">
      <router-link to="/" class="home-button">Ir al inicio</router-link>
    </div>
    <h1 class="page-title">Mis Reservas</h1>
    
    <div v-if="loading" class="loading-message">
      Cargando reservas...
    </div>
    <div v-else-if="reservations.length === 0" class="no-reservations">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-else>
        No hay reservas.
        <br>
        <router-link to="/" class="underline text-yellow-400">¡Reserva tu entrada ahora!</router-link>
      </div>
    </div>
    <div v-else class="reservations-grid">
      <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
        <div class="card-content">
          <div class="card-info">
           
            <h3 class="movie-title">{{ reservation.showtime?.movie?.title || 'Película' }}</h3>
            <div class="seats-info">Asientos: <strong>{{ formatSeats(reservation.seats) }}</strong></div>
            <div class="price-info">Precio: <strong>${{ Number(reservation.price).toFixed(2) }}</strong></div>
            <div class="created-info">Creada: {{ formatDate(reservation.created_at) }}</div>
          </div>
          <div class="qr-container">
            <div v-if="reservation.qr_code" class="qr-code">
              <img
                :src="getQrCodeUrl(reservation.qr_code)"
                :alt="`Código QR para la reserva ${reservation.id}`"
                class="qr-image"
              />
              <a href="#" @click.prevent="downloadQr(reservation)" class="download-link">Descargar</a>
            </div>
            <div v-else class="no-qr-message">QR no disponible</div>
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
  data() {
    return {
      reservations: [],
      loading: true,
      error: null,
    };
  },
  async mounted() {
    await this.fetchReservations();
  },
  methods: {
  async fetchReservations() {
    this.loading = true;
    this.error = null;

    if (!authStore.isLoggedIn) {
      this.error = 'No has iniciado sesión. Por favor, inicia sesión para ver tus reservas.';
      this.loading = false;
      return;
    }

    const userId = authStore.user.id;
    const token = authStore.token;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { 
          user_id: userId,
          // Agrega este parámetro para cargar las relaciones
          with: 'showtime.movie' 
        }
      });

      this.reservations = response.data.data || response.data.reservations || response.data;

    } catch (err) {
      console.error('Error fetching reservations:', err.response?.data?.message || err.message);
      this.error = 'Error al cargar las reservas. Inténtalo de nuevo más tarde.';
    } finally {
      this.loading = false;
    }
  },
    formatSeats(seats) {
      if (!seats || seats.length === 0) return '-';
      return seats.map(s => s.code || (s.row && s.number ? s.row + s.number : s.id)).join(', ');
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    getQrCodeUrl(qrData) {
      // Función para generar la URL del código QR a partir de la cadena SVG
      if (typeof qrData !== 'string') return '';
      if (qrData.startsWith('<svg')) {
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(qrData);
      }
      return 'data:image/svg+xml;base64,' + qrData;
    },
    downloadQr(reservation) {
      if (!reservation.qr_code) {
        alert('QR no disponible para descargar');
        return;
      }
      
      const url = this.getQrCodeUrl(reservation.qr_code);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${reservation.id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
/* Las clases de Tailwind van aquí para replicar el diseño de tu archivo original. */

</style>