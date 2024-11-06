<script setup>
import { onMounted, watch } from 'vue';
import ChatArea from './components/ChatArea.vue';
import ChatList from './components/ChatList.vue';
import LoginView from './views/LoginView.vue';
import { useAuth } from './composables/useAuth';

const { user, loading, isInitialized, checkAuthState, logout } = useAuth();

onMounted(async () => {
  console.log('App mounted, checking auth state...');
  await checkAuthState();
});

const handleLogout = async () => {
  try {
    console.log('Handling logout...');
    await logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Debug watcher
watch(user, (newValue) => {
  console.log('User state changed:', newValue ? 'Logged in' : 'Not logged in');
});

watch(isInitialized, (newValue) => {
  console.log('Auth initialized:', newValue);
});
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <template v-if="!isInitialized || loading">
      <div class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    </template>

    <template v-else>
      <div v-if="!user">
        <LoginView />
      </div>

      <div v-else class="flex flex-col h-screen">
        <!-- Header with Logout -->
        <header class="bg-gray-800 shadow-lg">
          <div class="mx-auto px-4 py-3 flex justify-between items-center">
            <h1 class="text-white text-xl font-semibold">NPC Social Sim</h1>
            <div class="flex items-center">
              <span class="text-gray-300 mr-4">{{ user.email }}</span>
              <button
                @click="handleLogout"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <div class="flex flex-1 overflow-hidden">
          <ChatList class="w-1/4 border-r border-gray-700" />
          <ChatArea class="flex-1" />
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.min-h-screen {
  min-height: 100vh;
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}
</style>