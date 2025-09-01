// pages/signup.vue
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 p-6">
     <div class="w-full max-w-md">
        <div class="flex justify-center mb-8">
            <NuxtLink to="/" class="flex items-center space-x-2">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.25 9.2l1.356.582a1 1 0 11-.788 1.84l-2-.857a1 1 0 01-.62-.859V8.5a1 1 0 01-.356-.257L2.394 6.921a1 1 0 000-1.84l7-3zM10 5.5a1 1 0 100-2 1 1 0 000 2z"/>
                </svg>
                </div>
                <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                LetsGoMakkah
                </h1>
            </NuxtLink>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-2xl">
            <h2 class="text-3xl font-semibold text-center text-slate-700 mb-2">Create Your Account</h2>
            <p class="text-center text-slate-500 mb-8">Join us to plan your sacred journey.</p>

            <form @submit.prevent="handleSignup">
                <div class="mb-5">
                    <label for="fullName" class="block mb-2 text-sm font-medium text-slate-600">Full Name</label>
                    <input type="text" id="fullName" v_model="fullName" class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3 placeholder-slate-400" placeholder="Your Name" required>
                </div>
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-slate-600">Email Address</label>
                    <input type="email" id="email" v_model="email" class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3 placeholder-slate-400" placeholder="you@example.com" required>
                </div>
                <div class="mb-8">
                    <label for="password" class="block mb-2 text-sm font-medium text-slate-600">Password</label>
                    <input type="password" id="password" v_model="password" class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3 placeholder-slate-400" placeholder="••••••••" required>
                </div>
                <button type="submit" class="w-full text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-all duration-300 hover:shadow-lg">
                    Create Account
                </button>
            </form>

            <p class="text-sm text-center text-slate-500 mt-8">
                Already have an account?
                <NuxtLink to="/login" class="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                Login
                </NuxtLink>
            </p>
        </div>
        <p class="text-xs text-center text-slate-400 mt-8">© {{ new Date().getFullYear() }} LetsGoMakkah. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fullName = ref('');
const email = ref('');
const password = ref('');

useHead({
  title: 'Sign Up - LetsGoMakkah'
});

// Optional: Add PostHog tracking for signup page view
const { $clientPosthog } = useNuxtApp();
onMounted(() => {
  $clientPosthog?.capture('signup_page_viewed', {
    page: 'signup',
    timestamp: new Date().toISOString(),
  });
});

function handleSignup() {
  // Implement your signup logic here
  console.log('Signup attempt with:', fullName.value, email.value, password.value);
  // Example PostHog event for signup attempt
  $clientPosthog?.capture('signup_attempted', {
    email: email.value, // Be mindful of PII
    method: 'form_submission'
  });
  // After successful signup, you might log them in and navigate
  // navigateTo('/dashboard');
}
</script>

<style scoped>
/* Add any page-specific styles here */
</style>