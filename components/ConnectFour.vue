<template>
  <p class="waiting" v-if="!game.started">Waiting for player 2</p>
  <template v-else>
    <div class="infos">
      <p v-if="canIPlay">My turn</p>
      <p v-else>Your friend's turn</p>
      <div class="reconnection" v-if="game.started && room.players.length < 2">
        <UAlert color="red" variant="solid" icon="i-ion-warning-outline" title="Your friend is disconnected"></UAlert>
      </div>
    </div>
    <div class="connect">
      <div
        v-for="(column, i) in game.board"
        :key="i"
        class="column"
        @click="handleColumnClick(i)"
      >
        <div
          v-for="(cell, j) in column"
          :key="j"
          class="cell"
          :class="{ filled: !!cell, player1: cell === 1, player2: cell === 2 }"
        ></div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
const { room, game, gameMove } = useWebsocket();
const canIPlay = computed(
  () => game.started && game.lastMove !== room.players[room.ctxId]?.color
);

function handleColumnClick(i: number) {
  if (canIPlay.value) {
    gameMove(i);
  }
}
</script>


<style scoped lang="scss">

.waiting {
  margin: 1rem;
}
.connect {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #4c4eb1;
  margin: auto;
  padding: 10px;
  border-radius: 12px;
  height: fit-content;
}

.infos {
  width: fit-content;
  margin: -60px 0 0 auto;
  align-items: end;
  text-align: end;
  padding: 0 1rem;
}

.reconnection {
  position: absolute;
  top: 33%;
  left: 50%;
  margin-left: -125px;
  width: 250px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

.column {
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  padding: 10px 10px;
}

.column:hover {
  cursor: pointer;
  background-color: #6466e9;
  border-radius: 100px;
}

.cell {
  width: 50px;
  height: 50px;
  background: black;
  border-radius: 100px;
}

@media (prefers-color-scheme: light) {
  .cell {
    background: white;
  }
}

.filled.player1 {
  background-color: rgb(242, 57, 57);
}

.filled.player2 {
  background-color: rgb(238, 207, 54);
}
</style>
