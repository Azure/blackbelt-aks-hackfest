<template>
  <section>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24 credits">
        This Node is : {{imageTag}}
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <a href="/"><img class="super-justice" :src="headerImage"></a>
        <h1 class="super-header">{{subtitle}}</h1>
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-3">
      </div>
      <div class="col-lg-6">
        <at-button @click="link('Rating')" icon="icon-star" class="mid-btn" type="primary"  hollow>Start Rating</at-button>
      </div>
      <div class="col-lg-6">
        <at-button @click="link('Leaderboard')" icon="icon-bar-chart-2" class="mid-btn" type="success" hollow>View Leaderboard</at-button>
      </div>
      <div class="col-lg-6">
        <at-button @click="link('Leaderboard')" icon="icon-github" class="mid-btn" type="info" hollow>Steal This Code</at-button>
      </div>
      <div class="col-lg-3">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
      </div>
      </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      headerImage: "",
      subtitle: "",
      imageTag: process.env.IMAGE_TAG,
      errors: []
    };
  },
  created() {
    axios
      .get(process.env.SITE)
      .then(response => {
        var page = response.data.pages.Home
        document.title = page.title
        this.headerImage = page.headerImage
        this.subtitle = page.subtitle
      })
      .catch(e => {
        this.errors.push(e);
      });
  },
  methods: {
    link(rel) {
      this.$router.push({ name: rel });
    }
  }
};
</script>