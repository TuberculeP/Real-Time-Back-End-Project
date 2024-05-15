<template>
  <ClientOnly>
    <main>
      <RoomTest />
      <ConnectFour v-if="room.players.length" />
      <RoomChat />
      <UNotifications />
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import RoomTest from "./components/RoomInfo.vue";
import RoomChat from "./components/RoomChat.vue";
import ConnectFour from "./components/ConnectFour.vue";
const { room } = useWebsocket();
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
  grid-template-rows: auto auto 1fr auto;
  position: relative;
  overflow-y: hidden;
}

</style>
