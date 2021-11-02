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

    async getCoinList({ commit, dispatch }) {
        // state.coinList.slice(0,state.coinList.length)
        if (!state.coinList.length) {
            try {
                var res = await axios.get(
                    "https://api.coinpaprika.com/v1/coins",
                    {
                        withCredentials: false,
                    }
                );
                // console.log(res);
                for (var i = 0; i < state.limit; i++) {
                    setTimeout(() => {
                        dispatch("getPriceWithLimit", res);
                    }, 2000);
                }
                // console.log(timer);
                // for (var i = 0; i < state.limit; i++) {
                //     var coinResponse = await axios.get(
                //         `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
                //         {
                //             withCredentials: false,
                //         }
                //     );
                //     res.data[i].price = coinResponse.data.quotes.USD.price;
                // }
                commit("setCoinList", res.data.slice(0, state.limit));
                commit("setLimit", state.limit);
                commit("setNextPage", 10);
            } catch (err) {
                console.log("err", err);
            }
        }
    },

    async getPriceWithLimit({ state }, data) {
        for (var i = 0; i < state.limit; i++) {
            var coinResponse = await axios.get(
                `https://api.coinpaprika.com/v1/tickers/${data.data[i].id}`,
                {
                    withCredentials: false,
                }
            );
            data.data[i].price = coinResponse.data.quotes.USD.price;
        }
        ///update the code
    },

    async getNextCoinList({ commit, state }) {
        if (state.nextPage) {
            try {
                var res = await axios.get(
                    "https://api.coinpaprika.com/v1/coins",
                    {
                        withCredentials: false,
                    }
                );

                for (
                    var i = state.nextPage;
                    i < state.nextPage + state.limit;
                    i++
                ) {
                    var coinResponse = await axios.get(
                        `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
                        {
                            withCredentials: false,
                        }
                    );
                    res.data[i].price = coinResponse.data.quotes.USD.price;
                    state.coinList.push(res.data[i]);
                }
                commit("setNextPage", state.nextPage + state.limit);
            } catch (err) {
                console.log("err", err);
            }
        }
    },

    async getUpdatedPrice({ commit, state }) {
        try {
            console.log(state.coinList.length);
            for (let i = 0; i < 1; i++) {
                // console.log("update", state.coinList[i].id);
                var coinResponse = await axios.get(
                    `https://api.coinpaprika.com/v1/tickers/${state.coinList[i].id}`,
                    {
                        withCredentials: false,
                    }
                );

                if (
                    state.coinList[i].price !==
                    coinResponse.data.quotes.USD.price
                ) {
                    console.log("change");
                    console.log(
                        state.coinList[i].price,
                        coinResponse.data.quotes.USD.price
                    );
                }

                // state.coinList[i].price = coinResponse.data.quotes.USD.price;

                // state.coinList.push(state.coinList[i]);
            }
            commit("setCoinList", state.coinList);

            //let coinPrice = state.coinList.find(coin => coin.id === sta)
        } catch (err) {
            console.log("err", err);
        }
    },

    async getThisCoinPrice({ state, commit }, data) {
        console.log("get coin", data);
        try {
            // for (let i = 0; i < 1; i++) {
            // console.log("update", state.coinList[i].id);
            var coinResponse = await axios.get(
                `https://api.coinpaprika.com/v1/tickers/${data}`,
                {
                    withCredentials: false,
                }
            );

            state.coinList.filter((coin) => {
                // console.log(state.coinList);
                if (coin.id === data) {
                    if (coin.price !== coinResponse.data.quotes.USD.price) {
                        console.log("change");
                    }

                    coin.price = coinResponse.data.quotes.USD.price;
                }
            });

            commit("setCoinList", state.coinList);
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
