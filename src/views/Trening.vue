<template>
  <div>
    <h1>Trening</h1>

    <h2 class="h4 mt-4">Novi trening</h2>
    <b-alert v-if="porukaGreske" variant="danger" show>{{ porukaGreske }}</b-alert>
    <b-form @submit.prevent="spremiTrening">
      <b-form-group label="Naziv treninga" label-for="naziv-treninga">
        <b-form-input
          id="naziv-treninga"
          v-model="nazivTreninga"
          required
        />
      </b-form-group>

      <h3 class="h5">Vježbe</h3>
      <b-card
        v-for="(vjezba, indeks) in vjezbe"
        :key="indeks"
        class="mb-3"
      >
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group label="Naziv vježbe">
              <b-form-input v-model="vjezba.naziv" required />
            </b-form-group>
          </b-col>
          <b-col cols="6" md="2">
            <b-form-group label="Serije">
              <b-form-input
                v-model.number="vjezba.serije"
                type="number"
                min="1"
                required
              />
            </b-form-group>
          </b-col>
          <b-col cols="6" md="2">
            <b-form-group label="Ponavljanja">
              <b-form-input
                v-model.number="vjezba.ponavljanja"
                type="number"
                min="1"
                required
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="2">
            <b-form-group label="Težina (kg)">
              <b-form-input
                v-model.number="vjezba.tezina"
                type="number"
                min="0"
                step="0.5"
                required
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-button
          type="button"
          variant="outline-danger"
          size="sm"
          :disabled="vjezbe.length === 1"
          @click="ukloniVjezbu(indeks)"
        >
          Ukloni
        </b-button>
      </b-card>

      <b-button type="button" variant="secondary" class="mb-3" @click="dodajVjezbu">
        + Dodaj vježbu
      </b-button>
      <div>
        <b-button type="submit" variant="primary">Spremi trening</b-button>
      </div>
    </b-form>

    <hr class="my-4" />

    <h2 class="h4">Gotovi planovi</h2>
    <b-row>
      <b-col
        v-for="plan in planovi"
        :key="plan.id"
        cols="12"
        md="4"
        class="mb-3"
      >
        <b-card :title="plan.naziv">
          <p class="mb-2">Cilj: {{ plan.cilj }}</p>
          <ul>
            <li v-for="(vjezba, indeks) in plan.vjezbe" :key="indeks">
              {{ vjezba.naziv }}
            </li>
          </ul>
          <b-button variant="success" @click="dodajPlan(plan)">
            Dodaj u moje treninge
          </b-button>
        </b-card>
      </b-col>
    </b-row>

    <hr class="my-4" />

    <h2 class="h4">Moji treninzi</h2>
    <p v-if="treninzi.length === 0">Još nemaš spremljenih treninga.</p>
    <b-list-group v-else>
      <b-list-group-item
        v-for="trening in treninzi"
        :key="trening.id"
        :variant="jeOmiljen(trening) ? 'warning' : null"
        class="d-flex justify-content-between align-items-start"
      >
        <div>
          <strong>
            <span v-if="jeOmiljen(trening)" class="omiljena-zvjezdica" aria-hidden="true">★ </span>
            {{ trening.naziv }}
          </strong>
          <ul class="mb-0 mt-2">
            <li
              v-for="(vjezba, indeksVjezbe) in trening.vjezbe"
              :key="indeksVjezbe"
            >
              {{ formatirajVjezbu(vjezba) }}
            </li>
          </ul>
        </div>
        <div class="d-flex ml-3 flex-shrink-0">
          <b-button
            :variant="jeOmiljen(trening) ? 'warning' : 'outline-secondary'"
            size="sm"
            class="mr-2"
            @click="prebaciOmiljeno(trening)"
          >
            {{ jeOmiljen(trening) ? "Ukloni iz omiljenih" : "Označi kao omiljeno" }}
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            @click="obrisiTrening(trening.id)"
          >
            Obriši
          </b-button>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import firebase, { auth, db } from "../firebase";
import { planovi } from "../data/plans";

function praznaVjezba() {
  return {
    naziv: "",
    ponavljanja: null,
    serije: null,
    tezina: null,
  };
}

export default {
  name: "Trening",
  data() {
    return {
      nazivTreninga: "",
      vjezbe: [praznaVjezba()],
      treninzi: [],
      porukaGreske: "",
      planovi,
    };
  },
  mounted() {
    this.ucitajTreninze();
  },
  methods: {
    dodajVjezbu() {
      this.vjezbe.push(praznaVjezba());
    },
    ukloniVjezbu(indeks) {
      if (this.vjezbe.length > 1) {
        this.vjezbe.splice(indeks, 1);
      }
    },
    formatirajVjezbu(vjezba) {
      return `${vjezba.naziv} — ${vjezba.serije} x ${vjezba.ponavljanja} (${vjezba.tezina} kg)`;
    },
    jeOmiljen(trening) {
      return trening.omiljeno === true;
    },
    prazniFormu() {
      this.nazivTreninga = "";
      this.vjezbe = [praznaVjezba()];
      this.porukaGreske = "";
    },
    ucitajTreninze() {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      db.collection("treninzi")
        .where("uid", "==", korisnik.uid)
        .get()
        .then((snapshot) => {
          const treninzi = [];
          snapshot.forEach((dokument) => {
            const podaci = dokument.data();
            treninzi.push({
              id: dokument.id,
              ...podaci,
              omiljeno: podaci.omiljeno === true,
            });
          });
          treninzi.sort((a, b) => {
            const vrijemeA = a.vrijemeUnosa ? a.vrijemeUnosa.toMillis() : 0;
            const vrijemeB = b.vrijemeUnosa ? b.vrijemeUnosa.toMillis() : 0;
            return vrijemeB - vrijemeA;
          });
          this.treninzi = treninzi;
        })
        .catch(() => {
          this.porukaGreske = "Greška pri učitavanju treninga.";
        });
    },
    spremiTrening() {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      this.porukaGreske = "";

      db.collection("treninzi")
        .add({
          uid: korisnik.uid,
          naziv: this.nazivTreninga,
          vjezbe: this.vjezbe.map((vjezba) => ({
            naziv: vjezba.naziv,
            ponavljanja: vjezba.ponavljanja,
            serije: vjezba.serije,
            tezina: vjezba.tezina,
          })),
          omiljeno: false,
          vrijemeUnosa: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.prazniFormu();
          this.ucitajTreninze();
        })
        .catch(() => {
          this.porukaGreske = "Greška pri spremanju treninga.";
        });
    },
    dodajPlan(plan) {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      this.porukaGreske = "";

      db.collection("treninzi")
        .add({
          uid: korisnik.uid,
          naziv: plan.naziv,
          vjezbe: plan.vjezbe.map((v) => ({
            naziv: v.naziv,
            ponavljanja: v.ponavljanja,
            serije: v.serije,
            tezina: v.tezina,
          })),
          omiljeno: false,
          vrijemeUnosa: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.ucitajTreninze();
        })
        .catch(() => {
          this.porukaGreske = "Greška pri spremanju treninga.";
        });
    },
    prebaciOmiljeno(trening) {
      const korisnik = auth.currentUser;
      if (!korisnik) {
        return;
      }

      this.porukaGreske = "";
      const novoStanje = !this.jeOmiljen(trening);

      db.collection("treninzi")
        .doc(trening.id)
        .update({ omiljeno: novoStanje })
        .then(() => {
          const indeks = this.treninzi.findIndex((t) => t.id === trening.id);
          if (indeks !== -1) {
            this.$set(this.treninzi[indeks], "omiljeno", novoStanje);
          }
        })
        .catch(() => {
          this.porukaGreske = "Greška pri ažuriranju omiljenog treninga.";
        });
    },
    obrisiTrening(idTreninga) {
      this.porukaGreske = "";

      db.collection("treninzi")
        .doc(idTreninga)
        .delete()
        .then(() => {
          this.ucitajTreninze();
        })
        .catch(() => {
          this.porukaGreske = "Greška pri brisanju treninga.";
        });
    },
  },
};
</script>

<style scoped>
.omiljena-zvjezdica {
  color: #856404;
}
</style>
