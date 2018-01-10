
<template>
  <section>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <img class="super-justice" src="/static/img/justice.png">
        <h1 class="super-header">{{subtitle}}</h1>
      </div>
    </div>
    <div class="row at-row">
      <div class="col-lg-6" v-for="(item) in heroes">
        <div class="at-box-row">
          <at-card :bordered="false">
            <h4 slot="title" class="super-name">
              {{item.name}}
            </h4>
            <div>
              <img class="super-image" :src="item.img">
              <div class="super-rate-foot">
                <at-rate :allow-half="true" :ref="item._id" :id="item._id" @on-change="rateHero(item._id, item.name, $event)"></at-rate>
              </div>
            </div>
          </at-card>
        </div>
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <at-button @click="submitRatings" class="rate-submit" icon="icon-check" hollow>&nbsp;&nbsp;SUBMIT MY RATINGS&nbsp;&nbsp;</at-button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headerImage: "",
      subtitle: "",
      userIp: "",
      heroes: [],
      errors: []
    }
  },
    created() {
      axios.get(process.env.SITE)
        .then(response => {
          var page = response.data.pages.Rating
          document.title = page.title
          this.headerImage = page.headerImage
          this.subtitle = page.subtitle
          return axios.get(process.env.API + "/heroes") 
        })
        .then(response => {
          this.heroes = response.data.payload
          this.$Notify({ title: 'Heroes loaded', message: 'Retrieved list of Heroes', type: 'success' })
          return axios.get("//jsonip.com")
        })
        .then(response => {
          this.userIp = response.data.ip
        })
        .catch(e => {
          this.errors.push(e)
        })

    },
    methods: {
      rateHero: function (id, name, event) {
        if (name === 'Batman' && event > 3.5) {
          this.$Notify({ title: `Seriously?`, message: `He's just a rich guy. Zero super powers. Altrustic? Yes. Not a Superhero. Are you a PM?`, type: 'warning', duration: 10000 })
        }
      },
      submitRatings() {
        var rate = {}
        var refs = this.$refs
        var router = this.$router
        rate["userIp"] = this.userIp
        rate["ratings"] = []
        
        for (var h in refs) {
          rate.ratings.push({ id: h, rating: Number( refs[h][0].currentValue || 0 ) })
        }   

        axios.post(process.env.API + "/rate", rate)
        .then(response => {
          router.push('leaderboard')
        })
        .catch(e => {
          this.errors.push(e)
        })

      }
    }
  };
</script>