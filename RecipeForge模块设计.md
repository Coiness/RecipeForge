# RecipeForge技术实现

## 核心功能模块

- `RecipeManager` 配方管理
- `ItemManager` 物品管理
- `OrderManager` 订单管理
- `Calculator` 原料计算组件

### UI组件

- `RecipeForm` 配方表单
- `ItemForm` 物品表单
- `OrderForm` 订单表单
- `ResultDisplay` 计算结果展示
- `DataImportExport` 数据导入导出

### 布局组件

- `Header` 顶部导航
- `Sidebar` 侧边栏
- `Content`内容
- `Layout` 整体布局

## 技术栈

- 构建工具：`Vite`
- 框架：`React`
- 语言：`TypeScript`
- 状态管理：`reduce`
- 重叠样式表：`TailwindCSS`
- 网络请求：`Axios`
- 代码规范：`ESLint`
- 代码测试：`Jest + React Testing Library`
- CI/CD流水线：`GithubAction`

## 开发顺序

1. 项目初始化与架构搭建
2. 核心数据模型设计
3. 核心功能逻辑实现
4. UI组件开发
5. 页面集成
6. 功能整合与测试
7. 数据持久化与高级功能
8. 收尾工作