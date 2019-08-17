<template>
    <div>
        <h1>Inputs :</h1>
        <p
            class="note-block"
            v-for="note in notes"
            :key="note.id"
        >Note: {{ note.name }} ({{note.number}})</p>
    </div>
</template>

<script>
import * as WebMidi from 'webmidi';

export default {
    data() {
        return {
            logMaxLength: 10,
            inputs: [],
            notes: []
        };
    },
    mounted: function() {
        this.MIDIApiInit();
    },
    destroyed: function() {
        for (let input of this.inputs) {
            input.removeListener('noteon');
        }
    },
    methods: {
        MIDIApiInit: function() {
            if (process.client) {
                if (window.WebMidiReady) {
                    this.onMIDISuccess();
                } else {
                    WebMidi.enable((err) => {
                        if (err) {
                            this.onMIDIFailure(err);
                        } else {
                            window.WebMidiReady = true;
                            this.onMIDISuccess();
                        }
                    });
                }
            }
        },
        onMIDISuccess: function() {
            this.inputs = WebMidi.inputs;

            for (let input of this.inputs) {
                console.log('MIDI DEVICE DETECTED: ', input.name);
                input.addListener('noteon', 'all', (e) => {
                    this.logNote(e.note);
                });
            }

            if (this.inputs.length === 0) {
                console.log('NO MIDI DEVICE DETECTED');
            }
        },
        onMIDIFailure: function(err) {
            console.log('Could not access your MIDI devices.', err);
        },
        logNote: function(note) {
            this.notes.push({ ...note, id: new Date().time });

            if (this.notes.length > this.logMaxLength) {
                this.notes.shift();
            }
        }
    }
};
</script>

<style scoped>
.note-block {
    border: 1px solid black;
    margin-bottom: 5px;
}
</style>