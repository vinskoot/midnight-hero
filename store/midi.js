import * as WebMidi from 'webmidi';

export const actions = {
    init({ state, dispatch }) {
        if (process.client) {
            if (window.WebMidiReady) {
                onMIDISuccess(state, dispatch);
            } else {
                WebMidi.enable((err) => {
                    if (err) {
                        console.log('Could not access your MIDI devices.', err);
                    } else {
                        window.WebMidiReady = true;
                        onMIDISuccess(state, dispatch);
                    }
                });
            }
        }
    }
};

function onMIDISuccess(state, dispatch) {
    const inputs = WebMidi.inputs;
    for (let input of inputs) {
        console.log('MIDI DEVICE DETECTED: ', input.name);
        input.addListener('noteon', 'all', (e) => {
            dispatch('controls/addInput', e.note.number, { root: true });
        });
    }

    if (inputs.length === 0) {
        console.log('NO MIDI DEVICE DETECTED');
        // setTimeout(() => {
        //     dispatch('controls/addInput', 1, { root: true });
        //     setTimeout(() => {
        //         dispatch('controls/addInput', 2, { root: true });
        //     }, 2000);
        // }, 1000);
    }
}
