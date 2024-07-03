<!-- <template>
  <div id="app">
    <header>
      <h1>GitLab Repository Search and AI Questions</h1>
    </header>
    <AIQuestionComponent />
  </div>
</template>

<script>
import AIQuestionComponent from './components/AIQuestionComponent.vue';

export default {
  components: {
    AIQuestionComponent,
  },
};
</script>

<style>
#app {
  text-align: center;
}
header {
  margin-bottom: 20px;
}
</style> -->
<template>
  <div id="app">
    <header>
      <h1>GitLab Repository Search and AI Questions</h1>
    </header>
    <AIQuestionComponent />
  </div>
</template>

<script>
import AIQuestionComponent from './components/AIQuestionComponent.vue';

export default {
  name: 'App',
  components: {
    AIQuestionComponent,
  },
};
</script>

<style scoped>
:root {
  --primary-color: #2c3e50;
  --header-bg-color: #f3f3f3;
  --header-font-color: #333;
  --header-margin-bottom: 20px;
  --font-family: 'Arial, sans-serif';
}

#app {
  text-align: center;
  font-family: var(--font-family);
}

header {
  background-color: var(--header-bg-color);
  color: var(--header-font-color);
  padding: 20px;
  margin-bottom: var(--header-margin-bottom);
  border-bottom: 2px solid var(--primary-color);
}
</style>
