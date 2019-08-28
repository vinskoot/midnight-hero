<template>
    <section>
        <h1>Track</h1>
        <p>Score: {{ score }}</p>
        <p>Quality: {{ quality }}</p>
    </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: function() {
        return {
            track: null,
            treshold: 300,
            quality: '',
            qualityTimeout: null,
            score: 0
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.track.time,
            liveInput: (state) => state.controls.liveInput
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
    mounted: function() {
        fetch('/tracks/bensound-summer/inputs.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.track = data;
            });
    },
    destroyed: function() {},
    methods: {
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