<template>
    <div>
        <h1>Inputs:</h1>
        <div class="triggers">
            <midhTrigger
                v-for="i in 9"
                :key="i"
                :triggered="liveInput && liveInput.note === 'm' + i"
                :color="color[i]"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import midhTrigger from '~/components/trigger';

export default {
    data() {
        return {
            color: {
                1: '#ff0000',
                2: '#00ff00',
                3: '#0000ff',
                4: '#ff00ff',
                5: '#00ffff',
                6: '#ffff00',
                7: '#f00f0f',
                8: '#0f00f0',
                9: '#fff000'
            }
        };
    },
    components: {
        midhTrigger
    },
    computed: {
        ...mapState({
            liveInput: (state) => state.controls.liveInput
        })
    }
};
</script>

<style scoped>
.triggers {
    display: inline-block;
    margin: 10px auto 0;
}

.trigger {
    display: inline-block;
}
</style>