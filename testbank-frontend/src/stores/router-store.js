// import * as mobx from 'mobx';

// const { observable, action } = mobx;

// class RouterStore {
//   @observable location = {};
//   @observable match = {};
//   @observable history = {};

//   @action.bound
//   setRoute(location, match, history) {
//     this.location = location;
//     this.match = match;
//     this.history = history;
//   }

//   @mobx.computed
//   get state() {
//     const { params, path } = this.match;

//     const stateName = path === '/' ? 'home' : path.split('/')[1];
//     return { name: stateName, params: mobx.toJS(params) };
//   }
// }

// export default new RouterStore();