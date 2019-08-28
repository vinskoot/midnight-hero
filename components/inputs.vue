<template>
    <div>
        <h1>Inputs :</h1>
        <div class="triggers">
            <midhTrigger
                v-for="i in 9"
                :key="i"
                :triggered="liveInput && liveInput.note === 'm' + i"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import midhTrigger from '~/components/trigger';

export default {
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