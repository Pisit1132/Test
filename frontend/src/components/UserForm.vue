<template>
  <div class="bg-white shadow p-4 rounded relative">
    <a-card
      title="Form Input"
      :body-style="{ padding: '20px' }"
      bordered="false"
    >
      <div class="absolute top-4 right-4 text-sm text-gray-600">
        date : {{ currentDateTime }}
      </div>

      <a-form layout="vertical" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
          <a-form-item label="First Name" required>
            <a-input
              v-model:value="form.firstName"
              placeholder="Enter first name"
              class="w-full"
            />
          </a-form-item>
          <a-form-item label="Last Name" required>
            <a-input
              v-model:value="form.lastName"
              placeholder="Enter last name"
              class="w-full"
            />
          </a-form-item>
        </div>

        <a-form-item label="Phone" required>
          <a-input
            v-model:value="form.phone"
            placeholder="Enter phone number"
            class="w-full"
          />
        </a-form-item>

        <a-form-item label="Sex" required>
          <a-radio-group v-model:value="form.sex" class="space-x-4">
            <a-radio value="Male">Male</a-radio>
            <a-radio value="Female">Female</a-radio>
          </a-radio-group>
        </a-form-item>

        <div class="flex justify-end space-x-2 pt-4">
          <a-button type="default" @click="clearForm">Clear</a-button>
          <a-button type="primary" html-type="submit">Save</a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  sex: 'Male' | 'Female';
}

// Reactive form state
const form = ref<FormData>({
  firstName: '',
  lastName: '',
  phone: '',
  sex: 'Male'
});

// Clears the form
function clearForm() {
  form.value = {
    firstName: '',
    lastName: '',
    phone: '',
    sex: 'Male'
  };
}

// We emit 'userCreated' so the parent can handle creating the user
const emit = defineEmits<{
  (e: 'userCreated', userData: FormData): void;
}>();

function handleSubmit() {
  // 1. Basic client-side validation
  if (
    !form.value.firstName.trim() ||
    !form.value.lastName.trim() ||
    !form.value.phone.trim() ||
    !form.value.sex
  ) {
    alert('All fields are required. Please fill them out.');
    return;
  }

  // 2. If valid, emit the event
  emit('userCreated', { ...form.value });
  clearForm();
}

// OPTIONAL: A clock in the top-right corner
const now = ref(new Date());
let timer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer !== undefined) {
    clearInterval(timer);
  }
});

const currentDateTime = computed(() => {
  const day = String(now.value.getDate()).padStart(2, '0');
  const month = String(now.value.getMonth() + 1).padStart(2, '0');
  const year = now.value.getFullYear();
  const hours = String(now.value.getHours()).padStart(2, '0');
  const minutes = String(now.value.getMinutes()).padStart(2, '0');
  const seconds = String(now.value.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} (${hours}:${minutes}:${seconds})`;
});
</script>
