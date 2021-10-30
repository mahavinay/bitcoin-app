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
        await dispatch("LogIn", UserForm);
    },

    LogIn({ commit }, user) {
        commit("setUser", user.get("username"));
    },

    async getCoinList({ commit }) {
        try {
            let res = await axios.get("https://api.coinpaprika.com/v1/coins", {
                withCredentials: false,
            });

            for (var i = 0; i <= 10; i++) {
                var coinResponse = await axios.get(
                    `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
                    {
                        withCredentials: false,
                    }
                );
                state.coinPriceList.push(coinResponse.data.quotes.USD.price);
            }
            console.log("priceList", state.coinPriceList);
            commit("setCoinList", res.data);
            //commit("setCoinPriceList", coinResponse.data.quotes.USD);
        } catch (err) {
            console.log("err", err);
        }
    },

    // async getCoinPriceList({ commit }, coinId) {
    //     console.log("get");
    //     try {
    //         let res = await axios.get(
    //             `https://api.coinpaprika.com/v1/tickers/${coinId}`,
    //             {
    //                 withCredentials: false,
    //             }
    //         );
    //         // console.log("id", res.data.total_supply);
    //         commit("setCoinPriceList", res.data);
    //     } catch (err) {
    //         console.log("err", err);
    //     }
    // },

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
