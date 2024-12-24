// frontend/src/services/userService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  sex: 'Male' | 'Female';
}

// CREATE a user
export const createUser = (userData: Omit<User, 'id'>) => {
  return axios.post<User>(API_URL, userData);
};

// READ all users
export const fetchUsers = () => {
  return axios.get<User[]>(API_URL);
};

// UPDATE a user by ID
export const updateUser = (id: number, updatedData: Partial<User>) => {
  return axios.put<User>(`${API_URL}/${id}`, updatedData);
};

// DELETE a user by ID
export const deleteUser = (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
