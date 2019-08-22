import * as WebMidi from 'webmidi';

export const actions = {
    init({ state, commit }) {
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
            commit('inputs/addNote', e.note.number, { root: true });
        });
    }

    if (inputs.length === 0) {
        console.log('NO MIDI DEVICE DETECTED');
        setTimeout(() => {
            commit('inputs/addNote', 1, { root: true });
            setTimeout(() => {
                commit('inputs/addNote', 2, { root: true });
            }, 2000);
        }, 1000);
    }
}
