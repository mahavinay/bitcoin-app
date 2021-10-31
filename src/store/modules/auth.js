import axios from "axios";

const state = {
    user: null,
    coinList: [],
    coinPriceList: [],
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    stateCoinList: (state) => state.coinList,
    stateUser: (state) => state.user,
    stateCoinPriceList: (state) => state.coinPriceList,
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
            let res = await axios.get("https://api.coinpaprika.com/v1/coins", {
                withCredentials: false,
            });

            for (var i = 0; i <= 30; i++) {
                var coinResponse = await axios.get(
                    `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
                    {
                        withCredentials: false,
                    }
                );
                state.coinPriceList.push(coinResponse.data.quotes.USD.price);
            }
            console.log("priceList", state.coinPriceList);
            commit("setCoinList", res.data.slice(0, 30));
            // store.commit('getCoinList');
            // return store.state.coinList;
            commit("setCoinPriceList", state.coinPriceList);
        } catch (err) {
            console.log("err", err);
        }
        // store.commit('getCoinList');
    },

    // getSortCoinByKey({ commit }, prop) {
    //     if (this.order == "asc") {
    //         this.CoinList.sort((a, b) => a[prop].localeCompare(b[prop]));
    //         this.order = "desc";
    //         commit("setCoinList", this.CoinList);
    //         // this.$store.state.CoinList;
    //         // this.$store.commit("sortCoinByKey");
    //     } else {
    //         this.CoinList.sort((a, b) => b[prop].localeCompare(a[prop]));
    //         this.order = "asc";
    //         commit("setCoinList", this.CoinList);
    //         // this.$store.state.CoinList;
    //         // this.$store.commit("sortCoinByKey");
    //     }
    //     // return store.state.coinList;
    // },

    async logout({ commit }) {
        let user = null;
        commit("logout", user);
        // store.commit('logout');
    },
};

const mutations = {
    setUser(state, username) {
        state.user = username;
    },

    setCoinList(state, coinList) {
        state.coinList = coinList;
    },

    setCoinPriceList(state, coinPriceList) {
        state.coinPriceList = coinPriceList;
    },

    logout(state, user) {
        state.user = user;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
