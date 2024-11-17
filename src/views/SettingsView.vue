<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import {
  Moon,
  Bell,
  Shield,
  Key,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Camera,
  Edit2,
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

// Reactive state
const showProfileEdit = ref(false);
const isLoggingOut = ref(false);
const isUploadingPhoto = ref(false);
const editForm = ref({
  displayName: "",
  email: "",
});

const settingsItems = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage message alerts and sounds",
    hasToggle: true,
    preferenceKey: "notifications",
  },
  {
    icon: Shield,
    title: "Privacy",
    description: "Control your data and privacy settings",
    hasToggle: false,
    route: "/privacy",
  },
  {
    icon: Key,
    title: "Security",
    description: "Password and authentication settings",
    hasToggle: false,
    route: "/security",
  },
  {
    icon: HelpCircle,
    title: "Help & Support",
    description: "Get help or contact support",
    hasToggle: false,
    route: "/help",
  },
];

// Methods
const handleBack = () => {
  router.push("/chat");
};

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  try {
    isLoggingOut.value = true;
    await authStore.logout();
    await router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
};

const startProfileEdit = () => {
  editForm.value = {
    displayName: authStore.user?.displayName || "",
    email: authStore.user?.email || "",
  };
  showProfileEdit.value = true;
};

const handleProfileUpdate = async () => {
  try {
    if (editForm.value.email !== authStore.user?.email) {
      await authStore.updateUserEmail(editForm.value.email);
    }

    if (editForm.value.displayName !== authStore.user?.displayName) {
      await authStore.updateUserProfile({
        displayName: editForm.value.displayName,
      });
    }

    showProfileEdit.value = false;
  } catch (error) {
    console.error("Profile update error:", error);
  }
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    isUploadingPhoto.value = true;
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await authStore.updateUserProfile({
      photoURL: URL.createObjectURL(file),
    });
  } catch (error) {
    console.error("Photo upload error:", error);
  } finally {
    isUploadingPhoto.value = false;
  }
};

const handleToggleSetting = async (preferenceKey) => {
  if (!preferenceKey) return;
  await profileStore.savePreferences({
    [preferenceKey]: !profileStore.preferences[preferenceKey],
  });
};

onMounted(() => {
  profileStore.loadPreferences();
});
</script>

<template>
  <div :class="['settings-view', authStore.platform]">
    <!-- Header -->
    <header class="settings-header">
      <button class="back-button" @click="handleBack" aria-label="Go back">
        <ChevronLeft class="icon" aria-hidden="true" />
      </button>
      <h1 class="header-title">Settings</h1>
    </header>

    <div class="settings-content">
      <!-- Profile Section -->
      <section class="profile-section">
        <div class="profile-photo">
          <img
            :src="authStore.user?.photoURL || '/api/placeholder/80/80'"
            :alt="`${authStore.user?.displayName}'s profile photo`"
            class="photo"
          />
          <label class="photo-upload" :class="{ uploading: isUploadingPhoto }">
            <Camera class="icon" aria-hidden="true" />
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handlePhotoUpload"
              :disabled="isUploadingPhoto"
            />
          </label>
        </div>

        <!-- Profile Info -->
        <div v-if="!showProfileEdit" class="profile-info">
          <h2 class="profile-name">
            {{ authStore.user?.displayName || "Set your name" }}
          </h2>
          <p class="profile-email">{{ authStore.user?.email }}</p>
          <button class="edit-button" @click="startProfileEdit">
            <Edit2 class="icon" aria-hidden="true" />
            <span>Edit Profile</span>
          </button>
        </div>

        <!-- Edit Form -->
        <form v-else class="edit-form" @submit.prevent="handleProfileUpdate">
          <div class="form-group">
            <input
              v-model="editForm.displayName"
              type="text"
              placeholder="Display Name"
              class="form-input"
            />
            <input
              v-model="editForm.email"
              type="email"
              placeholder="Email"
              class="form-input"
            />
          </div>

          <div class="button-group">
            <button
              type="submit"
              class="save-button"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? "Saving..." : "Save Changes" }}
            </button>
            <button
              type="button"
              class="cancel-button"
              @click="showProfileEdit = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <!-- Settings List -->
      <section class="settings-list">
        <div
          v-for="(item, index) in settingsItems"
          :key="index"
          class="settings-item"
        >
          <div class="item-content">
            <component :is="item.icon" class="icon" aria-hidden="true" />
            <div class="item-text">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-description">{{ item.description }}</p>
            </div>
          </div>

          <button
            v-if="item.hasToggle"
            class="toggle-switch"
            :class="{
              active: profileStore.preferences[item.preferenceKey],
            }"
            @click="handleToggleSetting(item.preferenceKey)"
            :aria-pressed="profileStore.preferences[item.preferenceKey]"
          >
            <span class="toggle-knob" aria-hidden="true" />
          </button>
        </div>
      </section>

      <!-- Logout Button -->
      <button
        class="logout-button"
        :disabled="isLoggingOut"
        @click="handleLogout"
      >
        <LogOut
          class="icon"
          :class="{ spinning: isLoggingOut }"
          aria-hidden="true"
        />
        <span>{{ isLoggingOut ? "Logging out..." : "Log Out" }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Base Layout */
.settings-view {
  min-height: 100vh;
  background-color: #111827;
  color: #fff;
}

/* Header */
.settings-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #111827;
  border-bottom: 1px solid #1f2937;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #1f2937;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
}

/* Content Area */
.settings-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Profile Section */
.profile-section {
  background-color: #1f2937;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.profile-photo {
  position: relative;
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1rem;
}

.photo {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  object-fit: cover;
}

.photo-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1.75rem;
  height: 1.75rem;
  background-color: #7c3aed;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.photo-upload:hover {
  transform: scale(1.1);
}

.photo-upload.uploading {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Profile Info */
.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.profile-email {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #374151;
  border: none;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #4b5563;
}

/* Edit Form */
.edit-form {
  animation: fadeIn 0.3s ease-out;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-input {
  padding: 0.75rem;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #7c3aed;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.save-button,
.cancel-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button {
  background-color: #7c3aed;
  color: #fff;
  border: none;
}

.save-button:hover:not(:disabled) {
  background-color: #6d28d9;
}

.cancel-button {
  background-color: #374151;
  color: #fff;
  border: none;
}

.cancel-button:hover {
  background-color: #4b5563;
}

/* Settings List */
.settings-list {
  background-color: #1f2937;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #374151;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-text {
  min-width: 0;
}

.item-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-description {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Toggle Switch */
.toggle-switch {
  width: 3rem;
  height: 1.75rem;
  background-color: #374151;
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.toggle-switch.active {
  background-color: #7c3aed;
}

.toggle-knob {
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #fff;
  border-radius: 9999px;
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-knob {
  transform: translateX(1.25rem);
}

/* Logout Button */
.logout-button {
  width: 100%;
  padding: 1rem;
  background-color: #1f2937;
  border: none;
  border-radius: 0.75rem;
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover:not(:disabled) {
  background-color: #374151;
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Icon Styles */
.icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Platform Specific Styles */
.ios {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
}

.ios .settings-header {
  padding-top: calc(1rem + var(--safe-area-top));
}

.ios .settings-content {
  padding-bottom: calc(1rem + var(--safe-area-bottom));
}

.ios .toggle-switch {
  border-radius: 1.125rem;
}

.ios .form-input,
.ios .save-button,
.ios .cancel-button {
  border-radius: 0.75rem;
}

.android .toggle-switch {
  height: 1.5rem;
  border-radius: 0.75rem;
}

.android .toggle-knob {
  width: 1rem;
  height: 1rem;
}

.android .settings-item {
  position: relative;
  overflow: hidden;
}

.android .settings-item::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s;
}

.android .settings-item:active::after {
  opacity: 0.1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

/* Loading States */
.profile-section[data-loading="true"] {
  opacity: 0.7;
  pointer-events: none;
}

/* Touch Optimizations */
@media (hover: none) {
  .settings-item,
  .back-button,
  .edit-button,
  .save-button,
  .cancel-button,
  .logout-button,
  .toggle-switch {
    -webkit-tap-highlight-color: transparent;
  }

  .form-input {
    font-size: 16px;
  }
}

/* Responsive Adjustments */
@media (min-width: 640px) {
  .settings-content {
    padding: 2rem;
  }

  .profile-section,
  .settings-list {
    border-radius: 1.25rem;
  }

  .profile-photo {
    width: 6rem;
    height: 6rem;
  }
}

/* Accessibility Focus Styles */
:focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
}

/* Dark Mode Enhancement */
@media (prefers-color-scheme: dark) {
  .settings-view {
    background-color: #0f1421;
  }

  .settings-header {
    background-color: #0f1421;
  }

  .profile-section,
  .settings-list {
    background-color: #1a1f2c;
  }
}

/* Error States */
.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

/* Transitions */
.settings-item {
  transition: background-color 0.2s, transform 0.2s;
}

.settings-item:active {
  transform: scale(0.99);
}

/* Success States */
.success-message {
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: slideUp 0.3s ease-out;
}

/* Scroll Behavior */
.settings-content {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 transparent;
}

.settings-content::-webkit-scrollbar {
  width: 4px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 2px;
}

/* Performance Optimizations */
.settings-view * {
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .toggle-switch {
    border: 1px solid currentColor;
  }

  .toggle-knob {
    background-color: currentColor;
  }
}
</style>