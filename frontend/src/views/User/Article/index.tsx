import { List, Popconfirm, Popover, Tabs, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { deleteArticle, getMyArticle } from "../../../api/article";
import { useNavigate } from "react-router";

const Article = () => {
  const [data, setData] = useState<any>({});
  const [activeKey, setActiveKey] = useState("draft");
  const navigate = useNavigate();
  const getData = useCallback(async () => {
    const res = await getMyArticle();
    setData(res.data);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Tabs
        style={{ margin: "0 8px" }}
        activeKey={activeKey}
        onChange={(e) => {
          setActiveKey(e);
        }}
      >
        <Tabs.TabPane tab="草稿" key="draft"></Tabs.TabPane>
        <Tabs.TabPane tab="已发布的" key="published"></Tabs.TabPane>
      </Tabs>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={data?.[activeKey] || []}
        renderItem={(item: any) => (
          <List.Item
            style={{ padding: 8 }}
            actions={[
              <Popconfirm
                title="确认删除吗？"
                onConfirm={async () => {
                  await deleteArticle({ id: item.id });
                  await getData();
                  message.success("删除成功");
                }}
              >
                <a
                  style={{ marginRight: 12 }}
                  onClick={() => navigate(`/editor?id=${item.id}`)}
                >
                  编辑
                </a>
                <a>删除</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.introduction}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Article;
