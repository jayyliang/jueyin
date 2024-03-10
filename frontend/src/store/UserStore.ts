import { makeAutoObservable } from "mobx";

class User {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  userInfo = {}
}
export default new User();
