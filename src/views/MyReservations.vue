<template>
  <div class="min-h-screen bg-dark-950 text-gray-100 relative overflow-hidden py-12 px-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center mb-12 animate-fade-in">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:ring-opacity-50 group"
      >
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Ir al inicio
      </router-link>
      <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent">
        Mis Reservas
      </h1>
      <div></div>
    </div>
    
    <div class="max-w-7xl mx-auto">
      <div v-if="loading" class="text-center text-xl text-gray-400 animate-pulse py-20">
        Cargando reservas...
      </div>
      <div v-else-if="reservations.length === 0" class="text-center py-20 animate-fade-in">
        <div class="bg-dark-900/50 border border-dark-700 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <div v-if="error" class="text-red-400 text-lg mb-4">
            {{ error }}
          </div>
          <div v-else class="text-gray-300 text-lg">
            No hay reservas.
            <br />
            <router-link to="/" class="underline text-cinema-400 hover:text-cinema-300 transition-colors duration-200">
              ¡Reserva tu entrada ahora!
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <div
          v-for="reservation in reservations"
          :key="reservation.id"
          class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-dark-800/70 hover:border-dark-700 animate-slide-up"
        >
          <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-xl font-bold text-cinema-300 mb-2 truncate">
                {{ reservation.showtime?.movie?.title || 'Película' }}
              </h3>
              <div class="text-gray-400 text-sm">
                <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h-4v-4h4v4zm0 0l2 2m-2-2v2m0 0l2 2m-2-2h-4v-4h4v4zm0 0l2 2m-2-2v2m0 0l2 2"/>
                  </svg>
                  <span>Asientos: <strong class="text-gray-300">{{ formatSeats(reservation.seats) }}</strong></span>
                </div>
                <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3s-3-1.343-3-3s1.343-3 3-3zm0 0v-4m0 0a9 9 0 019 9h-4m-5-5a9 9 0 01-9 9h4"/>
                  </svg>
                  <span>Precio: <strong class="text-cinema-400">${{ Number(reservation.price).toFixed(2) }}</strong></span>
                </div>
                <div class="flex items-center justify-center sm:justify-start gap-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Creada: <strong class="text-gray-300">{{ formatDate(reservation.created_at) }}</strong></span>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <div v-if="reservation.qr_code" class="p-2 bg-white rounded-lg shadow-md mb-2">
                <img
                  :src="getQrCodeUrl(reservation.qr_code)"
                  :alt="`Código QR para la reserva ${reservation.id}`"
                  class="w-24 h-24"
                />
              </div>
              <div v-else class="text-sm text-gray-400 py-6">
                QR no disponible
              </div>
              <a
                v-if="reservation.qr_code"
                href="#"
                @click.prevent="downloadQr(reservation)"
                class="inline-flex items-center gap-2 text-cinema-400 hover:text-cinema-300 text-sm font-medium transition-colors duration-200 group"
              >
                <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Descargar</span>
              </a>
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
/* ¡Estilos movidos a las clases de Tailwind! */
</style>