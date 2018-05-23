<template>
  <div class="app">

    <header class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <router-link :to="{path:'/'}" class="navbar-item" :class="{ 'is-active': $route.name==='Home' }">
            <img class="header-logo" src="/static/assets/images/logo_32x32.png">
            <span class="title is-4"><i>Livre numérique</i></span>
          </router-link>

          <div v-if="alfSession.loggedIn" class="navbar-burger burger" data-target="livrenumMenu" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
        <div class="navbar-menu" id="livrenumMenu">
          <div class="navbar-start">
            <router-link v-if="alfSession.loggedIn" :to="{path:'/fiches'}" class="navbar-item" :class="{ 'is-active': $route.name==='Works' }"><span>Fiches</span></router-link>
            <router-link v-if="alfSession.loggedIn" :to="{path:'/createurs'}" class="navbar-item" :class="{ 'is-active': $route.name==='Actors' }"><span>Créateurs</span></router-link>
          </div>
          <div class="navbar-end">
            <alfresco server-address="http://livrenum.crilcq.org" v-model="alfSession" class="navbar-item is-hidden-touch" @connect="connect"></alfresco>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <router-view v-if="alfSession.loggedIn"></router-view>
      <div v-else>
        <h1 class="title">Bienvenue</h1>
        <p>Lorem ipsum laborum non consequat aliquip ea cupidatat sed et consectetur eiusmod proident sit magna nisi minim sit consectetur cillum et consectetur dolor est elitpsum laborum non consequat aliquip ea cupidatat sed et consectetur eiusmod proident sit magna nisi minim sit consectetur cillum et consectetur dolor est elitpsum laborum non consequat aliquip ea cupidatat sed et consectetur eiusmod proident sit magna nisi minim sit consectetur cillum et consectetur dolor est elitpsum laborum non consequat aliquip ea cupidatat sed et consectetur eiusmod proident sit magna nisi minim sit consectetur cillum et consectetur dolor est elit incididunt in.</p>
      </div>
    </div>

    <footer v-if="alfSession.loggedIn" class="footer">
      <div class="container">
        <div class="has-text-centered">
          <div class="title is-4">&copy; 2017 - CRILCQ</div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
import Alfresco from '@/components/alfresco'

export default {
  name: 'app',
  components: { Alfresco },
  data: function() {
    return {
      alfSession: {}
    }
  },
  computed: {
    uploadUrl: function() {
      return this.alfSession.uploadUrl;
    }
  },
  methods: {
    connect(session) {
      this.$store.commit('setCurrentUser', session.username);
      this.$store.commit('setUploadUrl', session.uploadUrl);
    },
    toggleMenu(e) {
      e.target.classList.toggle("is-active");
      document.getElementById(e.target.dataset.target).classList.toggle("is-active");
    }
  },
  created: function() {
    this.$store.dispatch('getWorks');
    this.$store.dispatch('getActors');

    this.$router.beforeEach( (to, from, next) => {
      this.$store.dispatch('getWorks');
      this.$store.dispatch('getActors');
      window.scrollTo(0, 0);
      next();
    });
  }
}
</script>

<style lang="less" scoped>
  .header-logo {
    margin-right: .5em;
  }
</style>

<style lang="less">
  h1, h2, h3, h4, h5, h6 {
    // font-weight: lighter !important;
  }
  textarea {
    resize:none !important;
  }
  figcaption {
    color: #888;
  }
  footer {
    margin-top: 2em;
  }
  .input[type="search"],
  .textarea[type="search"] {
    border-radius: 3px !important;
  }

  select[multiple].multi-select {
      all: initial;
      font: inherit;
      overflow-y: auto;
      border-radius: 3px;
      padding-bottom: 0.5em;
      padding-left: 0.625em;
      padding-top: 0.5em;
      background-color: white;
      border: 1px solid #dbdbdb;
      color: #363636;
      cursor: pointer;
      display: block;
      outline: none;
      padding-right: 2.5em;
  }

  select[multiple].multi-select:active, select[multiple].multi-select:focus {
      border-color: #00d1b2;
  }

  .navbar {
    margin-bottom: 1em;
  }
  .navbar-item.is-active {
    border-bottom: 2px #00d1b2 solid !important;
  }
  .small-text {
    font-size: .85em;
  }
  .is-muted {
    color: #ccc !important;
  }
  .is-bold {
    font-weight: bold;
  }
  .ucFirst {
    display: inline-block;
    &:first-letter {
      text-transform: uppercase;
    }
  }
  .list-unstyled {
    margin: 0 !important;

    li {
      list-style-type: none;
    }
  }
  .is-link {
    text-decoration: none !important;
  }

  .info-block {
    margin-bottom: 1.5em;
  }
</style>
