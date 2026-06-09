import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Trening from "../views/Trening.vue";
import Statistika from "../views/Statistika.vue";
import Profil from "../views/Profil.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import { auth } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/trening",
    name: "Trening",
    component: Trening,
    meta: { requiresAuth: true },
  },
  {
    path: "/statistika",
    name: "Statistika",
    component: Statistika,
    meta: { requiresAuth: true },
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profil,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

router.beforeEach((to, from, next) => {
  const zahtijevaAuth = to.matched.some((ruta) => ruta.meta.requiresAuth);
  const prijavljen = auth.currentUser;

  if (zahtijevaAuth && !prijavljen) {
    next("/login");
  } else if (prijavljen && (to.path === "/login" || to.path === "/register")) {
    next("/");
  } else {
    next();
  }
});

export default router;
