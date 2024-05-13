<template>
  <div class="room">
    <div class="form" v-if="!room.connected">
      <UInput v-model="inputRoom" placeholder="Room ID" />
      <UButton @click="createOrJoinRoom(inputRoom)">Create or Join</UButton>
    </div>
    <div v-else>
      <p>Room ID: {{ room.id }}</p>
      <p>Online: {{ room.players.length }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { createOrJoinRoom, room } = useWebsocket();
const inputRoom = ref("");
</script>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
