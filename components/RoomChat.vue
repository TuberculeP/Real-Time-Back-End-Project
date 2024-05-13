<template>
  <div class="room-chat">
    <p class="info" v-if="!room.connected">Connect to a room to see chat</p>
    <div v-else>
      <div v-for="({ message, isServer, time, name }, i) in chat" :key="i">
        <p class="info" v-if="isServer">{{ message }}</p>
        <div v-else>
          <p>
            <span class="time">{{ time }}</span
            >{{ name }}: {{ message }}
          </p>
        </div>
      </div>
      <div class="form">
        <UForm :state="chatForm" @submit="chatMessage">
          <UInput v-model="chatForm.inputChat" placeholder="Type a message" />
          <UButton type="submit">Send</UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useChat } from "~/composables/chat";

const { room, sendChatMessage } = useWebsocket();
const { chat } = useChat();

const chatForm = reactive({
  inputChat: "",
});
const chatMessage = () => {
  const { inputChat } = chatForm;
  if (inputChat) {
    sendChatMessage(inputChat);
    chatForm.inputChat = "";
  }
};
</script>

<style scoped>
.room-chat {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
}
.info {
  margin: 0 auto;
  padding: 1rem;
  color: gray;
}
</style>
