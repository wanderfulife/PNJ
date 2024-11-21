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

// Dans useChatStore.js, modifiez la fonction createChat comme suit :
const createChat = async (recipientEmail) => {
  try {
    loading.value = true
    error.value = null

    // Vérification de l'authentification
    if (!authStore.user?.uid) {
      throw new Error('User must be authenticated to create a chat')
    }

    console.log('Creating chat with recipient email:', recipientEmail)
    console.log('Current user:', authStore.user)

    // Recherche de l'utilisateur par email avec gestion d'erreur améliorée
    const usersRef = dbRef(database, 'users')
    let recipientData
    let recipientId

    try {
      const userQuery = query(usersRef, orderByChild('email'), equalTo(recipientEmail))
      const snapshot = await get(userQuery)
      
      if (!snapshot.exists()) {
        throw new Error(`No user found with email: ${recipientEmail}`)
      }

      // Extraire les données du destinataire
      const userData = snapshot.val()
      recipientId = Object.keys(userData)[0]
      recipientData = userData[recipientId]

      console.log('Found recipient:', { recipientId, recipientData })
    } catch (e) {
      console.error('Error finding recipient:', e)
      throw new Error('Failed to find recipient user')
    }

    // Vérification du même utilisateur
    if (recipientId === authStore.user.uid) {
      throw new Error('Cannot create chat with yourself')
    }

    // Vérification du chat existant
    const existingChat = chats.value.find(chat => 
      chat.participants && 
      chat.participants[recipientId] && 
      chat.participants[authStore.user.uid]
    )

    if (existingChat) {
      console.log('Found existing chat:', existingChat)
      selectChat(existingChat.id)
      return existingChat.id
    }

    // Création du nouveau chat
    const chatData = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: {
        [authStore.user.uid]: true,
        [recipientId]: true
      }
    }

    console.log('Creating new chat with data:', chatData)

    // Créer la référence et obtenir l'ID
    const newChatRef = push(dbRef(database, 'chats'))
    const chatId = newChatRef.key

    try {
      // Écriture des données du chat
      await set(newChatRef, chatData)
      console.log('Successfully created chat:', chatId)

      // Mise à jour de l'état local
      const newChat = {
        id: chatId,
        name: recipientData.displayName || recipientEmail,
        avatar: recipientData.photoURL || "/api/placeholder/48/48",
        online: false,
        lastMessage: "",
        lastMessageTime: chatData.createdAt,
        unreadCount: 0,
        participants: chatData.participants
      }

      chats.value = [...chats.value, newChat]
      selectedChat.value = newChat

      return chatId
    } catch (e) {
      console.error('Error writing chat data:', e)
      throw new Error('Failed to create chat. Please try again.')
    }
  } catch (e) {
    console.error('Error in createChat:', e)
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
      
      // Charger tous les chats
      const chatsRef = dbRef(database, 'chats')
      const snapshot = await get(chatsRef)
      
      if (snapshot.exists()) {
        const chatsData = snapshot.val()
        const loadedChats = []
        const currentUserId = authStore.user.uid
  
        // Filtrer et charger les chats de l'utilisateur
        for (const [chatId, chat] of Object.entries(chatsData)) {
          if (chat.participants?.[currentUserId]) {
            // Trouver l'autre participant
            const otherParticipantId = Object.keys(chat.participants)
              .find(id => id !== currentUserId)
  
            if (otherParticipantId) {
              try {
                // Charger les infos de l'autre participant
                const userRef = dbRef(database, `users/${otherParticipantId}`)
                const userSnapshot = await get(userRef)
                const userData = userSnapshot.val()
  
                if (userData) {
                  loadedChats.push({
                    id: chatId,
                    name: userData.displayName || userData.email || 'Unknown User',
                    avatar: userData.photoURL || "/api/placeholder/48/48",
                    online: !!userData.lastActive && 
                           (new Date().getTime() - new Date(userData.lastActive).getTime()) < 300000, // 5 minutes
                    lastMessage: chat.lastMessage?.content || '',
                    lastMessageTime: chat.lastMessage?.timestamp || chat.createdAt,
                    unreadCount: 0,
                    participants: chat.participants
                  })
                }
              } catch (userError) {
                console.error(`Error loading user data for chat ${chatId}:`, userError)
              }
            }
          }
        }
  
        // Trier les chats du plus récent au plus ancien
        chats.value = loadedChats.sort((a, b) => {
          const timeA = new Date(a.lastMessageTime || 0).getTime()
          const timeB = new Date(b.lastMessageTime || 0).getTime()
          return timeB - timeA
        })
      } else {
        chats.value = []
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