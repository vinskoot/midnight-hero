<template>
    <div class="trigger" :style="{ borderColor: color }" :class="{ active }"></div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        triggered: Boolean,
        color: String
    },
    data: function() {
        return {
            active: false,
            activeTimeout: null
        };
    },
    watch: {
        triggered: function(newVal) {
            if (newVal) {
                if (this.activeTimeout) {
                    clearTimeout(this.activeTimeout);
                }
                this.active = true;
                this.activeTimeout = setTimeout(() => {
                    this.active = false;
                }, 100);
            }
        }
    }
};
</script>

<style scoped>
.trigger {
    width: 30px;
    height: 30px;
    border: 1px solid black;
    border-radius: 50%;
    margin: 0 5px;
    transition: all 200ms;
}

.active {
    background-color: black;
}
</style>