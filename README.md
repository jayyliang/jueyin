## 简介

这是一个 React+Nest 实现的全栈社区项目，持续更新中

- /frontend 前端目录
- /server 后端目录
- 前后端都是 npm run dev 启动

### 往期文章

[仓库地址](https://github.com/jayyliang/jueyin)

 - [切图仔做全栈：React&Nest.js 社区平台(一)——基础架构与邮箱注册、JWT 登录实现](https://juejin.cn/post/7344571313685970956)
 - [切图仔做全栈：React&Nest.js社区平台(二)——👋手把手实现优雅的鉴权机制](https://juejin.cn/post/7345379924167262249)
 - [React&Nest.js全栈社区平台(三)——🐘对象存储是什么？为什么要用它？](https://juejin.cn/post/7345774710850322473)
 - [React&Nest.js社区平台(四)——✏️文章发布与管理实战](https://juejin.cn/post/7347668702030692371)
 - [React&Nest.js全栈社区平台(五)——👋封装通用分页Service实现文章流与详情](https://juejin.cn/post/7348289379054944295)
 - [领导问我：为什么一个点赞功能你做了五天？](https://juejin.cn/post/7349437605858066443)
 - [🤔️测试问我：为啥阅读量计数这么简单的功能你都能写出bug？](https://juejin.cn/post/7358704806779764777)

## 配置

/server 目录下新建一个.env 文件，填入配置

```
DB_HOST=xxx
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=xxx
DB_DATABASE=xxx

EMAIL_HOST=xxx
EMAIL=xxx
EMAIL_PASSWORD=xxx
EMAIL_SECRET=xxx

REDIS_HOST=xxx
REDIS_PORT=6379
REDIS_PASSWORD=xxx

MINIO_ENDPOINT=localhost
MINIO_ACCESSKEY=MINIO_ACCESSKEY
MINIO_SECRET_KEY=MINIO_SECRET_KEY
```

## SQL

在 jueyin.sql 文件里

## 联系我

![](./qrcode.jpeg)
