export const state = () => ({
    logMaxLength: 10,
    notes: []
});

export const mutations = {
    addNote(state, note) {
        note = { note, id: note + '-' + new Date().getTime() };
        if (!state.notes) {
            state.notes = [note];
        } else {
            state.notes.push(note);
        }

        if (state.notes.length > state.logMaxLength) {
            state.notes.shift();
        }
    },
    shiftNote(state) {
        state.notes.shift();
    },
    setNotes(state, notes) {
        state.notes = notes;
    }
};

export const actions = {
    init({ dispatch }) {
        dispatch('midi/init', null, { root: true });
        dispatch('keyboard/init', null, { root: true });
    }
};
