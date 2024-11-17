<script setup>
import { ref, onMounted, computed } from "vue";
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
  Trash2,
  User,
} from "lucide-vue-next";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const storage = getStorage();

// Reactive state
const showProfileEdit = ref(false);
const isLoggingOut = ref(false);
const isUploadingPhoto = ref(false);
const isDeletingPhoto = ref(false);
const editForm = ref({
  displayName: "",
  email: "",
});

// Computed property for avatar display
const hasProfilePhoto = computed(() => !!authStore.user?.photoURL);

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

const handlePhotoDelete = async () => {
  if (isDeletingPhoto.value || !authStore.user?.photoURL) return;

  try {
    isDeletingPhoto.value = true;
    // Delete from Firebase Storage
    const photoRef = storageRef(
      storage,
      `profile-photos/${authStore.user.uid}`
    );
    await deleteObject(photoRef);

    // Update user profile
    await authStore.updateUserProfile({
      photoURL: null,
    });
  } catch (error) {
    console.error("Photo deletion error:", error);
  } finally {
    isDeletingPhoto.value = false;
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

    // Upload to Firebase Storage
    const photoRef = storageRef(
      storage,
      `profile-photos/${authStore.user.uid}`
    );
    await uploadBytes(photoRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(photoRef);

    // Update user profile
    await authStore.updateUserProfile({
      photoURL: downloadURL,
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
        <div class="profile-container">
          <div class="profile-photo-container">
            <!-- Photo or Avatar -->
            <div class="profile-photo-wrapper">
              <div v-if="!hasProfilePhoto" class="default-avatar">
                <User class="avatar-icon" aria-hidden="true" />
              </div>
              <img
                v-else
                :src="authStore.user?.photoURL"
                :alt="`${authStore.user?.displayName}'s profile photo`"
                class="photo"
              />
            </div>

            <!-- Photo Actions -->
            <div class="photo-actions">
              <label
                class="action-button upload"
                :class="{ disabled: isUploadingPhoto }"
              >
                <Camera class="action-icon" aria-hidden="true" />
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                  :disabled="isUploadingPhoto"
                />
              </label>

              <button
                v-if="hasProfilePhoto"
                class="action-button delete"
                @click="handlePhotoDelete"
                :disabled="isDeletingPhoto"
                :class="{ disabled: isDeletingPhoto }"
                aria-label="Delete profile photo"
              >
                <Trash2 class="action-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Profile Info -->
          <div class="profile-info" v-if="!showProfileEdit">
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
        </div>
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
  padding: 2rem 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.profile-photo-container {
  position: relative;
  margin-bottom: 1rem;
}

.profile-photo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #374151;
  border: 3px solid #7c3aed;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #7c3aed;
  color: #fff;
}

.avatar-icon {
  width: 50%;
  height: 50%;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Photo Actions */
.photo-actions {
  position: absolute;
  bottom: 0;
  right: -0.5rem;
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background-color: #111827;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.action-button {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  padding: 0;
  color: white;
}

.action-button.upload {
  background-color: #7c3aed;
}

.action-button.delete {
  background-color: #ef4444;
}

.action-button:hover:not(.disabled) {
  transform: scale(1.1);
  filter: brightness(110%);
}

.action-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.hidden {
  display: none;
}

/* Profile Info */
.profile-info {
  text-align: center;
  width: 100%;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.profile-email {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* Edit Button & Form */
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
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: #4b5563;
  transform: translateY(-1px);
}

.edit-form {
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease-out;
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
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

/* Button Group */
.button-group {
  display: flex;
  gap: 0.75rem;
}

.save-button,
.cancel-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.save-button {
  background-color: #7c3aed;
  color: #fff;
}

.save-button:hover:not(:disabled) {
  background-color: #6d28d9;
  transform: translateY(-1px);
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #374151;
  color: #fff;
}

.cancel-button:hover {
  background-color: #4b5563;
  transform: translateY(-1px);
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
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #374151;
  transition: background-color 0.2s;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:hover {
  background-color: #2d3748;
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
  transform: translateY(-1px);
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Animations */
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
.uploading,
.deleting {
  position: relative;
  pointer-events: none;
}

.uploading::after,
.deleting::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: inherit;
}

/* Responsive Adjustments */
@media (min-width: 640px) {
  .settings-content {
    padding: 2rem;
  }

  .profile-photo-wrapper {
    width: 140px;
    height: 140px;
  }

  .action-button {
    width: 2.5rem;
    height: 2.5rem;
  }

  .action-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* Dark Mode Enhancements */
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

/* Platform-Specific Styles */
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
</style>