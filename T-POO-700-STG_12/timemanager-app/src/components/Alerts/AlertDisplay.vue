<template>
  <Message :severity="severity" v-if="message">{{ message }}</Message>
</template>

<script lang="ts">
import { computed, watch } from 'vue';
import { useErrorStore } from '../../store/errorStore';

export default {
  props: {
    severity: {
      type: String,
      default: 'info'
    }
  },
  setup(props) {
    const { message } = useErrorStore();
    return {
      message: computed(() => message.value),
      severity: computed(() => props.severity)
    };
  }
};
</script>

<style scoped>
.error-display {
  color: red;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
}
</style>