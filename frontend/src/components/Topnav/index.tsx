import { Avatar, Button } from "antd";
import useStore, { RootStoreContext } from "../../store/RootStore";
import styles from "./index.module.less";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { getUserInfo } from "../../api/user";
import { observer } from "mobx-react-lite";
const TopNav = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { userInfo } = user;

  useEffect(() => {
    if (userInfo.id) {
      return;
    }
    getUserInfo().then((res) => {
      user.updateUserInfo(res.data);
    });
  }, [userInfo.id]);

  return (
    <div className={styles.topnav}>
      <h4>JUEYIN</h4>
      {!!userInfo.id ? (
        <div onClick={() => navigate("/user/info")} className={styles.userInfo}>
          <Avatar style={{ marginRight: 10 }} size={40} src={userInfo.avatar} />
          {userInfo.username}
        </div>
      ) : (
        <Button
          onClick={() => {
            navigate("/login");
          }}
          type="primary"
        >
          登录
        </Button>
      )}
    </div>
  );
};

export default observer(TopNav);
