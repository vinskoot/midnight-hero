<template>
    <div>
        <h1>Inputs :</h1>
        <p class="note-block" v-for="input in inputs" :key="input.id">Note: {{ input.note }}</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            inputs: (state) => state.controls.inputs
        })
    }
    // watch: {
    //     inputs(newValue) {
    //         console.log(newValue[newValue.length - 1]);
    //     }
    // }
};
</script>

<style scoped>
.note-block {
    border: 1px solid black;
    margin-bottom: 5px;
}
</style>