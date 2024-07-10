<template>
  <div class="ai-question-container">
    <div class="search-box">
      <input v-model="query" placeholder="Ask a question" />
      <button @click="fetchData" :disabled="isLoading">ASK</button>
    </div>
    <div v-if="answer || error || isLoading" class="response-box">
      <template v-if="isLoading">
        <div class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </template>
      <template v-else>
        <h3 v-if="answer || error" class="response-title"></h3>
        <p v-if="answer">{{ answer }}</p>
        <h3 v-if="error" class="error-title">Error:</h3>
        <p v-if="error" class="error-message">{{ error }}</p>
      </template>
    </div>
    <RepositoriesComponent
      v-if="repositories.length"
      :repositories="repositories"
    />
  </div>
</template>

<script>
import RepositoriesComponent from './RepositoriesComponent.vue';

export default {
  name: 'AIQuestionComponent',
  components: {
    RepositoriesComponent,
  },
  data() {
    return {
      query: '',
      answer: '',
      repositories: [],
      error: '',
      isLoading: false,
    };
  },
  methods: {
    async fetchData() {
      const userName = process.env.VUE_APP_USER_NAME;
      const password = process.env.VUE_APP_PASSWORD;
      const credentials = `${userName}:${password}`;
      const encodedCredentials = btoa(credentials);
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/user-request', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: this.query }),
        });
        if (response.ok) {
          const data = await response.json();
          this.handleResponse(data);
        } else {
          const errorData = await response.json();
          this.handleError(`Error ${response.status}: ${errorData.message}`);
        }
      } catch (error) {
        this.handleError(`Fetch error: ${error.message}`);
      }
      this.isLoading = false;
    },
    handleResponse(data) {
      this.answer = data.responseData;
      this.repositories = data.repositories || [];
      this.error = '';
    },
    handleError(errorMessage) {
      this.error = errorMessage;
      this.answer = '';
      this.repositories = [];
    },
  },
};
</script>

<style scoped>
.ai-question-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 75vh;
  background-color: #f0f4f8;
  padding: 10px;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 100%;
  max-width: 800px;
}

.search-box:hover {
  transform: scale(1.05);
}

.response-box {
  margin-top: 20px;
  text-align: center;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 100%;
  max-width: 800px;
}

.response-title {
  margin: 0;
  text-align: center;
  width: 100%;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot {
  height: 12px;
  width: 12px;
  margin: 0 5px;
  background-color: #007bff;
  border-radius: 50%;
  display: inline-block;
  animation: dot-bounce 1.4s infinite both;
}

.dot:nth-child(1) {
  animation-delay: 0.2s;
}

.dot:nth-child(2) {
  animation-delay: 0.4s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.error-title {
  color: red;
}

.error-message {
  color: red;
}

input {
  padding: 10px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 100px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}

@media (max-width: 600px) {
  .response-box {
    height: auto;
    padding: 10px;
  }

  .search-box {
    padding: 10px;
  }

  button {
    max-width: 80px;
  }
}
</style>
