import { useEffect, useRef, useState } from "react";
import { getArticleInfo } from "../../api/article";
import useQuery from "../../hooks/useQuery";
import { getUserInfoById } from "../../api/user";
import { Avatar, Space } from "antd";
import styles from "./index.module.less";
import ReactMarkdown from "react-markdown";
import { LikeOutlined } from "@ant-design/icons";
import { getLikes, toggleLike } from "../../api/like";
const Detail = () => {
  const { id } = useQuery();
  const [init, setInit] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [article, setArticle] = useState<any>({});
  console.log(article);
  const lock = useRef(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    getArticleInfo(id).then((res) => {
      setArticle(res.data);
      getUserInfoById(res.data.creatorId).then((res) => {
        setUserInfo(res.data);
        setInit(true);
      });
      getLikes({
        targetIds: [id],
        type: 1,
      }).then((likeRes) => {
        setArticle(Object.assign({}, res.data, { likeInfo: likeRes.data[id] }));
      });
    });
  }, [id]);
  if (!init) {
    return null;
  }
  return (
    <div>
      <div className={styles.userInfo}>
        <Avatar src={userInfo.avatar} />
        <h4>{userInfo.username}</h4>
      </div>
      <div className={styles.content}>
        <div className={styles.actions}>
          {!!article.likeInfo && (
            <Space
              onClick={(e) => {
                e.stopPropagation();
                if (lock.current) {
                  return;
                }
                lock.current = true;
                const oldValue = article.likeInfo.isLike;
                const newValue = !oldValue;
                console.log(newValue, oldValue);
                const updateValue = (value: any) => {
                  const newArticle = { ...article };
                  newArticle.likeInfo.isLike = value;
                  if (value) {
                    newArticle.likeInfo.count++;
                  } else {
                    newArticle.likeInfo.count--;
                  }
                  setArticle(newArticle);
                };
                updateValue(newValue);
                toggleLike({
                  targetId: article.id,
                  value: Number(newValue),
                  type: 1,
                })
                  .catch(() => {
                    updateValue(oldValue);
                  })
                  .finally(() => {
                    lock.current = false;
                  });
              }}
            >
              <LikeOutlined
                size={60}
                style={{
                  color: article.likeInfo.isLike ? "#1677ff" : "",
                  cursor: "pointer",
                }}
              />
              {article.likeInfo.count}
            </Space>
          )}
        </div>
        <ReactMarkdown children={article.content} />
      </div>
    </div>
  );
};

export default Detail;
