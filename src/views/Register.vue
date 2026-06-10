<template>
  <div>
    <h1>Registracija</h1>
    <b-alert v-if="porukaGreske" variant="danger" show>{{ porukaGreske }}</b-alert>
    <b-form @submit.prevent="registriraj">
      <b-form-group label="E-mail" label-for="registracija-email">
        <b-form-input
          id="registracija-email"
          v-model="email"
          type="email"
          required
        />
      </b-form-group>
      <b-form-group label="Lozinka" label-for="registracija-lozinka">
        <b-form-input
          id="registracija-lozinka"
          v-model="lozinka"
          type="password"
          required
        />
      </b-form-group>
      <b-button type="submit" variant="primary">Registriraj se</b-button>
    </b-form>
    <p class="mt-3">
      <router-link to="/login">Već imaš račun? Prijavi se</router-link>
    </p>
  </div>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "Register",
  data() {
    return {
      email: "",
      lozinka: "",
      porukaGreske: "",
    };
  },
  methods: {
    mapirajGresku(kod) {
      const poruke = {
        "auth/email-already-in-use": "Taj e-mail je već registriran.",
        "auth/invalid-email": "E-mail nije ispravan.",
        "auth/weak-password": "Lozinka mora imati barem 6 znakova.",
      };
      return poruke[kod] || "Došlo je do greške. Pokušaj ponovno.";
    },
    registriraj() {
      this.porukaGreske = "";
      auth
        .createUserWithEmailAndPassword(this.email, this.lozinka)
        .then(() => {
          this.$router.push("/");
        })
        .catch((greska) => {
          this.porukaGreske = this.mapirajGresku(greska.code);
        });
    },
  },
};
</script>
