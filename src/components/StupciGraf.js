import { Bar, mixins } from "vue-chartjs";

const { reactiveProp } = mixins;

// Ponovno upotrebljiva stupčasta (bar) graf komponenta za vue-chartjs 3.5.1 + chart.js 2.9.4.
// chartData roditelj prosljeđuje kao prop; mixin reactiveProp osvježava graf pri promjeni.
export default {
  name: "StupciGraf",
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
