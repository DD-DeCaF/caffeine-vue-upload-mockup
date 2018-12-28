<template>
  <div>
    <v-btn color="blue" @click="logout" v-if="authenticated">
      <v-icon>power_settings_new</v-icon>
      Log out
    </v-btn>

    <v-dialog v-model="loginDialog" width="700">
      <div slot="activator">
        <v-btn color="blue" v-if="!authenticated">
          <v-icon>lock</v-icon>
          Log in
        </v-btn>
      </div>

      <v-card>
        <v-layout row class="py-3">
          <v-flex xs6 class="login-flex-left">
            <v-card-text>
              <p>Log in with your social account</p>
              <v-btn class="social-login-button github" @click="socialLogin('github')">
                <img src="../assets/images/github.svg" class="logo"> Github
              </v-btn>
              <v-btn class="social-login-button google" @click="socialLogin('google')">
                <img src="../assets/images/google-plus.svg" class="logo"> Google
              </v-btn>
              <v-btn class="social-login-button twitter" @click="socialLogin('twitter')">
                <img src="../assets/images/twitter.svg" class="logo"> Twitter
              </v-btn>
            </v-card-text>
          </v-flex>
          <v-flex xs6>
            <v-card-text>
              <form>
                <p>Or you can <a href="mailto:niko@biosustain.dtu.dk">contact us</a> and we provide you with
                  credentials</p>
                <v-text-field
                  label="Email"
                  type="email"
                  v-model="email.value"
                  :rules="email.rules"
                  prepend-icon="email"
                  required></v-text-field>
                <v-text-field
                  label="Password"
                  type="password"
                  v-model="password.value"
                  :rules="password.rules"
                  prepend-icon="lock"
                  required></v-text-field>
                <p v-if="loginInvalidCredentials" class="red--text">Invalid credentials, please try again.</p>
                <p v-if="loginError" class="red--text">There was a problem contacting the authentication server. Please
                  try again.</p>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-progress-circular indeterminate color="primary" v-if="loginInProgress"></v-progress-circular>
              <v-btn color="primary" flat @click="emailLogin" :disabled="loginInProgress">
                Log in
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-card>
  </v-dialog>
  </div>
</template>

<script>
import * as axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import settings from '@/settings';

export default {
  data: () => ({
    loginDialog: false,
    loginInProgress: false,
    loginInvalidCredentials: false,
    loginError: false,
    email: {
      value: null,
      rules: [v => /.+@.+/.test(v) || 'E-mail must be a valid address'],
    },
    password: {
      value: null,
      rules: [v => !!v || 'Enter your password'],
    },
    firebaseProviders: {
      github: new firebase.auth.GithubAuthProvider(),
      google: new firebase.auth.GoogleAuthProvider(),
      twitter: new firebase.auth.TwitterAuthProvider(),
    },
  }),
  methods: {
    emailLogin() {
      this.loginInvalidCredentials = false;
      this.login({ email: this.email.value, password: this.password.value }, 'local');
    },
    socialLogin(providerKey) {
      firebase.auth().signOut();
      const provider = this.firebaseProviders[providerKey];
      if (providerKey === 'github') {
        provider.addScope('user:email');
      } else if (providerKey === 'google') {
        provider.addScope('email');
      }
      return firebase.auth().signInWithPopup(provider).then(
        result => firebase.auth().currentUser.getIdToken(true).then(
          (idToken) => {
            const credentials = { uid: result.user.uid, token: idToken };
            this.login(credentials, 'firebase');
          },
        ),
      ).catch(() => {
        this.loginError = true;
      });
    },
    login(params, type) {
      this.loginInProgress = true;
      axios.post(`${settings.apis.iam}/authenticate/${type}`, params)
        .then((response) => {
          this.$store.commit('login', response.data);
          localStorage.setItem('jwt', JSON.stringify(response.data));
          this.loginDialog = false;
          this.$router.push('/');
        }).catch((error) => {
          if (error.response && error.response.status === 401) {
            this.loginInvalidCredentials = true;
          } else {
            this.loginError = true;
          }
        }).then(() => {
          this.loginInProgress = false;
        });
    },
    logout() {
      localStorage.removeItem('jwt');
      this.$store.commit('logout');
    },
  },
  computed: {
    authenticated() {
      return this.$store.state.session.authenticated;
    },
  },
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyApbLMKp7TprhjH75lpcmJs514uI11fEIo',
      authDomain: 'dd-decaf-cfbf6.firebaseapp.com',
      databaseURL: 'https://dd-decaf-cfbf6.firebaseio.com',
      projectId: 'dd-decaf-cfbf6',
      storageBucket: 'dd-decaf-cfbf6.appspot.com',
      messagingSenderId: '972933293195',
    });

    axios.interceptors.request.use((config) => {
      // For authenticated users, add authorization header to all HTTP requests going to trusted URLs
      const authenticated = this.$store.state.session.authenticated;
      const trustedURL = settings.trustedURLs.some(url => config.url.startsWith(url));
      const notRefreshRequest = config.url !== `${settings.apis.iam}/refresh`;
      if (authenticated && trustedURL && notRefreshRequest) {
        config.headers.Authorization = `Bearer ${this.$store.state.session.jwt.jwt}`;
      }
      return config;
    });
  },
};
</script>

<style scoped>
.social-login-button {
  display: block;
  width: 100%;
  text-transform: none;
}

.social-login-button .logo {
  width: 38px;
  height: 38px;
  padding-right: 10px;
}

.social-login-button.github {
  background-color: #24292E !important;
  color: white;
}

.social-login-button.google {
  background-color: #D9453D !important;
  color: white;
}

.social-login-button.twitter {
  background-color : rgb(66, 156, 214) !important;
  color: white;
}

.login-flex-left {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
