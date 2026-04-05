# Todo List App - 开发规范

## 技术栈
- **前端框架**：原生 HTML/CSS/JavaScript（无构建工具）
- **样式**：Tailwind CSS CDN + 自定义 CSS
- **存储**：localStorage
- **动画**：CSS Keyframes

## 项目结构
```
├── index.html          # 主应用入口
├── js/app.js           # 应用核心逻辑（单一入口）
├── styles/animations.css # 动画和主题样式
└── CLAUDE.md           # 本文件
```

## 代码规范

### HTML
- 使用语义化标签
- 通过 `data-*` 属性存储动态数据（如 `data-task-id`）
- 所有交互元素使用合理的 `id` 和 `class`

### CSS
- 使用 Tailwind utility classes 为主
- 自定义样式写在 `animations.css`
- 颜色主题通过 CSS 变量管理
- 使用 `@keyframes` 定义所有动画

### JavaScript
- 使用 ES6+ 语法（class、箭头函数、模板字符串）
- 单一 `TodoApp` 类管理全部状态和逻辑
- 事件处理通过 `addEventListener` 绑定
- DOM 操作缓存元素引用（`cacheElements` 方法）

## 功能开发指南

### 添加新功能
1. 在 HTML 中添加必要的 UI 元素
2. 在 `cacheElements()` 中缓存 DOM 节点
3. 在 `attachEventListeners()` 中绑定事件
4. 在 `TodoApp` 类中实现业务逻辑
5. 在 `render()` 方法中更新 UI

### 数据模型（Task 对象）
```javascript
{
  id: Number,           // 唯一标识（时间戳）
  text: String,         // 任务内容
  completed: Boolean,   // 完成状态
  category: String,     // 分类
  priority: String,     // 优先级（low/medium/high）
  tags: Array,          // 标签数组
  createdAt: String     // ISO 格式时间戳
}
```

## 动画规范

### 进入动画
- 任务添加：`slideInUp` (0.3s)
- 使用 `animation: slideInUp 0.3s ease-out` 应用

### 退出动画
- 任务删除：`slideOutDown` (0.3s)
- 动画完成后 **必须** 从 DOM 中移除
- 在 JavaScript 中添加 `remove` 类，动画完成后再删除元素

### 交互动画
- Hover 效果：使用 CSS `transition` + `transform`
- 按钮点击：`active:scale-95`
- 主题切换：`transition: background-color 0.3s ease`

## 主题系统

### 支持的主题
- `light-theme`：浅色（默认）
- `dark-theme`：深色

### 实现方式
- 在 `<body>` 标签添加主题 class
- CSS 通过 `.light-theme` 和 `.dark-theme` 选择器区分样式
- localStorage 保存用户偏好

## 数据持久化

- **保存触发**：每次修改任务后调用 `saveTasks()`
- **读取时机**：应用初始化时调用 `loadTasks()`
- **存储键**：
  - `todoTasks`：任务数据（JSON 数组）
  - `todoTheme`：主题偏好（字符串）

## 性能考虑

- 避免频繁大量重排：使用动画完成后再删除 DOM
- 缓存 DOM 查询结果
- 使用事件委派处理大量元素（如需）
- CSS 动画优于 JavaScript 动画

## 响应式设计

- 移动优先设计原则
- 关键断点：`md` (768px)
- 使用 Tailwind 响应式前缀（`md:`, `lg:` 等）

## 可访问性

- 所有交互元素有适当的 `title` 属性
- 使用语义化 HTML 标签
- 表单输入有正确的 `label`
- `accent-color` 确保复选框可访问

## 调试

- 浏览器开发者工具查看 localStorage：`Application > Local Storage`
- 在 `console` 清空数据：`localStorage.clear()`
- 使用 `debugger` 或 `console.log()` 追踪状态

## 扩展建议

### 低优先级
- 实现任务编辑（目前只支持提示框）
- 添加任务搜索功能
- 导出/导入任务

### 中优先级
- 添加完成时间显示
- 实现任务排序（按创建时间、优先级等）
- 拖拽重排任务顺序

### 高优先级
- 后端 API 集成
- 云同步功能
- 多设备同步
