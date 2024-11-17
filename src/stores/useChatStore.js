import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './useAuthStore'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const chats = ref([])
  const selectedChat = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Mock data pour l'exemple
  const initializeChats = () => {
    chats.value = [
      {
        id: 1,
        name: "John Wander",
        avatar: "/api/placeholder/48/48",
        online: true,
        lastMessage: "See you tomorrow at the meeting! 👋",
        lastMessageTime: "01:29 AM",
        unreadCount: 3,
        messages: [
          {
            id: 1,
            content: "Hey! How's the project coming along?",
            sender: "john123",
            time: "9:30 AM",
            status: "read"
          }
        ]
      },
      // ... autres chats
    ]
  }

  const selectChat = (chatId) => {
    selectedChat.value = chats.value.find(chat => chat.id === chatId)
  }

  const sendMessage = async (chatId, content) => {
    try {
      const chat = chats.value.find(c => c.id === chatId)
      if (!chat) return

      const newMessage = {
        id: Date.now(),
        content,
        sender: authStore.user.uid,
        time: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'sent'
      }

      chat.messages.push(newMessage)
      chat.lastMessage = content
      chat.lastMessageTime = newMessage.time
      
      // Simuler un délai réseau
      setTimeout(() => {
        newMessage.status = 'delivered'
        // Forcer la réactivité
        chats.value = [...chats.value]
      }, 1000)

    } catch (e) {
      error.value = e.message
      console.error('Error sending message:', e)
    }
  }

  return {
    chats,
    selectedChat,
    loading,
    error,
    initializeChats,
    selectChat,
    sendMessage
  }
})