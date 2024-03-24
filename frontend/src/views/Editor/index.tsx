import { useLocation, useNavigate } from "react-router";
import useQuery from "../../hooks/useQuery";
import { upload } from "../../api/user";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor as BEditor } from "@bytemd/react";
import "bytemd/dist/index.css";
import zh from "bytemd/locales/zh_Hans.json";
import "highlight.js/styles/default.css";
// import "./editor.css";
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.less";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Select,
  message,
} from "antd";
import {
  createOrUpdateArticle,
  getArticleInfo,
  getCategoryList,
  publishArticle,
} from "../../api/article";
import { debounce, throttle } from "lodash";
import dayjs from "dayjs";
const plugins = [gfm(), highlight()];
const Editor = () => {
  const navigate = useNavigate();
  const { id } = useQuery();
  const [data, setData] = useState<any>({});
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [init, setInit] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (!id) {
      return;
    }
    getArticleInfo(id).then((res) => {
      setData(res.data);
      setTitle(res.data.title);
      setValue(res.data.content);
      setTimeout(() => setInit(true));
    });
    getCategoryList().then((res) => {
      setCategoryList(
        res.data.map((item: any) => ({
          ...item,
          value: item.id,
          label: item.name,
        }))
      );
    });
  }, [id]);
  const updateArticle = useCallback(
    debounce((id: number, title: string, content: string) => {
      createOrUpdateArticle({
        id,
        title,
        content,
      });
    }, 1000),
    []
  );

  useEffect(() => {
    if (!init || !id) {
      return;
    }
    updateArticle(id, title, value);
  }, [title, value, init, id]);

  const handleUpload = async (files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    const res = await upload(formData);
    return res.data.map((item: any) => ({ url: item.url }));
  };

  const publish = async () => {
    const fields = await form.validateFields();
    if (fields.time) {
      fields.time = dayjs(fields.time).format("YYYY-MM-DD HH:mm:ss");
    }
    const res = await publishArticle({
      id,
      ...fields,
    });
    if (res.data) {
      message.success("发布成功");
      navigate("/user/article");
    }
  };

  if (!id || !init) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Row
        style={{ flexWrap: "nowrap", alignItems: "center", marginRight: 20 }}
      >
        <Input
          className={styles.title}
          value={title}
          onInput={(e: any) => setTitle(e.target.value)}
        />
        <Popover
          trigger={["click"]}
          content={
            <div style={{ width: 400 }}>
              <Form
                initialValues={{
                  categoryId: data.categoryId,
                  introduction: data.introduction,
                }}
                form={form}
              >
                <Form.Item
                  rules={[{ required: true, message: "请选择标签" }]}
                  name="categoryId"
                  label="标签"
                >
                  <Select options={categoryList} />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "请输入简介" }]}
                  name="introduction"
                  label="简介"
                >
                  <Input.TextArea maxLength={100} showCount />
                </Form.Item>
                {data.status === 0 && (
                  <Form.Item name="time" label="定时发布">
                    <DatePicker
                      disabledTime={() => {
                        const range = (start: number, end: number) => {
                          const result = [];
                          for (let i = start; i < end; i++) {
                            result.push(i);
                          }
                          return result;
                        };
                        const now = new Date();
                        const hour = now.getHours();
                        const minute = now.getMinutes();
                        return {
                          disabledHours: () =>
                            range(0, 24).filter((h) => h < hour),
                          disabledMinutes: () =>
                            range(0, 60).filter((m) => m - 5 < minute),
                        };
                      }}
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf("day");
                      }}
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                    />
                  </Form.Item>
                )}
                <Button onClick={publish} type="primary">
                  发布
                </Button>
              </Form>
            </div>
          }
        >
          <Button type="primary">发布</Button>
        </Popover>
      </Row>
      <div className={styles.contentWrapper}>
        <div className={styles.editor}>
          <BEditor
            uploadImages={handleUpload}
            mode="split"
            locale={zh}
            value={value}
            plugins={plugins}
            onChange={(v) => {
              setValue(v);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
