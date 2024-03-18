import Router from "./Router";
import "./global.less";
import { ConfigProvider } from "antd";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import zhCN from "antd/locale/zh_CN";
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="root-container">
        <Router />
      </div>
    </ConfigProvider>
  );
}

export default App;
