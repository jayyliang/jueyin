import { Button, Menu, Row } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import styles from "./index.module.less";
import { useMemo } from "react";
import { createOrUpdateArticle } from "../../api/article";
const User = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = useMemo(() => {
    return [location.pathname];
  }, [location.pathname]);

  const handleCreate = async () => {
    const res = await createOrUpdateArticle({ title: "无标题", content: "" });

    navigate(`/editor?id=${res.data}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Row style={{ justifyContent: "center", margin: "12px 0" }}>
          <Button onClick={handleCreate} type="primary">
            写文章
          </Button>
        </Row>
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
            {
              label: "我的文章",
              key: "/user/article",
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
