import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDatabase, ref as dbRef, push, onValue, set, off } from 'firebase/database'
import { useAuthStore } from './useAuthStore'

export const useMessagesStore = defineStore('messages', () => {
  const authStore = useAuthStore()
  const messages = ref({})
  const loading = ref(false)
  const error = ref(null)
  const activeListeners = ref(new Map())

  const database = getDatabase()

  const getMessages = computed(() => (chatId) => {
    return messages.value[chatId] || []
  })

  const subscribeToMessages = async (chatId) => {
    if (activeListeners.value.has(chatId)) return

    const messagesRef = dbRef(database, `messages/${chatId}`)
    
    const callback = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        messages.value = {
          ...messages.value,
          [chatId]: Object.values(data)
        }
      }
    }, (err) => {
      console.error('Error subscribing to messages:', err)
      error.value = err.message
    })

    activeListeners.value.set(chatId, callback)
  }

  const unsubscribeFromMessages = (chatId) => {
    const listener = activeListeners.value.get(chatId)
    if (listener) {
      off(dbRef(database, `messages/${chatId}`), 'value', listener)
      activeListeners.value.delete(chatId)
    }
  }

  const sendMessage = async (chatId, content) => {
    try {
      loading.value = true
      error.value = null

      const newMessage = {
        id: Date.now(),
        content,
        sender: authStore.user.uid,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }

      const chatMessagesRef = dbRef(database, `messages/${chatId}`)
      const newMessageRef = push(chatMessagesRef)
      await set(newMessageRef, newMessage)

      return newMessage
    } catch (e) {
      console.error('Error sending message:', e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateMessageStatus = async (chatId, messageId, status) => {
    try {
      const messageRef = dbRef(database, `messages/${chatId}/${messageId}/status`)
      await set(messageRef, status)
    } catch (e) {
      console.error('Error updating message status:', e)
    }
  }

  return {
    messages,
    loading,
    error,
    getMessages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    updateMessageStatus
  }
})