<template>
    <div>
        <h1>Inputs :</h1>
        <p
            class="note-block"
            v-for="note in notes"
            :key="note.id"
        >Note: {{ note.name }} ({{note.number}})</p>
    </div>
</template>

<script>
export default {
    computed: {
        notes: function() {
            return this.$store.state.midi.notes;
        }
    }
};
</script>

<style scoped>
.note-block {
    border: 1px solid black;
    margin-bottom: 5px;
}
</style>