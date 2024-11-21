<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import ChatHeader from "./ChatHeader.vue";
import ChatInput from "./ChatInput.vue";
import BaseMessage from "../ui/BaseMessage.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const messagesStore = useMessagesStore();
const { getMessages } = storeToRefs(messagesStore);

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
const messages = computed(() => getMessages.value(props.chat.id));

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
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

onMounted(async () => {
  await messagesStore.subscribeToMessages(props.chat.id);
  scrollToBottom(false);
});

onUnmounted(() => {
  messagesStore.unsubscribeFromMessages(props.chat.id);
});

const handleSend = async (message) => {
  try {
    await messagesStore.sendMessage(props.chat.id, message);
    emit("send", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
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
        <div v-if="!messages.length" class="empty-state">
          <p>No messages yet. Start the conversation!</p>
        </div>

        <div v-else class="messages-wrapper">
          <BaseMessage
            v-for="message in messages"
            :key="message.id"
            :content="message.content"
            :timestamp="
              new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            "
            :is-outgoing="message.sender === currentUserId"
            :status="message.status"
          />

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
  height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
}

.chat-content {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  position: relative;
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-4);
  gap: var(--spacing-2);
  min-height: 100%;
}

/* Web-specific styles */
@media (min-width: 768px) {
  .chat-area {
    height: 100vh;
  }

  .chat-content {
    height: calc(100vh - 116px); /* Header (56px) + Input (60px) */
  }

  .messages-container {
    height: 100%;
    padding: 1rem 0;
  }
}

/* Mobile-specific styles */
@media (max-width: 767px) {
  .chat-area {
    height: 100%;
  }

  .messages-container {
    height: auto;
  }
}

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

.chat-input {
  flex-shrink: 0;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
}

/* Scrollbar styles */
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

/* Platform Specific Styles */
.android .messages-container {
  padding-top: var(--spacing-2);
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
</style>