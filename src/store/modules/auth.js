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
            console.log("priceList", state.coinPriceList);
            // store.commit('getCoinList');
            // return store.state.coinList;
            commit("setCoinPriceList", state.coinPriceList);
            // commit("setCoinList", state.coinList.slice(0,30))
            console.log("coin...auth", state.coinList);
        } catch (err) {
            console.log("err", err);
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
