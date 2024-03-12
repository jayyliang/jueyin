import React, { Suspense } from "react";
import { Route, Routes, Navigate, HashRouter } from "react-router-dom";

const Home = React.lazy(() => import("./views/Home"));
const Login = React.lazy(() => import("./views/Login"));
const User = React.lazy(() => import("./views/User"));
const UserInfo = React.lazy(() => import("./views/User/Info"));

const PageRouter = () => {
  return (
    <Suspense fallback={<div></div>}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/home"} />}></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>404</div>}></Route>
          <Route path="/user" element={<User />}>
            <Route index path="/user/info" element={<UserInfo />}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </Suspense>
  );
};

export default PageRouter;
