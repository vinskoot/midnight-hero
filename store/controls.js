export const controlsOnDrums = [
    {
        index: 1,
        mappingName: 'm1',
        displayName: 'Bass drum pedal',
        midiName: 'C2'
    },
    {
        index: 2,
        mappingName: 'm2',
        displayName: 'Hi-hat pedal',
        midiName: 'G#2'
    },
    {
        index: 3,
        mappingName: 'm3',
        displayName: 'Hi-hat',
        midiName: 'A#2'
    },
    {
        index: 4,
        mappingName: 'm4',
        displayName: 'Crash cymbal',
        midiName: 'C#3'
    },
    {
        index: 5,
        mappingName: 'm5',
        displayName: 'Ride cymbal',
        midiName: 'D#3'
    },
    {
        index: 6,
        mappingName: 'm6',
        displayName: 'Snare drum',
        midiName: 'D2'
    },
    {
        index: 7,
        mappingName: 'm7',
        displayName: 'High tom',
        midiName: 'C3'
    },
    {
        index: 8,
        mappingName: 'm8',
        displayName: 'Mid tom',
        midiName: 'A2'
    },
    {
        index: 9,
        mappingName: 'm9',
        displayName: 'Low tom',
        midiName: 'G2'
    }
]

export const state = () => ({
    logMaxLength: 10,
    inputs: [],
    mapping: null,
    mappingCompleted: false,
    liveInput: null
});

export const mutations = {
    addInput(state, note) {
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
    },
    setLiveInput(state, value) {
        state.liveInput = value;
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
    addInput({ state, commit, rootState }, input) {
        const time = rootState.track.playing ? rootState.track.time : null;
        let note = input;

        if (state.mappingCompleted) {
            const map = Object.keys(state.mapping).find(
                (key) => state.mapping[key] === input
            );
            if (map) {
                note = map;
            }
        }

        note = { note, id: note + '-' + new Date().getTime(), time };
        commit('addInput', note);
        commit('setLiveInput', note);
        setTimeout(() => {
            commit('setLiveInput', null);
        });
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
