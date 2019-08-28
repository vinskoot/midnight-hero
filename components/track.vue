<template>
    <div>
        <h1>Track:</h1>
        <div v-if="loaded">
            <button v-if="!playing" @click="play">Start</button>
            <button v-if="playing" @click="stop">Stop</button>
            <p>Score: {{ score }}</p>
            <p>Quality: {{ quality }}</p>
            <div class="stage">
                <div
                    class="track"
                    v-for="activeTrack in activeTracks"
                    :key="activeTrack.id"
                    :class="'track-'+activeTrack.i"
                ></div>
            </div>
        </div>
        <div v-if="!loaded">Loading...</div>
        <button @click="showLog = !showLog;">Toggle log</button>
        <div v-if="showLog">
            <code>{{ logjson }}</code>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: ['name'],
    data: function() {
        return {
            quality: '',
            qualityTimeout: null,
            score: 0,
            log: [],
            showLog: false,
            activeTracks: []
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
        }),
        logjson() {
            return JSON.stringify(this.log);
        }
    },
    watch: {
        time(time) {
            this.track
                .filter((item) => item.t <= time + 2000 && !item.displayed)
                .forEach((element) => {
                    element.displayed = true;
                    this.activeTracks.push({
                        ...element,
                        id: element.i + '-' + time
                    });
                    this.$store.dispatch('controls/addInput', 'm' + element.i);
                    setTimeout(() => {
                        this.activeTracks.splice(
                            this.activeTracks.length - 1,
                            1
                        );
                    }, 2000);
                });
        },
        liveInput(input) {
            if (input) {
                this.log.push({
                    t: input.time,
                    i: parseInt(input.note.replace('m', ''))
                });

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
                                item.diff < this.$store.state.track.treshold
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
            this.score += this.$store.state.track.treshold - diff;

            if (this.qualityTimeout) {
                clearTimeout(this.qualityTimeout);
            }
            if (diff < this.$store.state.track.treshold / 3) {
                this.quality = 'Perfect';
            } else if (diff < this.$store.state.track.treshold / 2) {
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

<style scoped>
.stage {
    position: relative;
    height: 200px;
    background: black;
}

.stage:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: white;
    position: absolute;
    left: 0;
    bottom: 30px;
}

.track {
    position: absolute;
    left: 0;
    top: -30px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: white;
    transform: translateY(0);
    transition: transform 2000ms linear;
    animation-duration: 2000ms;
    animation-name: down;
    animation-timing-function: linear;
}

@keyframes down {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(185px);
    }
}

.track-1 {
    left: 0;
}

.track-2 {
    left: 40px;
}

.track-3 {
    left: 80px;
}

.track-4 {
    left: 120px;
}

.track-5 {
    left: 160px;
}

.track-6 {
    left: 200px;
}

.track-7 {
    left: 240px;
}

.track-8 {
    left: 280px;
}
</style>