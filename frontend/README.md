# 惠商城（HyperMall）前端

> 基于 **Vue 3 + Vite + Pinia + Vue Router + Element Plus** 的商城前端，对接后端微服务网关。

## 功能

- 商品浏览 / 搜索（关键词分词、分类、品牌、价格区间、分页）
- 商品详情（规格、库存、销量、评论）
- 登录 / 退出（JWT）
- 购物车（增删改查、多选、结算）
- 下单结算
- 余额支付（申请支付单 → 支付密码 → 支付成功）
- 订单详情 / 收货地址查看

## 环境要求

- Node.js 18+（Vite 5 需要）
- 后端网关已启动，默认地址 `http://localhost:8080`

## 快速开始

```bash
cd frontend
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`。

前端通过 **Vite 代理** 把 `/items`、`/search`、`/users`、`/carts`、`/orders`、`/pay-orders`、`/addresses`
转发到后端网关，因此**无需后端配置 CORS**。

如果后端不在本机，可用环境变量覆盖网关地址：

```bash
VITE_API_TARGET=http://your-host:8080 npm run dev
```

## 生产构建

```bash
npm run build
npm run preview
```

## 与后端的约定

- 网关入口 `http://localhost:8080`，各接口路径与后端 Controller 一致（无额外前缀）。
- **成功**：HTTP 200 + 裸对象（分页返回 `{total, pages, list}`，登录返回 `{token, userId, username, balance}`）。
- **失败**：HTTP 非 200 + `{ code, msg, data:null }`，前端统一弹出 `msg`。
- **鉴权**：登录后 JWT 存 `localStorage`，请求头带 `Authorization`；401 时自动跳登录。
- **金额单位**：后端一律以「分」存储，前端展示统一除以 100。
- **ID 类型**：后端 `Long` 序列化为 JSON 字符串，前端提交时转回数字。
- **支付密码**：即登录密码（后端 `deductMoney` 用 `BCrypt.matches(pw, password)` 校验）。

## 目录结构

```
frontend/
├── index.html
├── vite.config.js          # Vite 代理配置
└── src/
    ├── api/                # axios 封装 + 各模块接口
    ├── stores/             # Pinia：user / cart / checkout
    ├── router/             # 路由 + 登录守卫
    ├── components/         # 头部 / 底部 / 商品卡片
    ├── layouts/            # 默认布局
    ├── views/              # 页面
    ├── utils/              # 格式化 / 常量
    └── assets/styles/      # 全局样式 + 主题变量
```
