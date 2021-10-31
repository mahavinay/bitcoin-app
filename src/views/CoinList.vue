<template>
    <div class="container">
        <div v-if="User">
            <h1>Welcome {{ User }}!!!</h1>
        </div>
        <div v-else>User not found</div>
        <div v-if="CoinList">
            <table id="coin">
                <thead id="table-head">
                    <tr>
                        <th>RANK</th>
                        <th>
                            <a
                                href="#"
                                data-column="name"
                                data-order="desc"
                                v-on:click="sortCoinByKey('name')"
                                >COIN NAME</a
                            >
                        </th>
                        <th>COIN SYMBOL</th>
                        <!-- <th>
                            <a
                                href="#"
                                data-column="hair_color"
                                data-order="desc"
                                v-on:click="sortCoinByKey('hair_color')"
                                >HAIR_COLOR</a
                            >
                        </th> -->
                        <th>PRICE</th>
                        <th>EXCHANGES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(coin, rowIndex) in CoinList" :key="rowIndex">
                        <td>
                            {{ coin.rank }}
                        </td>
                        <td>
                            {{ coin.name }}
                        </td>
                        <td>
                            {{ coin.symbol }}
                        </td>
                        <td>
                            <!-- <div
                                v-for="(coinPrice, index) in filteredCoinPriceList"
                                :key="index"
                            >
                                {{ coinPrice }}
                            </div> -->
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h1>Loading Coin....</h1>
        </div>
        <div>
            <button id="loadButton" v-on:click="displayCoin()">
                Load more
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import Vue from "vue";
// import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";

// ue.use(Vuex);

// const store = new Vuex.Store({
//     state: {
//         coinList: [],
//     },
//     plugins: [createPersistedState()],
// });

export default {
    data() {
        return {
            key: "",
            order: "asc",
            isClicked: false,
            currentIndex: 0,
        };
    },

    name: "CoinList",
    components: {},

    created() {
        this.getCoinList();
        //this.getCoinPriceList(id);
    },

    computed: {
        // async getCoinList({ commit }) {
        //     try {
        //         let res = await axios.get(
        //             "https://api.coinpaprika.com/v1/coins",
        //             {
        //                 withCredentials: false,
        //             }
        //         );

        //         for (var i = 0; i <= 10; i++) {
        //             var coinResponse = await axios.get(
        //                 `https://api.coinpaprika.com/v1/tickers/${res.data[i].id}`,
        //                 {
        //                     withCredentials: false,
        //                 }
        //             );
        //             state.coinPriceList.push(
        //                 coinResponse.data.quotes.USD.price
        //             );
        //         }
        //         console.log("priceList", state.coinPriceList);
        //         commit("setCoinList", res.data.slice(0, 30));
        //         // store.commit('getCoinList');
        //         // return store.state.coinList;
        //         //commit("setCoinPriceList", coinResponse.data.quotes.USD);
        //     } catch (err) {
        //         console.log("err", err);
        //     }
        //     // store.commit('getCoinList');
        //     store.commit("getCoinList");
        // },

        ...mapGetters({
            CoinList: "stateCoinList",
            User: "stateUser",
            CoinPriceList: "stateCoinPriceList",
        }),
    },

    methods: {
        ...mapActions(["getCoinList"]),

        sortCoinByKey(prop) {
            if (this.order == "asc") {
                this.CoinList.sort((a, b) => a[prop].localeCompare(b[prop]));
                this.order = "desc";
                // store.state.CoinList;
            } else {
                this.CoinList.sort((a, b) => b[prop].localeCompare(a[prop]));
                this.order = "asc";
                // store.state.CoinList;
            }
        },
    },
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

label {
    padding: 12px 12px 12px 0;
    display: inline-block;
}

button[type="submit"] {
    background-color: #4caf50;
    color: white;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 30px;
    margin: 10px;
}

button[type="submit"]:hover {
    background-color: #45a049;
}

input {
    width: 60%;
    margin: 15px;
    border: 0;
    box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
    padding: 10px;
    border-radius: 30px;
}

textarea {
    width: 75%;
    resize: vertical;
    padding: 15px;
    border-radius: 15px;
    border: 0;
    box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
    height: 150px;
    margin: 15px;
}

ul {
    list-style: none;
}

#coin {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#coin td,
#coin th {
    border: 1px solid #ddd;
    padding: 8px;
}

#coin tr:nth-child(even) {
    background-color: #f2f2f2;
}

#coin tr:hover {
    background-color: #ddd;
}

#coin th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #04aa6d;
    color: white;
}

#loadButton {
    background-color: #4caf50;
    color: white;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 30px;
    margin-top: 20px;
}
@keyframes flash {
    0% {
        background-color: none;
    }
    50% {
        background-color: green;
    }
    100% {
        background-color: none;
    }
}

.fade-enter-active,
.fade-leave-active {
    animation: flash 0.5s;
}
.fade-enter,
.fade-leave-to {
    animation: flash 0.5s;
}
</style>
