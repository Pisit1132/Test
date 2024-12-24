<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow px-8 py-4 w-full">
      <div class="flex items-center space-x-4">
        
        <div class="w-16 h-16 flex items-center justify-center">
          <img
            src="/img2.png"
            alt="Logo"
            class="w-full h-full object-cover"
          />
        </div>
        <h1 class="text-xl font-semibold flex-1 text-center text-gray-800">Test</h1>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full px-8 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div class="w-full space-y-8">
       
        <UserForm @userCreated="onUserCreated" />

      
        <UserList
          :users="users"
          @editUser="onEditUser"
          @deleteUser="onDeleteUser"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UserForm from './components/UserForm.vue'
import UserList from './components/UserList.vue'
import { useUsers } from './stores/useUsers'

const { users, loadUsers, addUser, editUser, removeUser } = useUsers()

onMounted(() => {
  loadUsers()
})

async function onUserCreated(formData: {
  firstName: string
  lastName: string
  phone: string
  sex: 'Male' | 'Female'
}) {
  try {
    await addUser(formData)
    alert('User created successfully!')
  } catch (error: any) {
    if (error.response?.status === 400) {
      const message = error.response.data.error || 'This name already exists!'
      alert(message)
    } else {
      alert('An error occurred. Please try again.')
      console.error(error)
    }
  }
}

async function onEditUser(payload: { id: number, updates: Partial<typeof users.value[0]> }) {
  try {
    await editUser(payload.id, payload.updates)
  } catch (error: any) {
    alert('Failed to edit user. Please try again.')
    console.error(error)
  }
}

async function onDeleteUser(userId: number) {
  try {
    await removeUser(userId)
  } catch (error: any) {
    alert('Failed to delete user. Please try again.')
    console.error(error)
  }
}
</script>
