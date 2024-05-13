<template>
  <ClientOnly>
    <main>
      <RoomTest />
      <RoomChat />
      <UNotifications />
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import RoomTest from "./components/RoomTest.vue";
import RoomChat from "./components/RoomChat.vue";
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
main {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
