import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDatabase, ref as dbRef, push, set, get, query, orderByChild, equalTo } from 'firebase/database'
import { useAuthStore } from './useAuthStore'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const chats = ref([])
  const selectedChat = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const database = getDatabase()

  const createChat = async (recipientEmail) => {
    try {
      loading.value = true
      error.value = null

      // Find user by email
      const usersRef = dbRef(database, 'users')
      const userQuery = query(usersRef, orderByChild('email'), equalTo(recipientEmail))
      const snapshot = await get(userQuery)
      
      if (!snapshot.exists()) {
        throw new Error('User not found')
      }

      const recipientId = Object.keys(snapshot.val())[0]
      
      // Create new chat
      const newChatRef = push(dbRef(database, 'chats'))
      const chatId = newChatRef.key
      
      const chatData = {
        id: chatId,
        createdAt: new Date().toISOString(),
        participants: {
          [authStore.user.uid]: true,
          [recipientId]: true
        },
        lastMessage: null
      }

      await set(newChatRef, chatData)
      
      // Add chat to local state
      const recipientData = snapshot.val()[recipientId]
      chats.value.push({
        id: chatId,
        name: recipientData.displayName || recipientEmail,
        avatar: recipientData.photoURL || "/api/placeholder/48/48",
        online: false,
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0
      })

      return chatId
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const loadUserChats = async () => {
    try {
      loading.value = true
      const userChatsRef = dbRef(database, 'chats')
      const snapshot = await get(userChatsRef)
      
      if (snapshot.exists()) {
        const chatsData = snapshot.val()
        const userChats = Object.entries(chatsData)
          .filter(([_, chat]) => chat.participants[authStore.user.uid])
          .map(([id, chat]) => ({
            id,
            // Add other chat properties
          }))
        
        chats.value = userChats
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    chats,
    selectedChat,
    loading,
    error,
    createChat,
    loadUserChats
  }
})