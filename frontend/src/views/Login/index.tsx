import { Button, Form, FormInstance, Input, Row, Tabs, message } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import styles from "./index.module.less";
import { useState } from "react";
import { getVerifyCode, login, register } from "../../api/user";
const REQUIRED_RULE = [{ required: true, message: "请输入${label}" }];
const VerifyCodeButton = ({ form }: { form: FormInstance }) => {
  const [seconds, setSeconds] = useState(0);
  const handleClick = async () => {
    const res = await form.validateFields(["email"]);
    await getVerifyCode(res.email);
    setSeconds(60);
    let timer = setInterval(() => {
      setSeconds((preSeconds) => {
        if (preSeconds <= 1) {
          clearInterval(timer);
          return 0;
        } else {
          return preSeconds - 1;
        }
      });
    }, 1000);
  };

  return (
    <Button type="primary" disabled={seconds !== 0} onClick={handleClick}>
      {seconds > 0 ? `重新发送 (${seconds}s)` : "获取验证码"}
    </Button>
  );
};
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const renderForm = (withCode?: boolean) => {
    const handleSubmit = async () => {
      const fields = await form.validateFields();
      try {
        if (withCode) {
          await register(fields);
        }
        await login({ email: fields.email, password: fields.password });
        message.success("登录成功");
      } finally {
        setLoading(false);
      }
    };
    return (
      <div>
        <Form form={form}>
          <Form.Item name="email" label="邮箱" rules={REQUIRED_RULE}>
            <Input placeholder="输入邮箱" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={REQUIRED_RULE}>
            <Input type="password" placeholder="输入密码" />
          </Form.Item>
          {withCode && (
            <Row>
              <Form.Item
                style={{ marginRight: 20 }}
                name="code"
                label="验证码"
                rules={REQUIRED_RULE}
              >
                <Input placeholder="输入验证码" />
              </Form.Item>
              <VerifyCodeButton form={form} />
            </Row>
          )}
        </Form>
        <Button loading={loading} onClick={handleSubmit} type="primary">
          提交
        </Button>
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Tabs>
          <TabPane key="login" tab="登录">
            {renderForm()}
          </TabPane>
          <TabPane key="register" tab="注册">
            {renderForm(true)}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
