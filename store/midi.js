import * as WebMidi from 'webmidi';

export const state = () => ({
    logMaxLength: 10,
    notes: []
});

export const mutations = {
    addNote(state, note) {
        if (!state.notes) {
            state.notes = [note];
        } else {
            state.notes.push(note);
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
    apiInit({ state, commit }) {
        if (process.client) {
            if (window.WebMidiReady) {
                onMIDISuccess(state, commit);
            } else {
                WebMidi.enable((err) => {
                    if (err) {
                        console.log('Could not access your MIDI devices.', err);
                    } else {
                        window.WebMidiReady = true;
                        onMIDISuccess(state, commit);
                    }
                });
            }
        }
    }
};

function onMIDISuccess(state, commit) {
    const inputs = WebMidi.inputs;
    for (let input of inputs) {
        console.log('MIDI DEVICE DETECTED: ', input.name);
        input.addListener('noteon', 'all', (e) => {
            commit('addNote', { ...e.note, id: new Date().time });
            if (state.notes.length > state.logMaxLength) {
                commit('shiftNote');
            }
        });
    }

    if (inputs.length === 0) {
        console.log('NO MIDI DEVICE DETECTED');
        // commit('addNote', { name: 'test', number: 1 });
    }
}
