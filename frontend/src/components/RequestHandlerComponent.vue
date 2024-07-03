<!-- 
<template>
  <div class="request-handler">
    <input
      type="text"
      v-model="userInput"
      placeholder="Type your request here..."
      @keyup.enter="sendRequest"
    />
    <button @click="sendRequest" :disabled="isLoading">Send</button>
  </div>
</template>

<script>
export default {
  name: 'RequestHandlerComponent',
  props: {
    onSuccess: {
      type: Function,
      required: true,
    },
    onError: {
      type: Function,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      userInput: '',
    };
  },
  methods: {
    async sendRequest() {
      this.$emit('update:isLoading', true); // Start loading
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: this.userInput }),
        });
        if (!response.ok) {
          let errorMessage = `Error: ${response.status} ${response.statusText}`;
          this.onError(errorMessage);
          throw new Error(errorMessage);
        }
        const data = await response.json();
        this.onSuccess(data);
      } catch (error) {
        console.error('Error:', error);
        this.onError(error.message);
      } finally {
        this.$emit('update:isLoading', false); // Stop loading
      }
    },
  },
};
</script>

<style scoped>
.request-handler {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

input,
button {
  padding: 10px;
  margin-top: 10px;
}

button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}
</style> -->
<template>
  <div>
    <button @click="makeRequest" :disabled="isLoading">Fetch Data</button>
  </div>
</template>

<script>
export default {
  props: {
    onSuccess: {
      type: Function,
      required: true,
    },
    onError: {
      type: Function,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    endpoint: {
      type: String,
      required: true,
    },
  },
  methods: {
    async makeRequest() {
      this.$emit('update:isLoading', true); // Start loading
      try {
        const response = await fetch(this.endpoint);
        if (response.ok) {
          const data = await response.json();
          this.onSuccess(data);
        } else {
          const errorText = await response.text();
          this.onError(`Error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        this.onError(`Fetch error: ${error.message}`);
      }
      this.$emit('update:isLoading', false); // Stop loading
    },
  },
};
</script>
