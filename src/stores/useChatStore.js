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

  // Sélectionner un chat
  const selectChat = async (chatId) => {
    try {
      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        selectedChat.value = chat
      }
    } catch (e) {
      console.error('Error selecting chat:', e)
      error.value = e.message
    }
  }

  const createChat = async (recipientEmail) => {
    try {
      loading.value = true
      error.value = null

      // Trouver l'utilisateur par email
      const usersRef = dbRef(database, 'users')
      const userQuery = query(usersRef, orderByChild('email'), equalTo(recipientEmail))
      const snapshot = await get(userQuery)
      
      if (!snapshot.exists()) {
        throw new Error('User not found')
      }

      const recipientId = Object.keys(snapshot.val())[0]
      
      // Vérifier si un chat existe déjà
      const existingChat = chats.value.find(chat => 
        chat.participants && 
        chat.participants[recipientId] && 
        chat.participants[authStore.user.uid]
      )

      if (existingChat) {
        selectChat(existingChat.id)
        return existingChat.id
      }
      
      // Créer nouveau chat
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
      
      // Ajouter chat à l'état local
      const recipientData = snapshot.val()[recipientId]
      const newChat = {
        id: chatId,
        name: recipientData.displayName || recipientEmail,
        avatar: recipientData.photoURL || "/api/placeholder/48/48",
        online: false,
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
        participants: chatData.participants
      }

      chats.value.push(newChat)
      selectedChat.value = newChat

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
      error.value = null
      
      // Récupérer tous les chats où l'utilisateur est participant
      const userChatsRef = query(
        dbRef(database, 'chats'),
        orderByChild(`participants/${authStore.user.uid}`),
        equalTo(true)
      )
      
      const snapshot = await get(userChatsRef)
      
      if (snapshot.exists()) {
        const chatsData = snapshot.val()
        const loadedChats = []

        // Charger les détails des participants pour chaque chat
        for (const [chatId, chat] of Object.entries(chatsData)) {
          const participantIds = Object.keys(chat.participants || {})
            .filter(id => id !== authStore.user.uid)

          const participantPromises = participantIds.map(async (participantId) => {
            const userSnapshot = await get(dbRef(database, `users/${participantId}`))
            return userSnapshot.val()
          })

          const participants = await Promise.all(participantPromises)
          const participant = participants[0] // Prendre le premier participant pour les chats en 1:1

          loadedChats.push({
            id: chatId,
            name: participant?.displayName || participant?.email || 'Unknown User',
            avatar: participant?.photoURL || "/api/placeholder/48/48",
            online: !!participant?.online,
            lastMessage: chat.lastMessage?.content || '',
            lastMessageTime: chat.lastMessage?.timestamp || chat.createdAt,
            unreadCount: 0,
            participants: chat.participants
          })
        }

        chats.value = loadedChats
      }
    } catch (e) {
      console.error('Error loading chats:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const updateLastMessage = async (chatId, messageData) => {
    try {
      const chatRef = dbRef(database, `chats/${chatId}/lastMessage`)
      await set(chatRef, {
        content: messageData.content,
        timestamp: messageData.timestamp,
        senderId: messageData.sender
      })

      // Mettre à jour l'état local
      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        chat.lastMessage = messageData.content
        chat.lastMessageTime = messageData.timestamp
      }
    } catch (e) {
      console.error('Error updating last message:', e)
    }
  }

  return {
    chats,
    selectedChat,
    loading,
    error,
    createChat,
    loadUserChats,
    selectChat,
    updateLastMessage
  }
})