import { useEffect, useState } from "react";
import { getArticleInfo } from "../../api/article";
import useQuery from "../../hooks/useQuery";
import { getUserInfoById } from "../../api/user";
import { Avatar } from "antd";
import styles from "./index.module.less";
import ReactMarkdown from "react-markdown";
const Detail = () => {
  const { id } = useQuery();
  const [init, setInit] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [article, setArticle] = useState<any>({});
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
        <ReactMarkdown children={article.content} />
      </div>
    </div>
  );
};

export default Detail;
