import { useEffect, useRef, useState } from "react";
import { getUserInfo, updateUserInfo, upload } from "../../../api/user";
import { Avatar, Button, Form, Input, message } from "antd";
import styles from "./index.module.less";
const UserInfo = () => {
  const [init, setInit] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<{
    avatar: string;
    username: string;
    info: string;
  }>({
    avatar: "",
    username: "",
    info: "",
  });
  useEffect(() => {
    getUserInfo().then((res) => {
      setUserInfo(res.data);
      setInit(true);
    });
  }, []);
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    console.log(e.target.files);
    if (!e.target.files) {
      return;
    }
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("files", file);
    const res = await upload(formData);
    if (res.data.length > 0) {
      const url = res.data[0].url;
      const obj = { ...userInfo };
      obj.avatar = url;
      setUserInfo(obj);
    }
  };

  const handleUpdate = async () => {
    if (!userInfo.avatar) {
      message.warning("请上传头像");
      return;
    }
    const fields = await form.validateFields();
    const res = await updateUserInfo({
      avatar: userInfo.avatar,
      username: fields.username,
      info: fields.info,
    });
    if (res.status === 200) {
      message.success("更新成功");
    }
  };

  if (!init) {
    return null;
  }
  return (
    <div className={styles.container}>
      <div>
        <span style={{ color: "red" }}>*</span>
        <Avatar style={{ margin: "0 20px" }} size={100} src={userInfo.avatar}>
          {!userInfo.avatar ? userInfo.username.substring(0, 1) : ""}
        </Avatar>
        <Button onClick={() => ref.current?.click()} type="primary">
          上传头像
        </Button>
        <input
          accept="image/*"
          onChange={handleFileChange}
          type="file"
          className={styles.input}
          ref={ref}
        />
      </div>
      <Form initialValues={userInfo} form={form} style={{ marginTop: 20 }}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input showCount maxLength={20} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="info" label="简介">
          <Input.TextArea showCount maxLength={100} placeholder="请输入简介" />
        </Form.Item>
      </Form>
      <Button onClick={handleUpdate} type="primary">
        更新
      </Button>
    </div>
  );
};

export default UserInfo;
