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
            notes: [],
            animating: false,
            speed: 6000,
            distance: 100,
            musicDataArray: null,
            musicSampleSize: 10,
            background: null,
            bgPlanes: []
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.track.time,
            liveInput: (state) => state.controls.liveInput,
            track: (state) => state.track.track,
            playing: (state) => state.track.playing,
            analyzer: (state) => state.track.analyzer
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
                .filter(
                    (item) => item.t <= time + this.speed && !item.displayed
                )
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
            45,
            window.innerWidth / 600,
            0.1,
            this.distance + 15
        );
        this.camera.lookAt(0, 0, -5);
        this.camera.position.y = 4;
        this.camera.position.z = 12;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.$refs.threeContainer.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, 600);

        const bgGeometry = new THREE.PlaneGeometry(
            200 / this.musicSampleSize,
            200
        );
        const bgColor = new THREE.Color(0x49839e);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: bgColor,
            opacity: 0,
            transparent: true
        });
        for (let index = 0; index < this.musicSampleSize; index++) {
            let plane = new THREE.Mesh(bgGeometry, bgMaterial.clone());
            plane.position.z = -this.distance;
            plane.position.x =
                index * (200 / this.musicSampleSize) -
                ((200 / this.musicSampleSize) * this.musicSampleSize) / 2;

            this.bgPlanes.push(plane);
            this.scene.add(plane);
        }

        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 50);
        const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.rotation.z = Math.PI / 2;
        this.scene.add(cylinder);

        const geometryLine = new THREE.CylinderGeometry(
            0.05,
            0.05,
            this.distance
        );
        const materialLine = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        for (let index = -8; index < 10; index += 2) {
            let line = new THREE.Mesh(geometryLine, materialLine);
            line.rotation.x = Math.PI / 2;
            line.position.x = index;
            line.position.z = -this.distance / 2;
            this.scene.add(line);
        }

        this.animating = true;
        this.animate();
    },
    destroyed() {
        this.animating = false;
        if (this.qualityTimeout) {
            clearTimeout(this.qualityTimeout);
        }
        this.notes.forEach((note) => {
            this.scene.remove(note);
            note.geometry.dispose();
            note.material.dispose();
        });
        this.notes = [];
    },
    methods: {
        play: function() {
            this.$store.dispatch('track/play');
            this.musicDataArray = new Uint8Array(this.musicSampleSize);
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
            this.scene.remove(this.notes[index]);
        },
        addNoteToScene({ i, t }) {
            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            let color = 0xffffff;
            let posX = 0;
            switch (i) {
                case 1:
                    color = 0xff0000;
                    posX = -8;
                    break;
                case 2:
                    color = 0x00ff00;
                    posX = -6;
                    break;
                case 3:
                    color = 0x0000ff;
                    posX = -4;
                    break;
                case 4:
                    color = 0xff00ff;
                    posX = -2;
                    break;
                case 5:
                    color = 0x00ffff;
                    posX = 0;
                    break;
                case 6:
                    color = 0xffff00;
                    posX = 2;
                    break;
                case 7:
                    color = 0xf00f0f;
                    posX = 4;
                    break;
                case 8:
                    color = 0x0f00f0;
                    posX = 6;
                    break;
                case 9:
                    color = 0xfff000;
                    posX = 8;
                    break;
            }
            const material = new THREE.MeshBasicMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.z = -this.distance;
            cube.position.x = posX;
            cube.time = t;
            this.notes.push(cube);
            this.scene.add(cube);
        },
        animate() {
            if (this.animating) {
                requestAnimationFrame(this.animate);
            }

            if (this.musicDataArray) {
                this.analyzer.getByteFrequencyData(this.musicDataArray);
                this.musicDataArray.forEach((item, index) => {
                    this.bgPlanes[index].material.opacity = item / 255;
                });
            }

            this.notes.forEach((note) => {
                note.position.z =
                    ((this.time - note.time) * this.distance) / this.speed;
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