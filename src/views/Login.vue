<template>
  <div>
    <h1>Prijava</h1>
    <b-alert v-if="porukaGreske" variant="danger" show>{{ porukaGreske }}</b-alert>
    <b-form @submit.prevent="prijavi">
      <b-form-group label="E-mail" label-for="prijava-email">
        <b-form-input
          id="prijava-email"
          v-model="email"
          type="email"
          required
        />
      </b-form-group>
      <b-form-group label="Lozinka" label-for="prijava-lozinka">
        <b-form-input
          id="prijava-lozinka"
          v-model="lozinka"
          type="password"
          required
        />
      </b-form-group>
      <b-button type="submit" variant="primary">Prijavi se</b-button>
    </b-form>
    <p class="mt-3">
      <router-link to="/register">Nemaš račun? Registriraj se</router-link>
    </p>
  </div>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      lozinka: "",
      porukaGreske: "",
    };
  },
  methods: {
    prijavi() {
      this.porukaGreske = "";
      auth
        .signInWithEmailAndPassword(this.email, this.lozinka)
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => {
          this.porukaGreske = "Pogrešan e-mail ili lozinka.";
        });
    },
  },
};
</script>
