export const actions = {
    init({ commit }) {
        if (process.client) {
            document.addEventListener('keydown', (e) => {
                commit('inputs/addNote', e.key, { root: true });
            });
        }
    }
};
