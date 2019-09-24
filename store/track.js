export const state = () => ({
    treshold: 300,
    playing: false,
    time: 0,
    audioCtx: null,
    source: null,
    loaded: false,
    audioLoaded: false,
    trackLoaded: false,
    initialized: false,
    timerInterval: null,
    track: null
});

export const mutations = {
    setTime(state, time) {
        state.time = time;
    },
    setPlaying(state, isPlaying) {
        state.playing = isPlaying;
    },
    setAudioLoaded(state, isLoaded) {
        state.audioLoaded = isLoaded;
    },
    setTrackLoaded(state, isLoaded) {
        state.trackLoaded = isLoaded;
    },
    setAudioCtx(state, ctx) {
        state.audioCtx = ctx;
    },
    setSource(state, source) {
        state.source = source;
    },
    setInitialized(state, isInit) {
        state.initialized = isInit;
    },
    setTimerInterval(state, interval) {
        state.timerInterval = interval;
    },
    setTrack(state, track) {
        state.track = track;
    }
};

export const getters = {
    dest(state) {
        return state.audioCtx ? state.audioCtx.destination : null;
    },
    loaded(state) {
        return state.audioLoaded && state.trackLoaded;
    }
};

export const actions = {
    setTime({ commit }, time) {
        commit('setTime', time);
    },
    setPlaying({ commit }, isPlaying) {
        commit('setPlaying', isPlaying);
    },
    load({ state, commit }, trackName) {
        if (process.client) {
            const fetchBase =
                process.env.deployEnv === 'GH_PAGES' ? '/midnight-hero/' : '/';
            commit(
                'setAudioCtx',
                new (window.AudioContext || window.webkitAudioContext)()
            );
            state.audioCtx.suspend();
            commit('setSource', state.audioCtx.createBufferSource());

            fetch(fetchBase + 'tracks/' + trackName + '/track.mp3')
                .then((response) => response.arrayBuffer())
                .then((arrayBuffer) =>
                    state.audioCtx.decodeAudioData(arrayBuffer)
                )
                .then((audioBuffer) => {
                    state.source.buffer = audioBuffer;
                    commit('setAudioLoaded', true);
                    // this.source.loop = true;
                })
                .catch((e) =>
                    console.log('Error with decoding audio data' + e)
                );

            fetch(fetchBase + 'tracks/' + trackName + '/inputs.json')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    commit('setTrack', data);
                    commit('setTrackLoaded', true);
                });
        }
    },
    play({ state, dispatch, getters, commit }) {
        if (!state.playing) {
            if (!state.initialized) {
                state.source.connect(getters.dest);
                state.source.start();
                commit('setInitialized', true);
            }
            state.audioCtx.resume();
            commit('setPlaying', true);
            commit(
                'setTimerInterval',
                setInterval(() => {
                    dispatch(
                        'setTime',
                        Math.round(state.audioCtx.currentTime * 1000)
                    );
                }, 10)
            );
        }
    },
    stop({ state, dispatch, commit }) {
        if (state.playing) {
            state.audioCtx.suspend();
            dispatch('main/setCurrentTrack', null, { root: true });
            commit('setPlaying', false);
            commit('setAudioLoaded', false);
            commit('setTrackLoaded', false);
            commit('setInitialized', false);
            clearInterval(state.timerInterval);
        }
    }
};
