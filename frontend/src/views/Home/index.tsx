import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { getArticles, getCategoryList } from "../../api/article";
import TopNav from "../../components/Topnav";
import { Divider, List, Skeleton, Space, Tag } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./index.module.less";
import { useNavigate } from "react-router";
import { getLikes, toggleLike } from "../../api/like";
import { LikeOutlined } from "@ant-design/icons";

const Home = () => {
  const [article, setArticle] = useState<any>({});
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const [init, setInit] = useState(false);
  const [categoryMap, setCategoryMap] = useState<any>({});
  const lockMap = useRef<any>({});
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

  useEffect(() => {
    if (!article.list) {
      return;
    }
    const shouldGetLikeIds = article.list
      .filter((item: any) => !item.likeInfo)
      .map((item: any) => item.id);
    if (shouldGetLikeIds.length === 0) {
      return;
    }
    console.log("shouldGetLikeIds", shouldGetLikeIds);
    getLikes({
      targetIds: shouldGetLikeIds,
      type: 1,
    }).then((res) => {
      const map = res.data;
      const newList = [...article.list];
      for (let i = 0; i < newList.length; i++) {
        if (!newList[i].likeInfo && map[newList[i].id]) {
          newList[i].likeInfo = map[newList[i].id];
        }
      }
      const newArticle = { ...article };
      newArticle.list = newList;
      setArticle(newArticle);
    });
  }, [article]);

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
            itemLayout="vertical"
            dataSource={article.list}
            renderItem={(item: any) => (
              <List.Item
                className={styles.listItem}
                onClick={() => navigate(`/detail?id=${item.id}`)}
                key={item.id}
                actions={[
                  item.likeInfo ? (
                    <>
                      <Space
                        onClick={(e) => {
                          e.stopPropagation();
                          if (lockMap.current?.[item.id]) {
                            return;
                          }
                          lockMap.current[item.id] = true;
                          const oldValue = item.likeInfo.isLike;
                          const newValue = !oldValue;
                          const updateValue = (value: any) => {
                            const newArticle = { ...article };
                            const newList = [...newArticle.list];
                            const current = newList.find(
                              (_) => _.id === item.id
                            );
                            current.likeInfo.isLike = value;
                            if (value) {
                              current.likeInfo.count++;
                            } else {
                              current.likeInfo.count--;
                            }
                            setArticle(newArticle);
                          };
                          updateValue(newValue);
                          toggleLike({
                            targetId: item.id,
                            value: Number(newValue),
                            type: 1,
                          })
                            .catch(() => {
                              updateValue(oldValue);
                            })
                            .finally(() => {
                              lockMap.current[item.id] = false;
                            });
                        }}
                      >
                        <LikeOutlined
                          style={
                            item.likeInfo.isLike ? { color: "#1677ff" } : {}
                          }
                        />
                        {item.likeInfo.count}
                      </Space>
                    </>
                  ) : (
                    // <IconText
                    //   icon={LikeOutlined}
                    //   text={item.likeInfo.count}
                    //   key="list-vertical-like-o"
                    // />
                    ""
                  ),
                ]}
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
