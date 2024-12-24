// src/stores/useUsers.ts (or composables/useUsers.ts)
import { ref } from 'vue'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  type User
} from '../services/userServices'


export function useUsers() {
  const users = ref<User[]>([])

  
  async function loadUsers() {
    try {
      const response = await fetchUsers()
    
      users.value = response.data
    } catch (error) {
      console.error('Error loading users:', error)
   
      throw error
    }
  }

  
  async function addUser(newUser: Omit<User, 'id'>) {
    try {
      await createUser(newUser)
     
      await loadUsers()
    } catch (error) {
      console.error('Error adding user:', error)
      
      throw error
    }
  }

 
  async function editUser(userId: number, updated: Partial<User>) {
    try {
      await updateUser(userId, updated)
      await loadUsers()
    } catch (error) {
      console.error('Error editing user:', error)
      
      throw error
    }
  }

  async function removeUser(userId: number) {
    try {
      await deleteUser(userId)
      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
     
      throw error
    }
  }

  return {
    users,
    loadUsers,
    addUser,
    editUser,
    removeUser
  }
}
