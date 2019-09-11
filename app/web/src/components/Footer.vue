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
        Azure Global Blackbelt Team
      </div>
      <div class="col-lg-6">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle credits-tag">
      <div class="col-lg-6">
      </div>
      <div class="col-lg-12">
        <span class="credits">IMAGE TAG:&nbsp;</span><span class="credits-black">{{imageTag}}</span>
      </div>
      <div class="col-lg-6">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-6">
      </div>
      <div class="col-lg-12">
        <span class="credits">IMAGE BUILD DATE:&nbsp;</span><span class="credits-black">{{imageDate}}</span>
      </div>
      <div class="col-lg-6">
      </div>
    </div>
        <div class="row at-row flex-center flex-middle">
      <div class="col-lg-6">
      </div>
      <div class="col-lg-12">
        <span class="credits">K8S INFO:&nbsp;&nbsp;</span><span class="credits-black">{{k8sNodeName}}&nbsp;:&nbsp;{{k8sPodName}}&nbsp;:&nbsp;{{k8sPodIp}} </span>
      </div>
      <div class="col-lg-6">
      </div>
    </div>
   <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <h1>
         HOLA PACO
          </h1>
      </div>
   </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        imageTag: process.env.IMAGE_TAG,
        imageDate: process.env.IMAGE_BUILD_DATE,
        k8sNodeName: process.env.KUBE_NODE_NAME,
        k8sPodName: process.env.KUBE_POD_NAME,
        k8sPodIp: process.env.KUBE_POD_IP
      };
    }
  };
</script>
