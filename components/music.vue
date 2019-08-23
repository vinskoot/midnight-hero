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
import audioFile from '@/assets/musics/bensound-summer.mp3';

export default {
    data: function() {
        return {
            audioCtx: null,
            source: null,
            dest: null,
            loaded: false
        };
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
                this.source = this.audioCtx.createBufferSource();

                fetch(audioFile)
                    .then((response) => response.arrayBuffer())
                    .then((arrayBuffer) =>
                        this.audioCtx.decodeAudioData(arrayBuffer)
                    )
                    .then((audioBuffer) => {
                        this.source.buffer = audioBuffer;
                        this.dest = this.audioCtx.destination;
                        this.loaded = true;
                        this.source.start();
                        // this.source.loop = true;
                    })
                    .catch((e) =>
                        console.log('Error with decoding audio data' + e)
                    );
            }
        },
        play: function() {
            this.source.connect(this.dest);
        },
        stop: function() {
            this.source.disconnect(this.dest);
        }
    }
};
</script>