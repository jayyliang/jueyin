import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { getArticles, getCategoryList } from "../../api/article";
import TopNav from "../../components/Topnav";
import { Divider, List, Skeleton, Tag } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./index.module.less";
import { useNavigate } from "react-router";
const Home = () => {
  const [article, setArticle] = useState<any>({});
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const [init, setInit] = useState(false);
  const [categoryMap, setCategoryMap] = useState<any>({});
  const navigate = useNavigate();
  useEffect(() => {
    getCategoryList().then((res) => {
      const map: any = {};
      res.data.forEach((item: any) => {
        map[item.id] = item.name;
      });
      setCategoryMap(map);
    });
  }, []);

  useEffect(() => {
    getArticles(pageNo, pageSize).then((res) => {
      setArticle((old: any) => {
        if (old?.list?.length) {
          res.data.list = old.list.concat(res.data.list);
        }
        return res.data;
      });
      setInit(true);
    });
  }, [pageNo]);
  if (!init) {
    return null;
  }
  return (
    <div>
      <TopNav />
      <div id="scrollableDiv" className={styles.list}>
        <InfiniteScroll
          dataLength={article.total}
          next={() => setPageNo(pageNo + 1)}
          hasMore={!article.isEnd}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>到底了～</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={article.list}
            renderItem={(item: any) => (
              <List.Item
                className={styles.listItem}
                onClick={() => navigate(`/detail?id=${item.id}`)}
                key={item.id}
              >
                <List.Item.Meta
                  title={item.title}
                  description={
                    <>
                      <div style={{ margin: "8px 0" }}>{item.introduction}</div>
                      <Tag>{categoryMap[item.categoryId]}</Tag>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};
export default observer(Home);
