import * as types from './mutations-types'

const mutations = {
  [types.SET_LOGIN_STATUS](state, states) {
    state.loginStatus = states
  }

}

export default mutations
