<template>
  <div id="app">
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand to="/">Kinetic</b-navbar-brand>
      <b-navbar-nav v-if="korisnik">
        <b-nav-item to="/trening">Trening</b-nav-item>
        <b-nav-item to="/statistika">Statistika</b-nav-item>
        <b-nav-item to="/profil">Profil</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-if="korisnik" class="ml-auto">
        <b-nav-text class="text-light mr-2">{{ korisnik.email }}</b-nav-text>
        <b-nav-item>
          <b-button size="sm" variant="outline-light" @click="odjava">
            Odjava
          </b-button>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import { auth } from "./firebase";

export default {
  name: "App",
  data() {
    return {
      korisnik: null,
    };
  },
  created() {
    auth.onAuthStateChanged((korisnik) => {
      this.korisnik = korisnik;
    });
  },
  methods: {
    odjava() {
      auth.signOut().then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>
