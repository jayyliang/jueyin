import { Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import styles from "./index.module.less";
import { useMemo } from "react";
const User = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = useMemo(() => {
    return [location.pathname];
  }, [location.pathname]);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Menu
          onClick={(e) => {
            navigate(e.key);
          }}
          selectedKeys={selected}
          items={[
            {
              label: "个人信息",
              key: "/user/info",
            },
          ]}
        ></Menu>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default User;
