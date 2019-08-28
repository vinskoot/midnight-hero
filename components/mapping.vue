<template>
    <div>
        <h1>Mapping:</h1>
        <div v-if="!editing">
            <button class="button" @click="startEdition">Set mapping</button>
            <br />
            <div class="mapping" v-if="mappingCompleted">
                <p class="map" v-for="(value, map) in mapping" :key="map">
                    <strong>{{ map }} :</strong>
                    {{ value }}
                </p>
            </div>
        </div>
        <div v-if="editing">
            <h1>{{ maps[currentMapIndex] }}</h1>
            <p>Tap on an input to assign</p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: function() {
        return {
            editing: false,
            currentMapIndex: 0,
            maps: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9']
        };
    },
    computed: {
        ...getMapping(),
        ...mapState({
            inputs: (state) => state.controls.inputs,
            mapping: (state) => state.controls.mapping,
            mappingCompleted: (state) => state.controls.mappingCompleted
        }),
        currentMap: {
            get: function() {
                return this.maps[this.currentMapIndex];
            },
            set: function(value) {
                this.$store.dispatch('controls/setMap', {
                    map: this.currentMap,
                    value
                });
            }
        }
    },
    methods: {
        startEdition: function() {
            this.editing = true;
            this.$store.dispatch('controls/mappingEditing');
        }
    },
    watch: {
        inputs(newValue) {
            if (this.editing) {
                this.currentMap = newValue[newValue.length - 1];
                if (this.currentMapIndex < this.maps.length - 1) {
                    this.currentMapIndex++;
                } else {
                    this.editing = false;
                    this.currentMapIndex = 0;
                    this.$store.dispatch('controls/mappingCompleted');
                }
            }
        }
    }
};

function getMapping() {
    const mapping = {};
    for (let i = 1; i <= 9; i++) {
        const map = 'm' + i;
        mapping[map] = getMapComputedObj(map);
    }
    return mapping;
}

function getMapComputedObj(map) {
    return {
        get: function() {
            return this.mapping[map];
        },
        set: function(value) {
            this.$store.dispatch('controls/setMap', { map: map, value });
        }
    };
}
</script>

<style scoped>
.mapping {
    display: inline-block;
    border: 0 auto;
}

.map {
    display: inline-block;
    margin: 0 10px;
}
</style>