export const state = () => ({
    time: 0
});

export const mutations = {
    setTime(state, time) {
        state.time = time;
    }
};

export const actions = {
    setTime({ commit }, time) {
        commit('setTime', time);
    }
};
