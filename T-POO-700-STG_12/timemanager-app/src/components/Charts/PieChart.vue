<template>
    <Doughnut :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
  // Enregistrer les composants nécessaires de Chart.js
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  export default {
    name: 'PieChart',
    components: { Doughnut },
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        required: true,
      }
    },
    computed: {
      chartData() {
        return this.chartData;
      },
      chartOptions() {
        return this.chartOptions;
      }
    }
  }
  </script>