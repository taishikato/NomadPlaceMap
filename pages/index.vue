<template>
  <div id="frontpage">
    <section class="hero has-text-centered">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2">
            👩‍💻👨‍💻NomadPlaceMap🗺️☕
          </h1>
          <h2 class="subtitle is-3">
            <p>
              Crowdsourced map for digital nomads to find a good place to work
              in the city by digital nomads
            </p>
          </h2>
          <ul id="medium-text" class="has-text-left">
            <li class="is-size-5">
              ☕Are you looking for a cafe with Wi-Fi and vegan menu to work??
            </li>
            <li class="is-size-5">
              📖Are you looking for a quite place to study??
            </li>
            <li class="is-size-4">
              👉NomadPlaceMap is the right place to come
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="has-text-centered section description-bg">
      <div class="columns">
        <div class="column is-10 container">
          <h3 class="title is-3">Built for Digital Nomads like you</h3>
          <figure>
            <img src="/map-page.png" class="shadow-img" />
          </figure>
          <div class="text-box">
            <p class="title is-5">👍 Only qualitied places</p>
            <p class="desc-text has-text-weight-semibold">
              Every place is added by Digital Nomad, which means only truly
              useful places are on our map.
            </p>
            <div class="text-box">
              <p class="title is-5">🏙️ Explore the city</p>
              <div id="cities" class="columns">
                <div class="column">
                  <n-link to="/city/vancouver">
                    🌳
                    <p class="title is-4">Vancouver</p>
                  </n-link>
                </div>
                <div class="column">
                  <n-link to="/city/sanfrancisco">
                    🌁
                    <p class="title is-4">San Francisco</p>
                  </n-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="coming-feature" class="has-text-centered section">
      <div class="columns">
        <div class="column is-10 container">
          <h3 class="title is-3">Coming Features</h3>
          <h4 class="title is-4">Be more community oriented</h4>
          <img src="/comminity-img.svg" width="300px" />
          <ul id="coming-feature-list">
            <li class="is-size-6 has-text-weight-semibold desc-text">
              Profile page showing what you do (Software developer, Blogger,
              Musician, etc)
            </li>
            <li class="is-size-6 has-text-weight-semibold desc-text">
              Check In
            </li>
            <li class="is-size-6 has-text-weight-semibold desc-text">
              Showing shared seat status (OK/No)
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="has-text-centered section">
      <div class="columns">
        <div class="column is-10 container">
          <h3 class="title is-3">Who is making NomadPlaceMap?</h3>
          <p class="subtitle is-5">
            It is developed by Taishi Kato, a Indie Maker based in Vancouver,
            Canada.
          </p>
          <p class="subtitle is-6">
            <a
              href="https://taishikato.com/"
              class="has-text-grey-light"
              target="_blank"
              >Portfolio</a
            >
            /
            <a
              href="https://twitter.com/taishikat0"
              class="has-text-grey-light"
              target="_blank"
              >Twitter</a
            >
            /
            <a
              href="https://github.com/taishikato"
              class="has-text-grey-light"
              target="_blank"
              >GitHub</a
            >
            /
            <a
              href="https://wip.chat/@1491"
              class="has-text-grey-light"
              target="_blank"
              >Wip Chat</a
            >
          </p>
          <figure id="profile-img">
            <img src="/taishi-profile.jpg" class="shadow-img" width="300px" />
            <figcaption>at Ha Long Bay, Vietnam</figcaption>
          </figure>
        </div>
      </div>
    </section>
    <section id="blog" class="section has-text-centered">
      <h3 class="title is-3">Blog posts</h3>
      <p class="subtitle is-5">
        I am doing Recurring Revenue $3,000 / month Challenge and I am sharing
        it.
      </p>
      <div class="columns is-multiline">
        <div
          v-for="post in blogPosts"
          id="post"
          :key="post.guid"
          class="column is-3"
        >
          <a :href="post.link" target="_blank">
            <img :src="post.thumbnail" class="blog-thumbnail" />
            <p class="is-size-6 has-text-grey">
              {{ post.pubDate.split(' ')[0] }}
            </p>
            <h3 class="title is-4">{{ post.title }}</h3>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-console */
import twemoji from 'twemoji'
import axios from 'axios'

export default {
  name: 'Top',
  data() {
    return {
      blogPosts: []
    }
  },
  mounted() {
    twemoji.parse(document.body)
  },
  async created() {
    try {
      const mediumRssFeed = 'https://medium.com/feed/@TaishiKato'
      const rssToJsonApi = 'https://api.rss2json.com/v1/api.json'
      const data = { params: { rss_url: mediumRssFeed } }
      const response = await axios.get(rssToJsonApi, data)
      this.blogPosts = response.data.items
    } catch (err) {
      console.error(err.message)
    }
  }
}
</script>

<style lang="scss" scoped>
$sp: 767px;
@mixin sp {
  @media (max-width: ($sp)) {
    @content;
  }
}

// .columns {
//   @include sp {
//     margin-left: 0;
//     margin-right: 0;
//   }
// }
#medium-text {
  max-width: 600px;
  margin: 0 auto;
}

.shadow-img {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.description-bg {
  color: white;
  background-color: #ffb3b3;
  .title {
    color: white;
  }
}

.text-box {
  margin: 20px 0 0 0;
}

.desc-text {
  font-family: SF UI Text, Helvetica Neue, Helvetica, Roboto, sans-serif;
}

.blog-thumbnail {
  width: 320px;
  height: 211px;
  object-fit: cover;
  border: 1px solid hsl(0, 0%, 86%);
}

#post {
  overflow: hidden;
  .title {
    font-weight: 600;
  }
}

#coming-feature {
  .title {
    color: white;
  }
  color: white;
  background-color: #92e8ca;
}

#blog {
  margin-bottom: 4rem;
}

#coming-feature-list {
  width: 80%;
  max-width: 400px;
  margin: 0 auto;
  list-style-type: disc;
  li {
    text-align: left;
  }
}
</style>
