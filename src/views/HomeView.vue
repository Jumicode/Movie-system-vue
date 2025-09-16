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
    
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background with overlay -->
      <div class="absolute inset-0 hero-gradient"></div>
      <div 
        class="absolute inset-0 opacity-5"
        style="background-image: url('https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'); background-size: cover; background-position: center;"
      ></div>
      
      <!-- Additional animated overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-cinema-900/20 via-transparent to-cinema-900/20 animate-pulse-subtle"></div>
      
      <!-- Hero Content -->
      <div class="relative z-10 text-center px-4 animate-fade-in">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cinema-400 via-cinema-300 to-cinema-400 bg-clip-text text-transparent animate-slide-up animate-glow">
          Vive la Magia del Cine
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style="animation-delay: 0.2s">
          Descubre las mejores películas y vive experiencias cinematográficas inolvidables
        </p>
        <a 
          href="#cartelera" 
          class="btn-primary inline-flex items-center space-x-2 text-lg animate-slide-up animate-float" 
          style="animation-delay: 0.4s"
        >
          <span>Explorar Cartelera</span>
          <svg class="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce animate-twinkle">
        <svg class="w-6 h-6 text-cinema-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>

    <!-- Movies Section -->
    <section id="cartelera" class="py-20 px-4 bg-gradient-to-b from-dark-950 to-dark-900 relative">
      <!-- Background shimmer effect -->
      <div class="absolute inset-0 shimmer opacity-30"></div>
      
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16 animate-fade-in">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cinema-400 to-cinema-300 bg-clip-text text-transparent">
            Películas Destacadas
          </h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Explora nuestra selección de las mejores películas en cartelera
          </p>
        </div>

        <!-- Genre Filters -->
        <div class="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          <button
            v-for="genre in genres"
            :key="genre"
            @click="applyFilter(genre)"
            :class="['btn-filter', { 'active': selectedGenre === genre }]"
            class="transform transition-all duration-200 hover:scale-105 hover:animate-glow"
          >
            {{ genre === 'all' ? 'Todas' : genre }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cinema-400 animate-glow"></div>
            <span class="text-gray-400 text-lg">Cargando películas...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="bg-red-900/20 border border-red-800 rounded-lg p-8 max-w-md mx-auto animate-scale-in">
            <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-400 text-lg">{{ error }}</p>
          </div>
        </div>

        <!-- Movies Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
          <div 
            v-for="(movie, index) in filteredMovies" 
            :key="movie.id"
            class="movie-card animate-scale-in hover:animate-float"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- Movie Poster -->
            <div class="relative aspect-[2/3] overflow-hidden">
              <img 
                :src="getPosterUrl(movie.poster_path)" 
                :alt="movie.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Play button overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button 
                  @click="openModal(movie)"
                  class="bg-cinema-600 hover:bg-cinema-500 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 animate-glow"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Movie Info -->
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2 text-gray-100 line-clamp-2 hover:text-cinema-400 transition-colors duration-200">
                {{ movie.title }}
              </h3>
              <p class="text-cinema-400 text-sm mb-3 font-medium">
                {{ movie.genre }}
              </p>
              <button 
                @click="openModal(movie)"
                class="w-full btn-secondary text-sm py-2"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Movie Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-content animate-scale-in">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 class="text-2xl font-bold text-gray-100">Detalles de la película</h2>
              <button 
                @click="closeModal"
                class="text-gray-400 hover:text-gray-200 p-2 rounded-lg hover:bg-dark-800 transition-colors duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Modal Content -->
            <div v-if="selectedMovie" class="p-6">
              <div class="flex flex-col md:flex-row gap-6">
                <!-- Movie Poster -->
                <div class="flex-shrink-0">
                  <img 
                    :src="getPosterUrl(selectedMovie.poster_path)" 
                    :alt="selectedMovie.title"
                    class="w-full md:w-64 rounded-lg shadow-lg"
                  />
                </div>
                
                <!-- Movie Details -->
                <div class="flex-1">
                  <h3 class="text-3xl font-bold mb-4 text-gray-100">
                    {{ selectedMovie.title }}
                  </h3>
                  
                  <div class="flex items-center mb-4">
                    <span class="inline-block bg-cinema-600 text-white text-sm px-3 py-1 rounded-full">
                      {{ selectedMovie.genre }}
                    </span>
                  </div>
                  
                  <p class="text-gray-300 leading-relaxed mb-6 text-lg">
                    {{ selectedMovie.description || selectedMovie.synopsis || 'Descripción no disponible.' }}
                  </p>
                  
                  <div class="flex flex-col sm:flex-row gap-3">
                    <button 
                      @click="viewShowtimes"
                      class="btn-primary flex-1 sm:flex-none"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Ver Horarios
                    </button>
                    <button 
                      @click="closeModal"
                      class="btn-secondary flex-1 sm:flex-none"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CinemaCartelera',
  data() {
    return {
      allMovies: [],
      filteredMovies: [],
      genres: [],
      selectedGenre: 'all',
      loading: true,
      error: null,
      showModal: false,
      selectedMovie: null,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies`);
        this.allMovies = response.data;
        
        // Genera la lista de géneros dinámicamente
        const uniqueGenres = [...new Set(this.allMovies.map(m => m.genre).filter(Boolean))];
        this.genres = ['all', ...uniqueGenres];
        
        this.applyFilter('all');
      } catch (err) {
        this.error = 'Error al cargar las películas. Por favor, inténtalo más tarde.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    applyFilter(genre) {
      this.selectedGenre = genre;
      this.filteredMovies = genre === 'all' 
        ? this.allMovies 
        : this.allMovies.filter(movie => movie.genre === genre);
    },
    getPosterUrl(path) {
      if (path && path.startsWith('http')) {
        return path;
      }
      return path ? `${import.meta.env.VITE_API_URL}/storage/${path}` : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop';
    },
    openModal(movie) {
      this.selectedMovie = movie;
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showModal = false;
      this.selectedMovie = null;
      document.body.style.overflow = 'auto';
    },
    viewShowtimes() {
      // Redirige usando Vue Router, pasando el movie_id como un parámetro
      this.$router.push({ name: 'Showtimes', params: { movieId: this.selectedMovie.id } });
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto';
  }
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