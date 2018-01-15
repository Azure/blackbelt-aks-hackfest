
<template>
  <section>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <a href="/"><img class="super-justice" :src="headerImage"></a>
        <h1 class="super-header">{{subtitle}}</h1>
      </div>
    </div>
    <div class="row at-row">
      <div class="col-lg-6 leader-card" v-for="(item, index) in heroes">
        <div class="at-box-row">
          <at-card :bordered="false" class="flex-center flex-middle" v-bind:style="index | formatPlace">
            <h4 slot="title" class="super-name">
              {{item.name}}
            </h4>
            <div>
              <img class="super-image" :src="item.img">
              <div class="super-rate-foot">
                <span v-bind:class="index | formatRatingColor">{{ item.AvgRating | formatRating }}</span>
              </div>
              <div class="flex-center flex-middle super-star-text-shell">
                <span class="super-star-text">Stars</span>
              </div>
            </div>
          </at-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import numeral from 'numeral'

export default {
  data () {
    return {
      headerImage: "",
      subtitle:"",
      heroes: [],
      errors: []
    }
  },
    created() {
      axios.get("/api/sites/" + process.env.SITE_CODE)
        .then(response => {
          var page = response.data.payload.pages.Leaderboard
          document.title = page.title
          this.headerImage = page.headerImage
          this.subtitle = page.subtitle
          return axios.get("/api/heroes/rated") 
        })
        .then(response => {
          this.heroes = response.data.payload
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    methods: {
    },
    filters: {
      formatRating: function(value){
        return numeral(value).format("0.00")
      },
      formatRatingColor: function(index){
        var ratingClass = "super-name-lead ";
        switch(index){
          case 0:
            return ratingClass + "super-name-first";
            break;
          case 3:
            return ratingClass + "super-name-last";
            break;
          default:
            return ratingClass + "super-name-else";
        }
      },
      formatPlace: function(index){
        // placeholder for modifying place
        return ""
      }
    }
  };
</script>