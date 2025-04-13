<div align="center"> <a href=""> <img alt="Logo" width="200" height="200" src="https://"> </a> <br> <br>

[![license](https://)](LICENSE)

<h1>数字孪生城市</h1>
</div>

**中文** | [English](./README.md)

## 简介

 是一个免费开源的中后台模版。使用了最新的`vue3`,`vite4`,`TypeScript`等主流技术开发，开箱即用的中后台前端解决方案

## 特性

- **最新技术栈**：使用 Vue3/vite2 等前端前沿技术开发
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：可配置的主题
- **国际化**：内置完善的国际化方案
- **Mock 数据** 内置 Mock 数据方案
- **权限** 内置完善的动态路由权限生成方案
- **组件** 二次封装了多个常用的组件

## 预览







## 文档

[文档地址](https:///)

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Ant-Design-Vue](https://antdv.com/docs/vue/introduce-cn/) - ui 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/.git
```

- 安装依赖

```bash
cd 

pnpm install

```

- 运行

```bash
pnpm serve
```

- 打包

```bash
pnpm build
```

- docker

### dockerFile 位于项目根目录下 并且支持差异化部署

#### 构建镜像

```bash
docker build -t twin-city-web .
```

#### 动态使用环境变量实现容器差异化部署,通过不同的 VG_BASE_URL 环境变量，指向不同的后端服务地址，下面例子使用 http://localhost:3333 作为后端服务地址，并且将容器映射到 6666 端口

```bash
docker run --name twin-city-web -d -p 6666:80  -e VG_BASE_URL=http://localhost:3333 twin-city-web
```

而后可以打开 http://localhost:6666 访问

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## 项目地址

- [数字孪生城市](https://) 




## License

[MIT © -2020](./LICENSE)
