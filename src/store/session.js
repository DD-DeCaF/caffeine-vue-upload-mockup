export default {
  state: {
    authenticated: false,
    jwt: null,
  },
  mutations: {
    login(state, jwt) {
      state.authenticated = true;
      state.jwt = jwt;
    },
    logout(state) {
      state.authenticated = false;
      state.jwt = null;
    },
  },
};
