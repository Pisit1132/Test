<template>
  <div class="bg-white shadow p-4 rounded">
    <a-card
      title="List"
      :body-style="{ padding: '20px' }"
      bordered="false"
    >
      <!-- The Table -->
      <a-table
        :columns="columns"
        :dataSource="indexedUsers"
        :pagination="{ pageSize: 5 }"
        :rowKey="record => record.id"
        bordered
      />

      <!-- The Edit Modal -->
      <a-modal
        v-model:visible="isEditModalVisible"
        title="Edit User"
        @ok="handleEditConfirm"
        @cancel="handleEditCancel"
      >
        <a-form layout="vertical">
          <a-form-item label="First Name">
            <a-input v-model:value="editingUser.firstName" />
          </a-form-item>
          <a-form-item label="Last Name">
            <a-input v-model:value="editingUser.lastName" />
          </a-form-item>
          <a-form-item label="Phone">
            <a-input v-model:value="editingUser.phone" />
          </a-form-item>
          <a-form-item label="Sex">
            <a-radio-group v-model:value="editingUser.sex" class="space-x-4">
              <a-radio value="Male">Male</a-radio>
              <a-radio value="Female">Female</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, h } from 'vue'
import { Modal } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { User } from '../services/userService'

/** 
 * We get the users array from the parent, 
 * which is the single source of truth 
 */
const props = defineProps<{
  users: User[]
}>()

/**
 * We emit 'editUser' and 'deleteUser'
 * so the parent can do the actual API calls,
 * then refresh the user array
 */
const emit = defineEmits<{
  // We pass an object so we can include user ID + partial updates
  (e: 'editUser', payload: { id: number; updates: Partial<User> }): void
  (e: 'deleteUser', userId: number): void
}>()

/** Local state for the editing user and modal visibility */
const isEditModalVisible = ref(false)
const editingUser = ref<User>({
  id: undefined,
  firstName: '',
  lastName: '',
  phone: '',
  sex: 'Male'
})

/** 
 * Sorting the incoming users by descending ID (newest first).
 * Then add an index column for display 
 */
const indexedUsers = computed(() => {
  const sorted = [...props.users].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
  return sorted.map((user, index) => ({
    ...user,
    index: index + 1
  }))
})

/** 
 * For the table columns, we define an "Actions" column 
 * that shows Edit and Delete icons 
 */
const columns = [
  {
    title: 'No',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: 'Name',
    key: 'name',
    customRender: ({ record }: { record: User & { index: number } }) =>
      `${record.firstName} ${record.lastName}`
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: 'Sex',
    dataIndex: 'sex',
    key: 'sex',
    width: 80
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center',
    customRender: ({ record }: { record: User & { index: number } }) => {
      return h('div', { class: 'flex space-x-2 justify-center items-center' }, [
        // Edit Button
        h(
          'button',
          {
            class: 'text-blue-600 hover:text-blue-800',
            onClick: () => handleEdit(record)
          },
          [h(EditOutlined)]
        ),
        // Delete Button
        h(
          'button',
          {
            class: 'text-red-600 hover:text-red-800',
            onClick: () => confirmDelete(record.id!)
          },
          [h(DeleteOutlined)]
        )
      ])
    }
  }
]

function handleEdit(record: User) {
  // Copy the user into editingUser
  editingUser.value = { ...record }
  isEditModalVisible.value = true
}

function handleEditConfirm() {
  if (!editingUser.value.id) return
  // Emit the event with the user ID and updated data
  emit('editUser', {
    id: editingUser.value.id,
    updates: { ...editingUser.value }
  })
  isEditModalVisible.value = false
}

function handleEditCancel() {
  isEditModalVisible.value = false
}

/** 
 * Confirm Delete 
 */
function confirmDelete(userId: number) {
  Modal.confirm({
    title: 'Confirm Delete',
    content: `Are you sure you want to delete user ID=${userId}?`,
    onOk: () => {
      emit('deleteUser', userId)
    }
  })
}
</script>

<style scoped></style>
