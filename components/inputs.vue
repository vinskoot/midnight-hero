<template>
    <div>
        <h1>Inputs :</h1>
        <div class="triggers">
            <midhTrigger v-for="i in 9" :key="i" :triggered="input && input.note === 'm' + i" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import midhTrigger from '~/components/trigger';

export default {
    data: function() {
        return {
            input: null,
            inputTimeout: null
        };
    },
    components: {
        midhTrigger
    },
    computed: {
        ...mapState({
            inputs: (state) => state.controls.inputs
        })
    },
    watch: {
        inputs(newValue) {
            if (this.activeTimeout) {
                clearTimeout(this.inputTimeout);
            }
            this.input = newValue[newValue.length - 1];
            this.inputTimeout = setTimeout(() => {
                this.input = null;
            });
        }
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