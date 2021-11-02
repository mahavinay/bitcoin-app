import axios from "axios";

const state = {
    user: null,
    coinList: [],
    limit: 8,
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
    },

    async getCoinList({ commit }) {
        commit("setLimit", state.limit);
            try {
                var res = await axios.get(
                    "https://api.coinpaprika.com/v1/coins",
                    {
                        withCredentials: false,
                    }
                );

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
                commit("setNextPage",  state.limit);
            } catch (err) {
                console.log("err", err);
            }
        
    },

    async getNextCoinList({ commit, state }) {
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
    },

    async getRefreshPrice({ state, dispatch }, index) {
        for (
            var i = index;
            i < index+state.limit;
            i++
        ) {
            var coinResponse = await axios.get(
                `https://api.coinpaprika.com/v1/tickers/${state.coinList[i].id}`,
                {
                    withCredentials: false,
                }
            );
            state.coinList[i].price = coinResponse.data.quotes.USD.price;
        }

        if(i<state.nextPage) {

        setTimeout(() => {
            dispatch("getRefreshPrice", i);
        }, 1000);
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
