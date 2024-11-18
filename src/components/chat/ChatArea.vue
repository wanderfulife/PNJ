<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import ChatHeader from "./ChatHeader.vue";
import ChatInput from "./ChatInput.vue";
import BaseMessage from "../ui/BaseMessage.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const platformClass = computed(() => authStore.platform?.toLowerCase());

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  currentUserId: {
    type: String,
    required: true,
  },
  isTyping: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back", "send"]);
const messagesContainer = ref(null);
const messages = ref(props.chat?.messages || []);

const scrollToBottom = async (smooth = true) => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

watch(
  () => props.chat?.messages,
  (newMessages) => {
    if (newMessages) {
      messages.value = newMessages;
      scrollToBottom();
    }
  },
  { deep: true }
);

onMounted(() => {
  scrollToBottom(false);
});

const handleSend = (message) => {
  emit("send", message);
};

const handleBack = () => {
  emit("back");
};
</script>

<template>
  <div v-if="chat" :class="['chat-area', platformClass]">
    <ChatHeader :chat="chat" :show-back-button="true" @back="handleBack" />

    <div class="chat-content">
      <div ref="messagesContainer" class="messages-container">
        <!-- Empty State -->
        <div v-if="!messages.length" class="empty-state">
          <p>No messages yet. Start the conversation!</p>
        </div>

        <!-- Messages -->
        <div v-else class="messages-wrapper">
          <BaseMessage
            v-for="message in messages"
            :key="message.id"
            :content="message.content"
            :timestamp="message.time"
            :is-outgoing="message.sender === currentUserId"
            :status="message.status"
          />

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="typing-indicator" role="status">
            <div class="typing-dots">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
            <span>{{ chat.name }} is typing...</span>
          </div>
        </div>
      </div>
    </div>

    <ChatInput @send="handleSend" class="chat-input" />
  </div>
</template>

<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Change to 100vh */
  color: var(--color-text);
}

.chat-content {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden; /* Add this */
}

.messages-container {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: var(--platform-radius);
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: var(--spacing-4) 0;
  gap: var(--spacing-2);
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--spacing-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  text-align: center;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  animation: slideUp var(--transition-base);
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-text-secondary);
  border-radius: 50%;
  opacity: 0.7;
}

.typing-dot:nth-child(1) {
  animation: bounce 1s infinite 0.1s;
}
.typing-dot:nth-child(2) {
  animation: bounce 1s infinite 0.2s;
}
.typing-dot:nth-child(3) {
  animation: bounce 1s infinite 0.3s;
}

/* Chat Input Section */
.chat-input {
  background-color: var(--color-background);
}

/* Platform Specific Styles */
.android .messages-container {
  padding-top: var(--spacing-2);
}

/* Animations */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
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

/* Touch Optimizations */
@media (hover: none) {
  .chat-area {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* High Performance Rendering */
.messages-wrapper > * {
  will-change: transform, opacity;
}

/* Focus Management */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--platform-primary);
  outline-offset: 2px;
}

/* Error States */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  color: var(--color-error);
  text-align: center;
}

/* Loading States */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top-color: var(--platform-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>