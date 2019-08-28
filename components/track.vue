<template>
    <div>
        <h1>Track:</h1>
        <div v-if="loaded">
            <button v-if="!playing" @click="play">Start</button>
            <button v-if="playing" @click="stop">Stop</button>
            <p>Score: {{ score }}</p>
            <p>Quality: {{ quality }}</p>
        </div>
        <div v-if="!loaded">Loading...</div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: ['name'],
    data: function() {
        return {
            treshold: 300,
            quality: '',
            qualityTimeout: null,
            score: 0
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.track.time,
            liveInput: (state) => state.controls.liveInput,
            track: (state) => state.track.track,
            playing: (state) => state.track.playing
        }),
        ...mapGetters({
            loaded: 'track/loaded'
        })
    },
    watch: {
        liveInput(input) {
            if (input) {
                if (this.track && this.track.length > 0) {
                    const matchInputs = this.track
                        .map((item, index) => {
                            return {
                                ...item,
                                diff: Math.abs(item.t - input.time),
                                index
                            };
                        })
                        .filter((item) => {
                            return (
                                !item.checked &&
                                'm' + item.i === input.note &&
                                item.diff < this.treshold
                            );
                        });

                    if (matchInputs.length > 0) {
                        const bestMatch = matchInputs.reduce((min, item) => {
                            return item.diff < min.diff ? min : item;
                        });
                        this.checkTrackElement(bestMatch.index);
                        this.addScore(bestMatch.diff);
                    }
                }
            }
        }
    },
    destroyed: function() {},
    methods: {
        play: function() {
            this.$store.dispatch('track/play');
        },
        stop: function() {
            this.$store.dispatch('track/stop');
        },
        addScore(diff) {
            this.score += this.treshold - diff;

            if (this.qualityTimeout) {
                clearTimeout(this.qualityTimeout);
            }
            if (diff < this.treshold / 3) {
                this.quality = 'Perfect';
            } else if (diff < this.treshold / 2) {
                this.quality = 'Excellent';
            } else {
                this.quality = 'Good';
            }

            this.qualityTimeout = setTimeout(() => {
                this.quality = '';
            }, 500);
        },
        checkTrackElement(index) {
            this.track[index].checked = true;
        }
    }
};
</script>