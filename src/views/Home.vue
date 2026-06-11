<template>
  <div>
    <h1>Kinetic</h1>
    <p class="text-muted">Dnevni pregled</p>

    <b-alert v-if="porukaGreske" variant="danger" show>{{ porukaGreske }}</b-alert>

    <b-card class="mb-3">
      <h2 class="h5">Današnji podsjetnik</h2>
      <p v-if="!imaPodsjetnik" class="mb-2">
        Nemaš postavljen podsjetnik za vježbanje.
      </p>
      <p v-else-if="danasJeDanZaTrening" class="mb-2">
        Danas je dan za trening u {{ vrijemePodsjetnika }}.
      </p>
      <p v-else class="mb-2">
        Danas nije dan za trening prema podsjetniku.
        <span v-if="vrijemePodsjetnika">
          Vrijeme podsjetnika: {{ vrijemePodsjetnika }}.
        </span>
        Dani: {{ daniPodsjetnika.join(", ") }}.
      </p>
      <router-link to="/profil">Uredi podsjetnik u Profilu</router-link>
    </b-card>

    <b-card class="mb-3">
      <h2 class="h5">Napredak</h2>
      <p class="mb-2">
        Ukupno spremljenih treninga: <strong>{{ ukupnoTreninga }}</strong>
      </p>
      <router-link to="/statistika">Pogledaj statistiku</router-link>
    </b-card>

    <b-card class="mb-3">
      <h2 class="h5">Omiljeni treninzi</h2>
      <p v-if="omiljeniTreninzi.length === 0" class="mb-2">
        Nemaš označenih omiljenih treninga.
      </p>
      <ul v-else class="mb-2">
        <li v-for="trening in omiljeniTreninzi" :key="trening.id">
          ★ {{ trening.naziv }}
        </li>
      </ul>
      <router-link to="/trening">Idi na treninge</router-link>
    </b-card>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";

// getDay(): 0 = nedjelja, 1 = ponedjeljak, ...
const DANAS_KRATICA = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];

export default {
  name: "Home",
  data() {
    return {
      treninzi: [],
      vrijemePodsjetnika: "",
      daniPodsjetnika: [],
      porukaGreske: "",
    };
  },
  computed: {
    ukupnoTreninga() {
      return this.treninzi.length;
    },
    omiljeniTreninzi() {
      return this.treninzi.filter((trening) => trening.omiljeno === true);
    },
    imaPodsjetnik() {
      return (
        this.vrijemePodsjetnika !== "" &&
        this.daniPodsjetnika.length > 0
      );
    },
    danasnjaKratka() {
      return DANAS_KRATICA[new Date().getDay()];
    },
    danasJeDanZaTrening() {
      if (!this.imaPodsjetnik) {
        return false;
      }
      return this.daniPodsjetnika.includes(this.danasnjaKratka);
    },
  },
  mounted() {
    this.ucitajPregled();
  },
  methods: {
    ucitajPregled() {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      this.porukaGreske = "";

      const upitTreninzi = db
        .collection("treninzi")
        .where("uid", "==", korisnik.uid)
        .get();

      const upitPodsjetnik = db.collection("korisnici").doc(korisnik.uid).get();

      Promise.all([upitTreninzi, upitPodsjetnik])
        .then(([snapshotTreninzi, dokumentKorisnik]) => {
          const treninzi = [];
          snapshotTreninzi.forEach((dokument) => {
            const podaci = dokument.data();
            treninzi.push({
              id: dokument.id,
              ...podaci,
              omiljeno: podaci.omiljeno === true,
            });
          });
          this.treninzi = treninzi;

          if (dokumentKorisnik.exists) {
            const podaci = dokumentKorisnik.data();
            this.vrijemePodsjetnika = podaci.vrijemePodsjetnika || "";
            this.daniPodsjetnika = Array.isArray(podaci.dani)
              ? [...podaci.dani]
              : [];
          }
        })
        .catch(() => {
          this.porukaGreske = "Greška pri učitavanju pregleda.";
        });
    },
  },
};
</script>
