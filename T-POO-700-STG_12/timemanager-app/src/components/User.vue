<template>
  <h1 class="text-2xl font-bold my-4 text-center">Users</h1>
  <Panel class="mt-4">
    <h2 class="text-xl font-semibold mb-4 text-center">Users List</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FloatLabel variant="in">
          <label for="usernameFilter" class="block text-sm font-medium text-gray-700 mb-2" variant="filled">Filter by
            username</label>
          <InputText v-model="usernameFilter" id="usernameFilter" type="text"
            class="w-full px-3 py-2 border rounded-md" />
        </FloatLabel>
        <select v-model="selectedManagerId" class="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>- Select Manager -</option>
          <option v-for="manager in managers" :key="manager.id" :value="manager.id">#{{ manager.username }} - {{
            manager.username }}</option>
        </select>
    </div>
    <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            <th scrope="col" class="py-3 px-6">ID</th>
            <th scope="col" class="py-3 px-6">Name</th>
            <th scope="col" class="py-3 px-6">Email</th>
            <th scope="col" class="py-3 px-6">Role</th>
            <th scope="col" class="py-3 px-6">Manager ID</th>
            <th scrope="col" class="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-b dark:border-gray-700">
            <td class="py-4 px-6">
              <span>{{ user.id }}</span>
            </td>
            <td class="py-4 px-6">
              <span v-if="!user.isEditing">{{ user.name }}</span>
              <input v-else v-model="user.name" type="text" class="w-full px-3 py-2 border rounded-md" />
            </td>
            <td class="py-4 px-6">
              <span v-if="!user.isEditing">{{ user.email }}</span>
              <input v-else v-model="user.email" type="email" class="w-full px-3 py-2 border rounded-md" />
            </td>
            <td class="py-4 px-6">
              <span v-if="!user.isEditing">{{ user.role }}</span>
              <select v-else v-model="user.role" class="w-full px-3 py-2 border rounded-md">
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="manager_general">Super Manager</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <span v-if="!user.isEditing">{{ user.managerId }}</span>
              <select v-else v-model="user.managerId" class="w-full px-3 py-2 border rounded-md">
                <option value="">- Select Manager -</option>
                <option v-for="manager in managers" :key="manager.id" :value="manager.id">#{{ manager.username }} -{{
                  manager.username }}</option>
                <option v-for="manager in managers" :key="manager.id" :value="manager.id">#{{ manager.username }} -{{
                  manager.username }}</option>
              </select>
            </td>
            <td class="py-4 px-6">
              <button v-if="!user.isEditing" @click="editUser(user)"
                class="px-4 py-2 bg-teal-500 text-white rounded-md">Edit</button>
              <button v-else @click="saveUser(user)" class="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
              <button v-if="user.isEditing" @click="cancelEdit(user)"
                class="px-4 py-2 bg-gray-500 text-white rounded-md ml-2">Cancel</button>
              <button @click="openDeleteModal(user.id)"
                class="px-4 py-2 bg-red-500 text-white rounded-md ml-2">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Panel>
  <Panel v-if="canAccess(['admin'])" class="mt-4">
    <h2 class="text-xl font-semibold mb-4 text-center">Add an User</h2>
    <form @submit.prevent="addUser" class="mt-4 grid grid-cols-2 gap-4">
      <div class="col-span-1">
        <input v-model="newUser.name" type="text" placeholder="Name" required
          class="w-full px-3 py-2 border rounded-md" />
      </div>
      <div class="col-span-1">
        <input v-model="newUser.email" type="email" placeholder="Email" required
          class="w-full px-3 py-2 border rounded-md" />
      </div>
      <div class="col-span-1">
        <select v-model="newUser.role" class="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>- Select role -</option>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="manager_general">General Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div class="col-span-1">
        <select v-model="newUser.manager_id" class="w-full px-3 py-2 border rounded-md">
          <option value="">- Select Manager -</option>
          <option v-for="manager in managers" :key="manager.id" :value="manager.id">#{{ manager.username }} - {{
            manager.username }}</option>
        </select>
      </div>
      <div class="col-span-1">
        <input v-model="newUser.password" type="password" placeholder="Password" required
          class="w-full px-3 py-2 border rounded-md" />
      </div>
      <div class="col-span-1 ">
        <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md">Add User</button>
      </div>
    </form>
  </Panel>
  <Panel v-if="canAccess(['admin'])" class="mt-4">
    <h2 class="text-xl font-semibold mb-4 text-center">User Tree</h2>
    <div v-html="userTreeHtml"></div>
  </Panel>
  <Dialog header="Confirmation" :visible="confirmDialogVisible" modal @click="confirmDialogVisible = false">
    <span>Are you sure you want to delete this user?</span>
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="confirmDialogVisible = false" class="p-button-text" />
      <Button label="Yes" icon="pi pi-check" @click="deleteUser" class="p-button-text" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Users } from '../api/users';
import { useAuthStore } from '../store/authStore';
import { User, Manager } from '../interfaces';
import { canAccess } from '../utils';
import { useNetwork } from '@vueuse/core';

const { isOnline } = useNetwork();
const { currentUser } = useAuthStore();

const users = ref<User[]>([]);
const managers = ref<Manager[]>([]);
const newUser = ref({
  name: '',
  email: '',
  role: '',
  manager_id: '',
  password: ''
});
const confirmDialogVisible = ref(false);
const userToDelete = ref<number | null>(null);
const usernameFilter = ref('');
const selectedManagerId = ref<number | string>('');

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesUsername = user.name.toLowerCase().includes(usernameFilter.value.toLowerCase());
    const matchesManager = selectedManagerId.value ? user.managerId === selectedManagerId.value : true;
    return matchesUsername && matchesManager;
  });
});

const fetchUsers = async () => {
  if (!isOnline.value) {
    // Load data from localStorage if offline
    const cachedUsers = localStorage.getItem('usersData');
    if (cachedUsers) {
      users.value = JSON.parse(cachedUsers);
      console.log("Loaded users from cache (offline mode)");
    }
    return; // Skip fetching from API
  }

  // Fetch from API if online
  const fetchedUsers = await Users.getUsers();
  users.value = fetchedUsers
    .map(user => ({
      id: user.id,
      name: user.username,
      role: user.role,
      managerId: user.manager_id,
      email: user.email
    }))
    .sort((a, b) => a.id - b.id);

  // Cache the fetched users data for offline use
  localStorage.setItem('usersData', JSON.stringify(users.value));
};


const fetchManagers = async () => {
  const fetchedUsers = await Users.getUsers();
  managers.value = fetchedUsers.filter(user => user.role === 'manager');
};

const addUser = async () => {
  await Users.createUser({
    user: {
      username: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      manager_id: newUser.value.manager_id,
      password: newUser.value.password
    }
  });
  fetchUsers();
};

const openDeleteModal = (userId: number) => {
  confirmDialogVisible.value = true;
  userToDelete.value = userId;
};

const deleteUser = async () => {
  if (userToDelete.value !== null) {
    await Users.deleteUser(userToDelete.value.toString());
    fetchUsers();
    confirmDialogVisible.value = false;
    userToDelete.value = null;
  }
};

const editUser = (user: User) => {
  user.isEditing = true;
};

const saveUser = async (user: User) => {
  await Users.updateUser(user.id.toString(), {
    user: {
      username: user.name,
      email: user.email,
      role: user.role,
      manager_id: user.managerId
    }
  });
  user.isEditing = false;
  fetchUsers();
};

const cancelEdit = (user: User) => {
  user.isEditing = false;
};

interface UserTree {
  superManagers: SuperManager[];
  managersWithoutSuperManager: ManagerTree[];
}

interface SuperManager extends User {
  managers: ManagerTree[];
}


interface ManagerTree extends User {
  users: User[];
}

const generateUserTree = (): UserTree => {
  const tree: UserTree = {
    superManagers: [],
    managersWithoutSuperManager: []
  };

  users.value.forEach(user => {
    if (user.role === 'manager_general') {
      tree.superManagers.push({ ...user, managers: [] });
    }
  });

  users.value.forEach(user => {
    if (user.role === 'manager') {
      const superManager = tree.superManagers.find(superManager => superManager.id === user.managerId);
      if (superManager) {
        superManager.managers.push({ ...user, users: [] });
      } else {
        tree.managersWithoutSuperManager.push({ ...user, users: [] });
      }
    }
  });

  users.value.forEach(user => {
    if (user.role === 'user') {
      tree.superManagers.forEach(superManager => {
        const manager = superManager.managers.find(manager => manager.id === user.managerId);
        if (manager) {
          manager.users.push(user);
        }
      });
      const managerWithoutSuperManager = tree.managersWithoutSuperManager.find(manager => manager.id === user.managerId);
      if (managerWithoutSuperManager) {
        managerWithoutSuperManager.users.push(user);
      }
    }
  });

  return tree;
};

const userTreeHtml = computed(() => {
  const tree = generateUserTree();
  let html = '';

  tree.superManagers.forEach(superManager => {
    html += `<div><strong>#${superManager.id} ${superManager.name} (Super Manager)</strong></div>`;
    superManager.managers.forEach(manager => {
      html += `<div style="margin-left: 20px;"><strong>└──#${manager.id} ${manager.name} (Manager)</strong></div>`;
      manager.users.forEach(user => {
        html += `<div style="margin-left: 40px;">└──#${user.id} ${user.name} (User)</div>`;
      });
    });
  });

  tree.managersWithoutSuperManager.forEach(manager => {
    html += `<div><strong>└── #${manager.id} ${manager.name} (Manager)</strong></div>`;
    manager.users.forEach(user => {
      html += `<div style="margin-left: 20px;">└── #${user.id} ${user.name} (User)</div>`;
    });
  });

  return html;
});


onMounted(() => {
  fetchUsers();
  fetchManagers();
});
</script>

<style scoped>
.cardContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1em;
  padding: 1em;
  background-color: #f3f4f6;
}
</style>