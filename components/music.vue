<template>
    <section>
        <h1>Music</h1>
        <template v-if="loaded">
            <button @click="play">Play</button>
            <button @click="stop">Stop</button>
        </template>
        <template v-if="!loaded">Music is loading...</template>
    </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: function() {
        return {
            audioCtx: null,
            source: null,
            dest: null,
            loaded: false,
            initialized: false,
            timerInterval: null
        };
    },
    computed: {
        ...mapState({
            playing: (state) => state.track.playing
        })
    },
    mounted: function() {
        this.load();
    },
    destroyed: function() {
        this.stop();
    },
    methods: {
        load: function() {
            if (process.client) {
                this.audioCtx = new (window.AudioContext ||
                    window.webkitAudioContext)();
                this.audioCtx.suspend();
                this.source = this.audioCtx.createBufferSource();

                fetch('/tracks/bensound-summer/track.mp3')
                    .then((response) => response.arrayBuffer())
                    .then((arrayBuffer) =>
                        this.audioCtx.decodeAudioData(arrayBuffer)
                    )
                    .then((audioBuffer) => {
                        this.source.buffer = audioBuffer;
                        this.dest = this.audioCtx.destination;
                        this.loaded = true;
                        // this.source.loop = true;
                    })
                    .catch((e) =>
                        console.log('Error with decoding audio data' + e)
                    );
            }
        },
        play: function() {
            if (!this.playing) {
                if (!this.initialized) {
                    this.source.connect(this.dest);
                    this.source.start();
                    this.initialized = true;
                }
                this.audioCtx.resume();
                this.$store.dispatch('track/setPlaying', true);
                this.timerInterval = setInterval(() => {
                    this.$store.dispatch(
                        'track/setTime',
                        Math.round(this.audioCtx.currentTime * 1000)
                    );
                }, 10);
            }
        },
        stop: function() {
            if (this.playing) {
                this.audioCtx.suspend();
                this.$store.dispatch('track/setPlaying', false);
                clearInterval(this.timerInterval);
            }
        }
    }
};
</script>