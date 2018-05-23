<template>
  <div class="alfresco">

  <!-- ÉTAT CONNECTÉ -->
    <div v-if="loggedIn">
      <button type="button" class="button is-small is-danger" @click="doLogout"><span class="icon is-small"><i class="fa fa-sign-out"></i></span><span>{{ this.username }}</span></button>
    </div>

    <!-- ÉTAT DÉCONNECTÉ -->
    <div v-else>
      <form @submit.prevent="doLogin(username, password)">
        <div class="field-body">
          <div class="field is-grouped">
            <p class="control is-expanded has-icons-left">
              <input v-model="username" class="input is-small" :class="{'is-danger':loginError}" type="text" placeholder="Nom d'utilisateur" spellcheck="false" required>
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control is-expanded has-icons-left has-icons-right">
              <input v-model="password" class="input is-small" :class="{'is-danger':loginError}" type="password" placeholder="Mot de passe" required>
              <span class="icon is-small is-left">
                <i class="fa fa-lock"></i>
              </span>
            </p>
          </div>
          <button type="submit" class="button is-small is-primary"><span class="icon is-small"><i class="fa fa-sign-in"></i></span><span>Connexion</span></button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'alfresco',
  components: {
    axios
  },
  data () {
    return {
      loggedIn: false,
      loginError: false,
      uploadUrl: "",
      ticket: "",
      username: "",
      password: ""
    }
  },
  props: {
    value: {
      uploadUrl: `${this.serverAddress}`,
      loggedIn: this.loggedIn
    },
    serverAddress: {
      type: String,
      default: ""
    }
  },
  methods: {
    doLogin(username, password) {
      axios.post(`${this.serverAddress}/alfresco/service/api/login`, {
        username: username,
        password: password
      })
      .then( (response) => {
        this.loginError = false;
        this.username = username;
        this.password = password;
        this.ticket = response.data.data.ticket;
        this.uploadUrl = `${this.serverAddress}/alfresco/service/bigbucket/document?alf_ticket=${this.ticket}`;

        this.$cookie.set('username', this.username);
        this.$cookie.set('password', this.password);
        this.$cookie.set('ticket', this.ticket);
        this.validateTicket();
      })
      .catch( (error) => {
        this.loginError = true;
        this.invalidateTicket()
      });
    },
    doLogout() {
      axios.delete(`${this.serverAddress}/alfresco/service/api/login/ticket/${this.ticket}`, {
        auth: {
          username: this.username,
          password: this.password
        }
      })
      .then( (response) => {
        this.invalidateTicket();
      })
      .catch( (error) => {
        this.invalidateTicket();
      });
    },
    validateTicket() {
      if (this.ticket && this.username && this.password) {
        axios.get(`${this.serverAddress}/alfresco/service/api/login/ticket/${this.ticket}`, {
          auth: {
            username: this.username,
            password: this.password
          }
        })
        .then( (response) => {
          this.loggedIn = true;
          this.uploadUrl = `${this.serverAddress}/alfresco/service/bigbucket/document?alf_ticket=${this.ticket}`;

          this.$emit('connect', {username: this.username, uploadUrl:this.uploadUrl} );
          this.emitValue();
          this.keepAlive();
        })
        .catch( (error) => {
          this.invalidateTicket()
        });
      } else {
        this.invalidateTicket();
      }
    },
    invalidateTicket() {
      this.$cookie.delete('ticket');
      this.$cookie.delete('password');

      this.ticket = "";
      this.password = "";
      this.uploadUrl = `${this.serverAddress}`;
      this.loggedIn = false;
      this.emitValue();
    },
    keepAlive() {
      setTimeout(this.validateTicket, 1000*60*15);
    },
    emitValue() {
      this.$emit('input', {loggedIn: this.loggedIn, username: this.username, uploadUrl: this.uploadUrl});
    }
  },
  created: function() {
    if (!this.ticket) {
      this.username = this.$cookie.get('username')?this.$cookie.get('username'):"";
      this.password = this.$cookie.get('password')?this.$cookie.get('password'):"";
      this.ticket = this.$cookie.get('ticket')?this.$cookie.get('ticket'):"";
      this.validateTicket();
    }
  }
}
</script>

<style scoped>
  .field-body {
    width: 25em;
  }
</style>
