<template>
    <div>
        <h1>Track:</h1>
        <div v-if="loaded">
            <button v-if="!playing" @click="play">Start</button>
            <button v-if="playing" @click="stop">Stop</button>
            <p>Score: {{ score }}</p>
            <p>Quality: {{ quality }}</p>
        </div>
        <div ref="threeContainer"></div>
        <div v-if="!loaded">Loading...</div>
        <button @click="showLog = !showLog;">Toggle log</button>
        <div v-if="showLog">
            <code>{{ logjson }}</code>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as THREE from 'three';

export default {
    props: ['name'],
    data: function() {
        return {
            quality: '',
            qualityTimeout: null,
            score: 0,
            log: [],
            showLog: false,
            activeTracks: [],
            scene: null,
            camera: null,
            renderer: null,
            notes: []
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.track.time,
            liveInput: (state) => state.controls.liveInput,
            track: (state) => state.track.track,
            playing: (state) => state.track.playing
        }),
        ...mapGetters({
            loaded: 'track/loaded'
        }),
        logjson() {
            return JSON.stringify(this.log);
        },
        domElement() {
            return this.renderer ? this.renderer.domElement : null;
        }
    },
    watch: {
        time(time) {
            this.track
                .filter((item) => item.t <= time + 2000 && !item.displayed)
                .forEach((element) => {
                    element.displayed = true;
                    this.addNoteToScene(element);
                    this.activeTracks.push({
                        ...element,
                        id: element.i + '-' + time
                    });
                });
        },
        liveInput(input) {
            if (input) {
                this.log.push({
                    t: input.time,
                    i: parseInt(input.note.replace('m', ''))
                });

                if (this.track && this.track.length > 0) {
                    const matchInputs = this.track
                        .map((item, index) => {
                            return {
                                ...item,
                                diff: Math.abs(item.t - input.time),
                                index
                            };
                        })
                        .filter((item) => {
                            return (
                                !item.checked &&
                                'm' + item.i === input.note &&
                                item.diff < this.$store.state.track.treshold
                            );
                        });

                    if (matchInputs.length > 0) {
                        const bestMatch = matchInputs.reduce((min, item) => {
                            return item.diff < min.diff ? min : item;
                        });
                        this.checkTrackElement(bestMatch.index);
                        this.addScore(bestMatch.diff);
                    }
                }
            }
        }
    },
    mounted() {
        if (!process.client) {
            return;
        }
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / 200,
            0.1,
            1000
        );
        this.camera.lookAt(0, -4, -10);
        this.camera.position.y = 2;
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.$refs.threeContainer.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, 200);

        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 50);
        const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.rotation.z = Math.PI / 2;
        this.scene.add(cylinder);

        this.animate();
    },
    destroyed: function() {},
    methods: {
        play: function() {
            this.$store.dispatch('track/play');
        },
        stop: function() {
            this.$store.dispatch('track/stop');
        },
        addScore(diff) {
            this.score += this.$store.state.track.treshold - diff;

            if (this.qualityTimeout) {
                clearTimeout(this.qualityTimeout);
            }
            if (diff < this.$store.state.track.treshold / 3) {
                this.quality = 'Perfect';
            } else if (diff < this.$store.state.track.treshold / 2) {
                this.quality = 'Excellent';
            } else {
                this.quality = 'Good';
            }

            this.qualityTimeout = setTimeout(() => {
                this.quality = '';
            }, 500);
        },
        checkTrackElement(index) {
            this.track[index].checked = true;
        },
        addNoteToScene({ i, t }) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            let color = 0xffffff;
            let posX = 0;
            switch (i) {
                case 1:
                    color = 0xff0000;
                    posX = -4;
                    break;
                case 2:
                    color = 0x00ff00;
                    posX = -3;
                    break;
                case 3:
                    color = 0x0000ff;
                    posX = -2;
                    break;
                case 4:
                    color = 0xff00ff;
                    posX = -1;
                    break;
                case 5:
                    color = 0x00ffff;
                    posX = 1;
                    break;
                case 6:
                    color = 0xffff00;
                    posX = 2;
                    break;
                case 7:
                    color = 0xf00f0f;
                    posX = 3;
                    break;
                case 8:
                    color = 0x0f00f0;
                    posX = 4;
                    break;
                case 9:
                    color = 0xfff000;
                    posX = 4;
                    break;
            }
            const material = new THREE.MeshBasicMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.z = -5;
            cube.position.x = posX;
            cube.time = t;
            this.notes.push(cube);
            this.scene.add(cube);
        },
        animate() {
            requestAnimationFrame(this.animate);

            this.notes.forEach((note) => {
                note.position.z = -5 + (this.time - note.time) / 20;
            });

            this.renderer.render(this.scene, this.camera);
        }
    }
};
</script>

<style scoped>
.stage {
    position: relative;
    height: 200px;
    background: black;
}

.stage:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: white;
    position: absolute;
    left: 0;
    bottom: 30px;
}

.track {
    position: absolute;
    left: 0;
    top: -30px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: white;
    transform: translateY(0);
    transition: transform 2000ms linear;
    animation-duration: 2000ms;
    animation-name: down;
    animation-timing-function: linear;
}

@keyframes down {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(185px);
    }
}

.track-1 {
    left: 0;
}

.track-2 {
    left: 40px;
}

.track-3 {
    left: 80px;
}

.track-4 {
    left: 120px;
}

.track-5 {
    left: 160px;
}

.track-6 {
    left: 200px;
}

.track-7 {
    left: 240px;
}

.track-8 {
    left: 280px;
}
</style>