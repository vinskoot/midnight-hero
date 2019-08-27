<template>
    <section>
        <h1>Track</h1>
    </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: function() {
        return {
            track: null
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.track.time
        })
    },
    watch: {
        time(time) {
            if (
                this.track &&
                this.track.length > 0 &&
                this.track[0].t <= time
            ) {
                this.$store.commit('controls/addInput', 'm' + this.track[0].i); // Only for test purposes
                this.track.shift();
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
    destroyed: function() {}
};
</script>