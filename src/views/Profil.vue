<template>
  <div>
    <h1>Profil</h1>

    <b-card class="mb-4">
      <p class="mb-1"><strong>E-mail</strong></p>
      <p class="mb-0">{{ emailKorisnika }}</p>
    </b-card>

    <h2 class="h4">Podsjetnik za vježbanje</h2>

    <b-alert v-if="porukaGreske" variant="danger" show>{{ porukaGreske }}</b-alert>
    <b-alert v-if="porukaUspjeha" variant="success" show>{{ porukaUspjeha }}</b-alert>

    <b-form @submit.prevent="spremiPodsjetnik">
      <b-form-group label="Vrijeme podsjetnika" label-for="vrijeme-podsjetnika">
        <b-form-input
          id="vrijeme-podsjetnika"
          v-model="vrijemePodsjetnika"
          type="time"
        />
      </b-form-group>

      <b-form-group label="Dani u tjednu">
        <b-form-checkbox-group
          v-model="odabraniDani"
          :options="daniUTjednu"
          name="dani-podsjetnika"
          stacked
        />
      </b-form-group>

      <b-button type="submit" variant="primary">Spremi podsjetnik</b-button>
    </b-form>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";

const DANI_U_TJEDNU = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

export default {
  name: "Profil",
  data() {
    return {
      vrijemePodsjetnika: "",
      odabraniDani: [],
      daniUTjednu: DANI_U_TJEDNU,
      porukaGreske: "",
      porukaUspjeha: "",
    };
  },
  computed: {
    emailKorisnika() {
      const korisnik = auth.currentUser;
      return korisnik ? korisnik.email : "";
    },
  },
  mounted() {
    this.ucitajPodsjetnik();
  },
  methods: {
    ucitajPodsjetnik() {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      this.porukaGreske = "";

      db.collection("korisnici")
        .doc(korisnik.uid)
        .get()
        .then((dokument) => {
          if (!dokument.exists) {
            return;
          }

          const podaci = dokument.data();
          this.vrijemePodsjetnika = podaci.vrijemePodsjetnika || "";
          this.odabraniDani = Array.isArray(podaci.dani) ? [...podaci.dani] : [];
        })
        .catch(() => {
          this.porukaGreske = "Greška pri učitavanju podsjetnika.";
        });
    },
    spremiPodsjetnik() {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      this.porukaGreske = "";
      this.porukaUspjeha = "";

      db.collection("korisnici")
        .doc(korisnik.uid)
        .set({
          vrijemePodsjetnika: this.vrijemePodsjetnika,
          dani: this.odabraniDani,
        })
        .then(() => {
          this.porukaUspjeha = "Podsjetnik je uspješno spremljen.";
        })
        .catch(() => {
          this.porukaGreske = "Greška pri spremanju podsjetnika.";
        });
    },
  },
};
</script>
