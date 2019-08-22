export const state = () => ({
    logMaxLength: 10,
    inputs: [],
    mapping: null,
    mappingCompleted: false
});

export const mutations = {
    addInput(state, note) {
        note = { note, id: note + '-' + new Date().getTime() };
        if (!state.inputs) {
            state.inputs = [note];
        } else {
            state.inputs.push(note);
        }

        if (state.inputs.length > state.logMaxLength) {
            state.inputs.shift();
        }
    },
    shiftInput(state) {
        state.inputs.shift();
    },
    emptyInputs(state) {
        state.inputs = [];
    },
    setMap(state, { map, value }) {
        if (!state.mapping) {
            state.mapping = {};
        }
        state.mapping[map] = value.note;
    },
    setMapping(state, mapping) {
        state.mapping = mapping;
    },
    setMappingCompleted(state, value) {
        state.mappingCompleted = value;
    }
};

export const actions = {
    init({ state, commit, dispatch }) {
        dispatch('midi/init', null, { root: true });
        dispatch('keyboard/init', null, { root: true });

        if (localStorage.mapping) {
            commit('setMapping', JSON.parse(localStorage.mapping));
            commit('setMappingCompleted', true);
        }
    },
    addInput({ state, commit }, input) {
        if (state.mappingCompleted) {
            const map = Object.keys(state.mapping).find(
                (key) => state.mapping[key] === input
            );
            if (map) {
                commit('addInput', map);
            }
        } else {
            commit('addInput', input);
        }
    },
    setMap({ commit }, options) {
        commit('setMap', options);
    },
    mappingCompleted({ state, commit }) {
        commit('setMappingCompleted', true);
        commit('emptyInputs');
        localStorage.mapping = JSON.stringify(state.mapping);
    },
    mappingEditing({ commit }) {
        commit('setMappingCompleted', false);
    }
};
