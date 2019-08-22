<template>
    <div>
        <h1>Inputs :</h1>
        <p class="note-block" v-for="note in notes" :key="note.id">Note: {{ note.note }}</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            notes: (state) => state.inputs.notes
        })
    }
    // watch: {
    //     notes(newValue) {
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