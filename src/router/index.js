import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '@/components/Login.vue';
import Register from '../components/Register.vue';
import Showtimes from '@/views/Showtimes.vue';
import Reserve from '@/views/Reserve.vue';
import Halls from '@/views/Halls.vue';
import Checkout from '@/views/Checkout.vue';
import MyReservations from '@/views/MyReservations.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/showtimes/:movieId',
    name: 'Showtimes',
    component: Showtimes,
  },
   {
     path: '/reserve/:showtimeId',
     name: 'Reserve',
    component: Reserve,
 },
   {
    // Nueva ruta para la vista de salas
    path: '/halls',
    name: 'Halls',
    component: Halls,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
  },
  {
    path: '/my-reservations',
    name: 'MyReservations',
    component: MyReservations,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;