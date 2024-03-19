import { makeAutoObservable } from "mobx";

class User {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  userInfo = {
    id: 0,
    username: "",
    avatar: "",
  };

  updateUserInfo = (userInfo: {
    id: number;
    username: string;
    avatar: string;
  }) => {
    this.userInfo = userInfo;
  };
}
export default new User();
