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

      <!-- A Refresh Button to fetch new users that were created elsewhere -->
      <div class="mt-4 flex justify-end">
        <a-button type="default" @click="loadUsers">Refresh</a-button>
      </div>

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
import { ref, computed, onMounted, h } from 'vue';
import { Modal } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import {
  fetchUsers,
  updateUser,
  deleteUser,
  type User
} from '../services/userServices';

// 1) Reactive state for user array + edit modal
const users = ref<User[]>([]);
const isEditModalVisible = ref(false);
const editingUser = ref<User>({
  id: undefined,
  firstName: '',
  lastName: '',
  phone: '',
  sex: 'Male',
});

// 2) Fetch user data on mount
async function loadUsers() {
  try {
    const response = await fetchUsers();
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

onMounted(() => {
  loadUsers();
});

// 3) Create a computed "indexedUsers" sorted by descending ID
const indexedUsers = computed(() => {
  const sorted = [...users.value].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  return sorted.map((user, index) => ({
    ...user,
    index: index + 1,
  }));
});

// 4) Edit functionality
function handleEdit(record: User) {
  editingUser.value = { ...record }; // Shallow clone the record
  isEditModalVisible.value = true;
}

async function handleEditConfirm() {
  if (!editingUser.value.id) return; // Safety check

  try {
    await updateUser(editingUser.value.id, editingUser.value);
    isEditModalVisible.value = false;
    await loadUsers();
    Modal.success({ content: 'User updated successfully!' });
  } catch (error) {
    console.error('Error updating user:', error);
    Modal.error({ content: 'Failed to update user.' });
  }
}

function handleEditCancel() {
  isEditModalVisible.value = false;
}

// 5) Delete functionality
async function handleDelete(record: User) {
  Modal.confirm({
    title: 'Confirm Delete',
    content: `Are you sure you want to delete user ID=${record.id}?`,
    onOk: async () => {
      if (!record.id) return;
      try {
        await deleteUser(record.id);
        await loadUsers();
        Modal.success({ content: `User ID=${record.id} deleted.` });
      } catch (error) {
        console.error('Error deleting user:', error);
        Modal.error({ content: 'Failed to delete user.' });
      }
    },
  });
}

// 6) Table columns with "Actions" column
const columns = [
  {
    title: 'No',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: 'Name',
    key: 'name',
    customRender: ({ record }: { record: User & { index: number } }) =>
      `${record.firstName} ${record.lastName}`,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Sex',
    dataIndex: 'sex',
    key: 'sex',
    width: 80,
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
            onClick: () => handleEdit(record),
          },
          [h(EditOutlined)]
        ),
        // Delete Button
        h(
          'button',
          {
            class: 'text-red-600 hover:text-red-800',
            onClick: () => handleDelete(record),
          },
          [h(DeleteOutlined)]
        ),
      ]);
    },
  },
];
</script>

<style scoped></style>
