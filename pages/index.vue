// pages/index.vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-40"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>

    <!-- Navbar -->
    <header class="relative z-10 flex justify-between items-center px-6 py-5 backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-sm">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.25 9.2l1.356.582a1 1 0 11-.788 1.84l-2-.857a1 1 0 01-.62-.859V8.5a1 1 0 01-.356-.257L2.394 6.921a1 1 0 000-1.84l7-3zM10 5.5a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          LetsGoMakkah
        </h1>
      </div>
      <nav class="flex items-center space-x-6">
        <NuxtLink
          to="/login"
          class="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
          v-posthog-capture="{
            name: 'login_clicked',
            properties: {
              location: 'navbar',
              page: 'home'
            }
          }"
        >
          Login
        </NuxtLink>
        <NuxtLink
          to="/signup"
          class="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
          v-posthog-capture="{
            name: 'signup_clicked',
            properties: {
              location: 'navbar',
              page: 'home',
              button_style: 'primary'
            }
          }"
        >
          Sign Up
        </NuxtLink>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="relative z-10 flex flex-col items-center justify-center text-center py-32 px-4">
      <!-- Floating elements -->
      <div class="absolute top-20 left-1/4 w-4 h-4 bg-emerald-300 rounded-full animate-bounce opacity-60" style="animation-delay: 0.5s;"></div>
      <div class="absolute top-32 right-1/3 w-3 h-3 bg-blue-300 rounded-full animate-bounce opacity-60" style="animation-delay: 1s;"></div>
      <div class="absolute top-40 left-1/3 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-60" style="animation-delay: 1.5s;"></div>

      <!-- Badge -->
      <div class="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 shadow-sm">
        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span class="text-sm font-medium text-slate-600">Trusted by 50,000+ pilgrims</span>
      </div>

      <h2 class="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
        Your Sacred Journey
        <br />
        <span class="text-4xl sm:text-5xl">Starts Here</span>
      </h2>

      <p class="text-xl text-slate-600 max-w-3xl mb-12 leading-relaxed">
        Experience seamless travel planning for Umrah and Hajj. We handle flights, accommodations, and logistics while you focus on your spiritual journey.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          class="group bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg flex items-center space-x-2 hover:scale-105"
          v-posthog-capture="{
            name: 'search_flights_clicked',
            properties: {
              location: 'hero_section',
              button_type: 'cta_primary',
              page: 'home'
            }
          }"
        >
          <span>Search Flights</span>
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>

        <button
          class="group bg-white/80 backdrop-blur-sm text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl hover:bg-white hover:border-emerald-300 transition-all duration-300 font-semibold text-lg hover:scale-105"
          v-posthog-capture="{
            name: 'learn_more_clicked',
            properties: {
              location: 'hero_section',
              button_type: 'cta_secondary',
              page: 'home'
            }
          }"
        >
          <span>Learn More</span>
        </button>
      </div>

      <!-- Features preview -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl">
        <div
          class="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer"
          v-posthog-capture="{
            name: 'feature_card_clicked',
            properties: {
              feature_name: 'smart_flight_search',
              location: 'features_section',
              page: 'home'
            }
          }"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 mb-2">Smart Flight Search</h3>
          <p class="text-slate-600 text-sm">AI-powered booking with best price guarantees</p>
        </div>

        <div
          class="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer"
          v-posthog-capture="{
            name: 'feature_card_clicked',
            properties: {
              feature_name: 'premium_hotels',
              location: 'features_section',
              page: 'home'
            }
          }"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 mb-2">Premium Hotels</h3>
          <p class="text-slate-600 text-sm">Verified accommodations near Haram</p>
        </div>

        <div
          class="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer"
          v-posthog-capture="{
            name: 'feature_card_clicked',
            properties: {
              feature_name: 'spiritual_guidance',
              location: 'features_section',
              page: 'home'
            }
          }"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-800 mb-2">Spiritual Guidance</h3>
          <p class="text-slate-600 text-sm">Expert support for your sacred journey</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 text-center text-slate-500 py-8 backdrop-blur-sm bg-white/30 border-t border-white/20">
      <div class="flex justify-center items-center space-x-2 mb-2">
        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
        <span class="font-medium">© 2025 LetsGoMakkah</span>
        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
      </div>
      <p class="text-sm">Facilitating sacred journeys with love and care</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// PostHog integration for additional tracking
const { $clientPosthog, $serverPosthog } = useNuxtApp();

// Track page view on server side
if (process.server) {
  $serverPosthog?.capture({
    distinctId: 'anonymous-user', // You can replace this with actual user ID when available
    event: 'home_page_viewed',
    properties: {
      page: 'home',
      timestamp: new Date().toISOString(),
      user_agent: process.server ? 'server' : navigator?.userAgent
    }
  });
}

// Track page view on client side when component mounts
onMounted(() => {
  $clientPosthog?.capture('home_page_loaded', {
    page: 'home',
    timestamp: new Date().toISOString(),
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    user_agent: navigator.userAgent,
    referrer: document.referrer
  });

  // Track scroll depth
  let maxScrollDepth = 0;
  const trackScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;

      // Track milestone scroll depths
      if ([25, 50, 75, 90].includes(scrollPercent)) {
        $clientPosthog?.capture('scroll_depth_milestone', {
          scroll_depth: scrollPercent,
          page: 'home'
        });
      }
    }
  };

  window.addEventListener('scroll', trackScrollDepth);

  // Track time spent on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    $clientPosthog?.capture('page_time_spent', {
      time_spent_seconds: timeSpent,
      page: 'home',
      max_scroll_depth: maxScrollDepth
    });
  });
});

// Set page title and meta for SEO
useHead({
  title: 'LetsGoMakkah - Your Sacred Journey Starts Here',
  meta: [
    { name: 'description', content: 'Experience seamless travel planning for Umrah and Hajj. We handle flights, accommodations, and logistics while you focus on your spiritual journey.' }
  ]
});
</script>

<style scoped>
.bg-grid-slate-100 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
}
</style>