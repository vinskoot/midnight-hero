export const actions = {
    init({ dispatch }) {
        if (process.client) {
            document.addEventListener('keydown', (e) => {
                dispatch('controls/addInput', e.key, { root: true });
            });
        }
    }
};
