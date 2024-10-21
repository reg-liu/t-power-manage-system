T-Power Management System

# 说明

React + Reach Router + Typescript + Ant Design(Pro) + webpack4.0
使用 React hook 进行开发

本地开发Node Version 16.9.0

# 项目运行

```
# 安装项目依赖
yarn

# 项目启动
yarn start

# 项目构建
yarn build

```

# 业务介绍

目录结构

    ├── src                     // 源码目录
    │   ├── api                 // api接口
    │   ├── components          // 公共组件
    │   ├── reducers            // 全局状态具体
    │   ├── context             // 全局状态抽象
    │   ├── pages               // 页面文件目录
    │   │   └── index
    │   │       ├── index.tsx   // 页面逻辑
    │   │       ├── index.less  // 页面样式
    │   ├── reducers            // 全局状态具体
    │   ├── routes              // 路由定义
    │   ├── util                // 常用工具类
    │   ├── index.tsx           // 入口文件
    │   ├── config.tsx          // 全局静态配置
    │   ├── global.d.ts         // 全局TS类型声明
    ├── .eslintignore           // eslint 忽略配置
    ├── .gitignore              // git提交忽略配置
    ├── babel.config.js         // babel 配置
    ├── .prettierrc.json        // prettier 配置
    ├── commitlint.config.js    // commitlint 配置
    ├── tailwind.config.js      // tailwind 配置
    ├── tsconfig.json           // Typescript 配置
    ├── tslint.json             // Typescript 检测配置
    └── webpack.config.js       // Webpack 配置
