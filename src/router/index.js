import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Register from "../views/Register";
import Login from "../views/Login";
import CoinList from "../views/CoinList";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: { guest: true },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { guest: true },
    },
    {
        path: "/coinList",
        name: "CoinList",
        component: CoinList,
        meta: { requiresAuth: true },
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters.isAuthenticated) {
            next();
            return;
        }
        next("/login");
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.guest)) {
        if (store.getters.isAuthenticated) {
            next("/coinList");
            return;
        }
        next();
    } else {
        next();
    }
});

export default router;
