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

    <!-- Confetti Animation -->
    <div v-if="showConfetti" class="confetti-container">
      <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
      >
        <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div class="bg-dark-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-dark-700 animate-bounce">
            <div class="mb-6">
              <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-green-400 mb-4">¡Reserva Confirmada!</h3>
            <p class="text-gray-300 mb-6">Tu pago ha sido procesado exitosamente. Disfruta de la función.</p>
            <div class="bg-dark-800 rounded-xl p-4 mb-6">
              <p class="text-sm text-gray-400 mb-2">Código de reserva:</p>
              <p class="text-lg font-mono text-cinema-400 font-bold">{{ reservationCode }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="relative z-10 min-h-screen py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12 animate-fade-in">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent animate-slide-up animate-glow">
            Finalizar Reserva
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-cinema-600 to-cinema-400 mx-auto rounded-full animate-shimmer"></div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Payment Form Section -->
          <div class="xl:col-span-2">
            <div class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-2xl p-8 shadow-2xl animate-slide-up">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cinema-400 to-cinema-300 bg-clip-text text-transparent">
                  Información de Pago
                </h2>
                <router-link 
                  :to="{ name: 'Reserve', params: { showtimeId: showtimeId } }" 
                  class="inline-flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg border border-dark-700 hover:border-dark-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 group"
                >
                  <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Volver
                </router-link>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div class="relative">
                  <div class="animate-spin rounded-full h-16 w-16 border-4 border-cinema-400 border-t-transparent animate-glow"></div>
                  <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cinema-400 opacity-20"></div>
                </div>
                <p class="text-gray-400 text-lg mt-6 animate-pulse">Cargando información de la reserva...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error && !showSuccessModal" class="text-center py-20 animate-scale-in">
                <div class="bg-red-900/20 border border-red-800 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
                  <div class="animate-bounce mb-4">
                    <svg class="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-red-400 mb-2">Error</h3>
                  <p class="text-red-300">{{ error }}</p>
                </div>
              </div>

              <!-- Payment Form -->
              <form v-else @submit.prevent="handlePayment" class="space-y-6 animate-fade-in">
                <!-- Document Info -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Documento</label>
                    <select v-model="form.docType" class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200">
                      <option value="V">V - Venezolano</option>
                      <option value="E">E - Extranjero</option>
                    </select>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Número de Documento</label>
                    <input 
                      v-model="form.docNumber" 
                      type="text" 
                      placeholder="Ingresa tu número de cédula"
                      class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <!-- Card Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Número de Tarjeta</label>
                  <input 
                    v-model="form.cardNumber" 
                    type="text" 
                    maxlength="19" 
                    placeholder="•••• •••• •••• ••••"
                    @input="formatCardNumber"
                    class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200 text-lg font-mono"
                  />
                </div>

                <!-- Expiry and CVV -->
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Mes</label>
                    <select v-model="form.expMonth" class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200">
                      <option value="">MM</option>
                      <option v-for="m in 12" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Año</label>
                    <select v-model="form.expYear" class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200">
                      <option value="">YYYY</option>
                      <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                    <input 
                      v-model="form.cvv" 
                      type="text" 
                      maxlength="4" 
                      placeholder="•••"
                      class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200 font-mono"
                    />
                  </div>
                </div>

                <!-- Cardholder Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Titular</label>
                  <input 
                    v-model="form.holderName" 
                    type="text" 
                    placeholder="Nombre como aparece en la tarjeta"
                    class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="submitting || loading"
                  :class="paymentButtonClasses"
                  class="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cinema-400 focus:ring-opacity-50"
                >
                  <span class="flex items-center justify-center gap-2">
                    <svg v-if="submitting" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    {{ buttonText }}
                  </span>
                </button>

                <!-- Status Message -->
                <div v-if="statusMessage" :class="statusMessageClasses" class="text-center p-4 rounded-lg animate-fade-in">
                  {{ statusMessage }}
                </div>
              </form>
            </div>
          </div>

          <!-- Summary Section -->
          <div class="xl:col-span-1">
            <div class="bg-dark-900/70 backdrop-blur-sm border border-dark-800 rounded-2xl p-6 shadow-2xl sticky top-8 animate-slide-up" style="animation-delay: 0.3s">
              <h3 class="text-xl font-bold text-cinema-300 mb-6 text-center">Resumen de Compra</h3>
              
              <div class="space-y-4 mb-6">
                <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                  <span class="text-gray-400 font-medium">Película</span>
                  <span class="text-cinema-300 font-semibold text-right max-w-[60%] truncate">{{ movieTitle }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                  <span class="text-gray-400 font-medium">Sala</span>
                  <span class="text-cinema-300 font-semibold">{{ hallName }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                  <span class="text-gray-400 font-medium">Función</span>
                  <span class="text-cinema-300 font-semibold text-right text-sm">{{ showtimeDate }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                  <span class="text-gray-400 font-medium">Asientos</span>
                  <span class="text-cinema-300 font-semibold">{{ seatLabels }}</span>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="border-t border-dark-700 pt-4 space-y-3">
                <div class="flex items-center justify-between text-gray-300">
                  <span>Subtotal ({{ seats.length }} asientos)</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex items-center justify-between text-gray-300">
                  <span>IVA (16%)</span>
                  <span>${{ iva.toFixed(2) }}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-cinema-900/30 to-cinema-800/30 rounded-xl border border-cinema-700/50 text-lg font-bold">
                  <span class="text-gray-100">Total</span>
                  <span class="text-cinema-300">${{ total.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Security Badge -->
              <div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Pago seguro y encriptado</span>
              </div>
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
  name: 'UserCheckout',
  data() {
    return {
      // Datos de la función y asientos
      showtime: null,
      seats: [],
      // Datos del formulario
      form: {
        docType: 'V',
        docNumber: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        holderName: '',
      },
      // Estado de la UI
      loading: true,
      submitting: false,
      error: null,
      statusMessage: '',
      showConfetti: false,
      showSuccessModal: false,
      reservationCode: '',
    };
  },
  computed: {
    showtimeId() {
      return this.$route.query.showtime_id;
    },
    seatIds() {
      const seats = this.$route.query.seats;
      return seats ? seats.split(',').map(s => Number(s)) : [];
    },
    movieTitle() {
      return this.showtime?.movie?.title || 'Cargando...';
    },
    hallName() {
      return this.showtime?.hall?.name || `Sala #${this.showtime?.hall_id}` || 'Cargando...';
    },
    showtimeDate() {
      if (!this.showtime) return 'Cargando...';
      const date = new Date(this.showtime.starts_at);
      return date.toLocaleString('es-ES');
    },
    seatLabels() {
      return this.seats.length > 0 ? this.seats.map(s => `${s.row}${s.number}`).join(', ') : 'No hay asientos seleccionados';
    },
    pricePerSeat() {
      return 2.5;
    },
    subtotal() {
      return this.seats.length * this.pricePerSeat;
    },
    iva() {
      return parseFloat((this.subtotal * 0.16).toFixed(2));
    },
    total() {
      return parseFloat((this.subtotal + this.iva).toFixed(2));
    },
    availableYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = 0; i < 12; i++) {
        years.push(currentYear + i);
      }
      return years;
    },
    buttonText() {
      if (this.submitting) return 'Procesando pago...';
      return 'Confirmar Pago';
    },
    paymentButtonClasses() {
      if (this.submitting || this.loading) {
        return 'bg-dark-800 text-gray-500 cursor-not-allowed';
      }
      return 'bg-gradient-to-r from-cinema-600 to-cinema-500 hover:from-cinema-700 hover:to-cinema-600 text-white shadow-lg hover:shadow-xl animate-glow';
    },
    statusMessageClasses() {
      return {
        'bg-red-900/20 border border-red-800 text-red-300': this.error,
        'bg-green-900/20 border border-green-800 text-green-300': !this.error && this.statusMessage,
      };
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        if (!this.showtimeId || this.seatIds.length === 0) {
          this.error = 'No se encontraron datos para la reserva. Vuelve a la página de selección de asientos.';
          this.loading = false;
          return;
        }

        const showtimeRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/showtimes/${this.showtimeId}`);
        this.showtime = showtimeRes.data;

        // Filtrar solo los asientos seleccionados de la lista de asientos de la sala
        const allSeats = this.showtime?.hall?.seats || [];
        this.seats = allSeats.filter(seat => this.seatIds.includes(seat.id));

      } catch (err) {
        this.error = 'Error al cargar la información de la función. Por favor, inténtalo de nuevo.';
        console.error('Error fetching checkout data:', err);
      } finally {
        this.loading = false;
      }
    },
    formatCardNumber() {
      // Remove all non-digit characters
      let value = this.form.cardNumber.replace(/\D/g, '');
      // Add spaces every 4 digits
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.form.cardNumber = value;
    },
    async handlePayment() {
      this.submitting = true;
      this.error = null;
      this.statusMessage = 'Procesando pago...';

      // Validación básica del formulario
      if (!this.form.cardNumber || !this.form.cvv || !this.form.holderName || !this.form.docNumber) {
        this.error = 'Por favor, completa todos los campos requeridos.';
        this.statusMessage = '';
        this.submitting = false;
        return;
      }

      if (!authStore.isLoggedIn) {
        this.error = 'Necesitas iniciar sesión para completar la reserva.';
        this.submitting = false;
        this.statusMessage = '';
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      try {
        await new Promise(r => setTimeout(r, 2000)); // Simula procesamiento

        const payload = {
          user_id: authStore.user.id,
          showtime_id: Number(this.showtimeId),
          seats: this.seatIds,
          price: this.total,
        };
        
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reservations`, payload, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
          },
        });

        if (response.status === 201) {
          // Generate reservation code
          this.reservationCode = `CIN-${Date.now().toString().slice(-6)}`;
          
          // Show confetti animation
          this.showConfetti = true;
          
          // Show success modal after a short delay
          setTimeout(() => {
            this.showSuccessModal = true;
          }, 500);

          // Hide confetti after animation
          setTimeout(() => {
            this.showConfetti = false;
          }, 3000);

          // Redirect after showing success
          setTimeout(() => {
            this.$router.push('/my-reservations');
          }, 5000);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error al procesar el pago. Por favor, revisa tus datos o inténtalo más tarde.';
        this.error = errorMessage;
        this.statusMessage = '';
        console.error('Payment error:', err);
      } finally {
        this.submitting = false;
      }
    },
    getConfettiStyle(index) {
      const colors = ['#eab308', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
      const color = colors[index % colors.length];
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const animationDuration = 3 + Math.random() * 2;
      
      return {
        backgroundColor: color,
        left: `${left}%`,
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`,
      };
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

/* Confetti Animation */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Additional animations for confetti variations */
.confetti:nth-child(odd) {
  width: 8px;
  height: 8px;
  animation-name: confetti-fall-left;
}

.confetti:nth-child(even) {
  width: 6px;
  height: 12px;
  animation-name: confetti-fall-right;
}

@keyframes confetti-fall-left {
  0% {
    transform: translateY(-100vh) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(-100px) rotate(720deg);
    opacity: 0;
  }
}

@keyframes confetti-fall-right {
  0% {
    transform: translateY(-100vh) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(100px) rotate(720deg);
    opacity: 0;
  }
}
</style>