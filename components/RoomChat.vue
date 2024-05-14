<template>
  <div class="room-chat">
    <p class="info connect" v-if="!room.connected">
      Connect to a room to play & chat !
    </p>
    <div v-else>
      <div v-for="({ message, isServer, time, name }, i) in chat" :key="i">
        <div class="shadow"></div>
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
  height: 44vh;
  justify-content: flex-end;
  margin: auto 0 0;
  position: relative;
  overflow: hidden;
  padding: 0 1rem;
}

.shadow {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(255, 255, 255, 0) 100%);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: none;
}

@media (prefers-color-scheme: light) {
  .shadow {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 40%);
  }
}

.info {
  margin: 0px auto;
  color: gray;
}

.connect {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -125px;
  width: 250px;
}

form {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 12px;
  width: 100%;
}

form button[type="submit"]{
  width: fit-content;
  padding: 8px 1rem;
}

.chat {
  display: flex;
  padding: 0.25rem;
  align-items: center;
}

.chat p {
  display: flex;
  max-width: 200px;
  text-overflow: ellipsis;
}

</style>
