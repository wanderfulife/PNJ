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
    // Don't subscribe if user is not authenticated
    if (!authStore.user?.uid) {
      console.log('Cannot subscribe to messages: User not authenticated')
      return
    }

    // Don't create duplicate listeners
    if (activeListeners.value.has(chatId)) return

    try {
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
        // Only log error if user is still authenticated
        if (authStore.user?.uid) {
          console.error('Error subscribing to messages:', err)
          error.value = err.message
        }
      })

      activeListeners.value.set(chatId, callback)
    } catch (err) {
      if (authStore.user?.uid) {
        console.error('Error setting up message subscription:', err)
        error.value = err.message
      }
    }
  }

  const unsubscribeFromMessages = (chatId) => {
    const listener = activeListeners.value.get(chatId)
    if (listener) {
      off(dbRef(database, `messages/${chatId}`), 'value', listener)
      activeListeners.value.delete(chatId)
    }
  }

  const unsubscribeFromAllMessages = () => {
    activeListeners.value.forEach((listener, chatId) => {
      off(dbRef(database, `messages/${chatId}`), 'value', listener)
    })
    activeListeners.value.clear()
    messages.value = {}
    error.value = null
  }

  const sendMessage = async (chatId, content) => {
    if (!authStore.user?.uid) {
      throw new Error('Must be authenticated to send messages')
    }

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
    if (!authStore.user?.uid) return

    try {
      const messageRef = dbRef(database, `messages/${chatId}/${messageId}/status`)
      await set(messageRef, status)
    } catch (e) {
      console.error('Error updating message status:', e)
    }
  }

  // Reset store state
  const reset = () => {
    unsubscribeFromAllMessages()
    messages.value = {}
    loading.value = false
    error.value = null
  }

  return {
    messages,
    loading,
    error,
    getMessages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    unsubscribeFromAllMessages,
    updateMessageStatus,
    reset
  }
})