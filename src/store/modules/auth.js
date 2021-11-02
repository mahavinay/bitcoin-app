import axios from "axios";
// import _ from 'lodash';

const state = {
    user: null,
    coinList: [],
    limit: 10,
    nextPage: "",
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    stateCoinList: (state) => state.coinList,
    stateUser: (state) => state.user,
    stateNextPage: (state) => state.nextPage,
    stateLimit: (state) => state.limit,
};

const actions = {
    async Register({ dispatch }, form) {
        let UserForm = new FormData();
        UserForm.append("username", form.username);
        UserForm.append("password", form.password);
        await dispatch("login", UserForm);
    },

    login({ commit }, user) {
        commit("setUser", user.get("username"));
        // store.commit('Login')
    },

    

    async getCoinList({ commit }) {
        try {
            var res = await axios.get("https://api.coinpaprika.com/v1/coins", {
               
                withCredentials: false,
            });

    
            for (var i = 0; i < state.limit; i++) {
                var coinResponse = await axios.get(
                    `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
                    {
                        withCredentials: false,
                    }
                );
                res.data[i].price = coinResponse.data.quotes.USD.price;

            }
            commit("setCoinList", res.data.slice(0, state.limit));
            commit("setLimit", state.limit)
            commit("setNextPage", 10);
        } catch (err) {
            console.log("err", err);
        }
    },

    async getNextCoinList({ commit, state }) {
        if(state.nextPage) {
        try {

            var res = await axios.get("https://api.coinpaprika.com/v1/coins", {
               
                withCredentials: false,
            });
    
            for (var i = state.nextPage; i < state.nextPage+state.limit; i++) {
                var coinResponse = await axios.get(
                    `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
                    {
                        withCredentials: false,
                    }
                );
                res.data[i].price = coinResponse.data.quotes.USD.price;
                state.coinList.push(res.data[i]);

            }
            commit("setNextPage", state.nextPage+state.limit);
        } catch (err) {
            console.log("err", err);
        }
    }
    },

    async logout({ commit }) {
        let user = null;
        commit("logout", user);
    },
};

const mutations = {
    setUser(state, username) {
        state.user = username;
    },

    setCoinList(state, coinList) {
        state.coinList = coinList;
    },

    setNextPage(state, nextPage) {
        console.log("Next ", nextPage);
        state.nextPage = nextPage;
    },

    logout(state, user) {
        state.user = user;
    },

    setLimit(state, limit) {
        state.limit = limit;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
