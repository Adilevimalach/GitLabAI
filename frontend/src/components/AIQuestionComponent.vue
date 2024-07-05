<template>
  <div class="ai-question-container">
    <div class="search-box">
      <input v-model="query" placeholder="Ask a question" />
      <button @click="fetchData" :disabled="isLoading">ASK</button>
    </div>
    <div v-if="answer || error" class="response-box">
      <h3 v-if="answer">Answer:</h3>
      <p v-if="answer">{{ answer }}</p>
      <h3 v-if="error" class="error-title">Error:</h3>
      <p v-if="error" class="error-message">{{ error }}</p>
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
      query: '', // Added to bind the input field
      answer: '',
      repositories: [],
      error: '', // Added to store error messages
      isLoading: false, // Loading state
    };
  },
  methods: {
    async fetchData() {
      //hardcoded username and password for basic auth. need to store it securely
      const userName = process.env.VUE_APP_USER_NAME;
      const password = process.env.VUE_APP_PASSWORD;
      console.log(userName, password);
      const credentials = `${userName}:${password}`;
      const encodedCredentials = btoa(credentials);
      this.isLoading = true; // Start loading
      try {
        const response = await fetch('http://localhost:3000/user-request', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: this.query }),
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          this.handleResponse(data);
        } else {
          const errorData = await response.json(); // Parse error JSON
          this.handleError(`Error ${response.status}: ${errorData.message}`);
        }
      } catch (error) {
        console.log('Error:', error);
        this.handleError(`Fetch error: ${error.message}`);
      }
      this.isLoading = false; // Stop loading
    },
    handleResponse(data) {
      console.log('Response received in AIQuestionComponent:', data);
      this.answer = data.responseData; // Update this line
      this.repositories = data.repositories || [];
      this.error = ''; // Clear error on successful response
    },
    handleError(errorMessage) {
      console.log('Error received in AIQuestionComponent:', errorMessage);
      this.error = errorMessage;
      this.answer = ''; // Clear previous answer on error
      this.repositories = []; // Clear repositories on error
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
  height: 75vh;
  background-color: #f0f4f8;
  padding: 20px;
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
}

.error-title {
  color: red;
}

.error-message {
  color: red;
}

input {
  padding: 10px;
  width: 300px;
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
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}
</style>
