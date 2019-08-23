<template>
    <div class="container">
        <div>
            <h1 class="title">midnight-hero</h1>
            <h2 class="subtitle">A rythm game to play with MIDI devices</h2>
            <midhMapping />
            <midhInputs v-if="mappingCompleted" />
            <midhMusic />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import midhInputs from '~/components/inputs.vue';
import midhMapping from '~/components/mapping.vue';
import midhMusic from '~/components/music.vue';

export default {
    computed: {
        ...mapState({
            mappingCompleted: (state) => state.controls.mappingCompleted
        })
    },
    components: {
        midhInputs,
        midhMapping,
        midhMusic
    }
};
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system,
        BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
        sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}
</style>
