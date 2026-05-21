<template>
    <div class="flex flex-col w-full lg:flex-row px-6 pb-16 lg:pb-6">
        <Sidebar class="w-full md:w-1/5 lg:mr-4 mb-4 lg:mb-0 hidden lg:block h-full" />
        <div class="w-full lg:w-4/5">
            <Navbar />
            <AlertDisplay class="mt-4" />
            <router-view />
        </div>
    </div>
    <div class="block lg:hidden">
        <Tabbar />
    </div>
</template>

<script lang="ts" setup>
import Navbar from './Navigation/Navbar.vue'
import Sidebar from './Navigation/Sidebar.vue'
import AlertDisplay from './Alerts/AlertDisplay.vue'
import Tabbar from './Navigation/Tabbar.vue'
import '../styles/styles.scss';
</script>