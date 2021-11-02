import axios from "axios";
// import _ from 'lodash';

const state = {
    user: null,
    coinList: [],
    limit: 10,
    nextPage: "",
    // completeCoinList: [],
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    stateCoinList: (state) => state.coinList,
    stateUser: (state) => state.user,
    stateNextPage: (state) => state.nextPage,
    stateLimit: (state) => state.limit,
    // stateCompleteCoinList: (state) => state.completeCoinList,
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

    async getCoinList({ dispatch, state }) {
        // state.coinList.splice(0, state.coinList.length);
         console.log("on load", state.coinList);
         console.log("state.coinList.length", state.coinList.length)
        // state.completeCoinList.slice(0, state.completeCoinList.length);
        // console.log("complete",state.completeCoinList);
        if (!state.coinList.length) {
            try {
                var res = await axios.get(
                    "https://api.coinpaprika.com/v1/coins",
                    {
                        withCredentials: false,
                    }
                );
                // console.log(res);
                // for (let j=0; j<3; j++){
                // for (var i = 0; i < state.limit; i++) {
                setTimeout(() => {
                    dispatch("getPriceWithLimit", res);
                }, 3000);
                // }

                // }

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
            } catch (err) {
                console.log("err", err);
            }
        }
    },

    async getPriceWithLimit({ state, commit }, dataFromApiResponse) {
        for (var i = 0; i < state.limit; i++) {
            console.log(dataFromApiResponse);
            var coinResponse = await axios.get(
                `https://api.coinpaprika.com/v1/tickers/${dataFromApiResponse.data[i].id}`,
                {
                    withCredentials: false,
                }
            );

            dataFromApiResponse.data[i].price =
                coinResponse.data.quotes.USD.price;
        }
        console.log(dataFromApiResponse.data.slice(0, 10));
        commit("setCoinList", dataFromApiResponse.data.slice(0, state.limit));
        commit("setLimit", state.limit);
        // commit("setNextPage", 10);
        console.log("dealyed", state.coinList);
        ///update the code
        // state.completeCoinList.push(dataFromApiResponse.data.slice(0,10));
        // console.log("complete",state.completeCoinList);
        // console.log(state.completeCoinList.length);
        // commit("setCompletCoinList", state.completCoinList);

        // commit("setCoinList", data.data.slice(0, state.limit));
        // commit("setLimit", state.limit);
        // commit("setNextPage", 10);
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

    // setCompleteCoinList(state, completeCoinList) {
    //     console.log(state.completeCoinList.length);
    //     state.completeCoinList = completeCoinList;

    // },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
