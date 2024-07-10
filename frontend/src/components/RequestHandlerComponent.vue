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
    isLoading:  {
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
        this.onError(`Server error: ${error.message}`);
      }
      this.$emit('update:isLoading', false); // Stop loading
    },
  },
};
</script>
