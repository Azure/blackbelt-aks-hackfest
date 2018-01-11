<template>
  <section>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <hr class="footspace">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <img src="/static/img/msft_logo.png">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-6">
      </div>
      <div class="col-lg-12 credits">
        Intelligent Cloud Blackbelt Team
      </div>
      <div class="col-lg-6">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-6">
      </div>
      <div class="col-lg-12 credits">
        {{imageTag}}
      </div>
      <div class="col-lg-6">
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        imageTag: process.env.IMAGE_TAG,
      };
    }
  };
</script>