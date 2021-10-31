import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
// import * as Cookies from "js-cookie";

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
    // state: {
    //     coinList: [],
    // },

    modules: {
        auth,
    },

    plugins: [createPersistedState()],
});
