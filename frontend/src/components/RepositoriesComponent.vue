<template>
  <div class="repositories-container">
    <ul>
      <li v-for="repo in repositories" :key="repo.id">{{ repo.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['repositories'],
};
</script>

<style scoped>
.repositories-container {
  margin-top: 20px;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
