export const state = () => ({
    currentTrack: null
});

export const mutations = {
    setCurrentTrack(state, trackName) {
        state.currentTrack = trackName;
    }
};

export const actions = {
    setCurrentTrack({ commit, dispatch }, trackName = null) {
        commit('setCurrentTrack', trackName);
        if (trackName) {
            dispatch('track/load', trackName, { root: true });
        }
    }
};
