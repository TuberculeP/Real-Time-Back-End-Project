<template>
  <p v-if="!game.started">Waiting for player 2</p>
  <template v-else>
    <p v-if="canIPlay">My turn</p>
    <p v-else>Your friend's turn</p>
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
  () => game.started && game.lastMove !== room.players[room.ctxId].color
);

function handleColumnClick(i: number) {
  if (canIPlay.value) {
    gameMove(i);
  }
}
</script>

<style scoped>
.connect {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: rgb(14, 14, 139);
  margin: 20px auto;
  padding: 10px;
}

.column {
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  padding: 10px 10px;
}

.column:hover {
  cursor: pointer;
  background-color: rgb(52, 52, 181);
  border-radius: 100px;
}

.cell {
  width: 50px;
  height: 50px;
  background: black;
  border-radius: 100px;
}

.filled.player1 {
  background-color: rgb(242, 57, 57);
}

.filled.player2 {
  background-color: rgb(238, 207, 54);
}
</style>
