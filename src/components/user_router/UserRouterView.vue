<template>
  <iframe
    v-bind:src="src"
    style="width: 100%; height: 800px"
    frameborder="no"
  ></iframe>
</template>

<script>
export default {
  name: "UserRouterView",
  methods: {
    router() {
      const path = this.$router.history.current.path;
      const index = path.split("-")[1];
      const router = this.$store.state.routerNavigation[index].router;
      return router;
    },
  },
  data() {
    return {
      src: this.router(),
    };
  },
  created() {
    if (this.$store.state.dbPort === 0) {
      this.$router.push("/");
    }
  },
};
</script>