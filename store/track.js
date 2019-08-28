export const state = () => ({
    playing: false,
    time: 0
});

export const mutations = {
    setTime(state, time) {
        state.time = time;
    },
    setPlaying(state, isPlaying) {
        state.playing = isPlaying;
    }
};

export const actions = {
    setTime({ commit }, time) {
        commit('setTime', time);
    },
    setPlaying({ commit }, isPlaying) {
        commit('setPlaying', isPlaying);
    }
};
