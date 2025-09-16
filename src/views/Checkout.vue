<template>
  <div class="checkout-page-container">
    <div class="checkout-grid-layout">
      <div class="payment-form-section">
        <div class="payment-card">
          <div class="payment-header">
            <h2 class="payment-title">Tarjeta de Crédito</h2>
            <router-link :to="{ name: 'Reserve', params: { showtimeId: showtimeId } }" class="back-link">
              ← Volver
            </router-link>
          </div>

          <form @submit.prevent="handlePayment" class="payment-form">
            <div class="form-row">
              <div class="doc-type-field">
                <label class="form-label">Cédula</label>
                <select v-model="form.docType" class="form-select">
                  <option>V</option>
                  <option>E</option>
                </select>
              </div>
              <div class="doc-number-field">
                <label class="form-label">Número</label>
                <input v-model="form.docNumber" class="form-input" />
              </div>
            </div>

            <div>
              <label class="form-label">Número de tarjeta</label>
              <input v-model="form.cardNumber" maxlength="19" placeholder="•••• •••• •••• ••••" class="form-input-lg" />
            </div>

            <div class="form-row-compact">
              <div class="exp-month-field">
                <label class="form-label">Mes</label>
                <select v-model="form.expMonth" class="form-select">
                  <option value="">MM</option>
                  <option v-for="m in 12" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
                </select>
              </div>
              <div class="exp-year-field">
                <label class="form-label">Año</label>
                <select v-model="form.expYear" class="form-select">
                  <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
              <div class="cvv-field">
                <label class="form-label">CVV</label>
                <input v-model="form.cvv" maxlength="4" class="form-input" />
              </div>
            </div>

            <div>
              <label class="form-label">Nombre del titular</label>
              <input v-model="form.holderName" class="form-input-lg" />
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="loading"
                :class="paymentButtonClasses"
              >
                {{ buttonText }}
              </button>
            </div>
          </form>

          <div :class="statusMessageClasses">{{ statusMessage }}</div>
        </div>
      </div>

      <aside class="summary-section">
        <div class="summary-card">
          <h3 class="summary-title">Resumen de compra</h3>
          <div class="summary-details">
            <div class="summary-item"><strong>Película:</strong> <span>{{ movieTitle }}</span></div>
            <div class="summary-item"><strong>Sala:</strong> <span>{{ hallName }}</span></div>
            <div class="summary-item"><strong>Función:</strong> <span>{{ showtimeDate }}</span></div>
            <div class="summary-item"><strong>Asientos:</strong> <span>{{ seatLabels }}</span></div>
            <div class="price-details">
              <div class="price-item"><span>Subtotal</span><span>${{ subtotal.toFixed(2) }}</span></div>
              <div class="price-item"><span>IVA</span><span>${{ iva.toFixed(2) }}</span></div>
              <div class="total-price-item"><span>Total</span><span>${{ total.toFixed(2) }}</span></div>
            </div>
          </div>
        </div>
      </aside>
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
      return this.showtime?.hall?.name || `ID ${this.showtime?.hall_id}` || 'Cargando...';
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
      return 2.5; // Definido aquí para Vue
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
      return 'Confirmar pago';
    },
    paymentButtonClasses() {
      const base = 'w-full py-4 rounded-xl font-bold transition-all duration-300';
      if (this.submitting || this.loading) {
        return `${base} bg-gray-700 text-gray-400 cursor-not-allowed`;
      }
      return `${base} bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-95`;
    },
    statusMessageClasses() {
      return {
        'mt-6': true,
        'text-center': true,
        'text-sm': true,
        'text-red-400': this.error,
        'text-gray-300': !this.error,
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
    async handlePayment() {
      this.submitting = true;
      this.error = null;
      this.statusMessage = 'Procesando pago...';

      // Validación básica del formulario
      if (!this.form.cardNumber || !this.form.cvv || !this.form.holderName) {
        this.error = 'Por favor, completa todos los campos de la tarjeta.';
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
        await new Promise(r => setTimeout(r, 700)); // Simula un retraso de la red

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
          this.statusMessage = 'Pago confirmado. Redirigiendo a tus reservas...';
          setTimeout(() => {
            this.$router.push('/my-reservations');
          }, 1500);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error al procesar el pago. Por favor, revisa tus datos o inténtalo más tarde.';
        this.error = true;
        this.statusMessage = errorMessage;
        console.error('Payment error:', err);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>

</style>