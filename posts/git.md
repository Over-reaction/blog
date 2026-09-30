---
title: git提交规范
description: 一处安静记录技术、设计与生活的个人空间。
category: git
date: 2026-09-29
readingTime: 约 2 分钟
---

# Git 提交描述规范

为了让自己的 Git 提交记录更清晰、统一，后续项目统一按照下面的格式提交。

## 1. 提交格式

统一使用：

```text
<type>(<scope>): <subject>
```

例如：

```text
feat(blog): 新增文章分类功能
fix(vitepress): 修复侧边栏配置错误
docs(git): 新增 Git 提交规范说明
```

其中：

- `type`：本次提交的类型
- `scope`：本次修改影响的模块，可选
- `subject`：本次修改的简要描述

---

## 2. type 类型

| type       | 说明                             | 示例                                    |
| ---------- | -------------------------------- | --------------------------------------- |
| `feat`     | 新增功能                         | `feat(blog): 新增文章搜索功能`          |
| `fix`      | 修复问题                         | `fix(vitepress): 修复导航栏跳转错误`    |
| `docs`     | 文档修改                         | `docs(git): 新增 Git 提交规范`          |
| `style`    | 样式调整，不影响功能逻辑         | `style(home): 调整首页标题间距`         |
| `refactor` | 代码重构，不新增功能也不修复 Bug | `refactor(config): 重构导航配置`        |
| `perf`     | 性能优化                         | `perf(home): 优化首页图片加载速度`      |
| `test`     | 测试相关                         | `test(utils): 补充工具函数测试`         |
| `build`    | 构建工具、依赖相关修改           | `build(vitepress): 升级 VitePress 版本` |
| `ci`       | CI/CD、部署流程相关              | `ci(cloudflare): 修改 Pages 构建配置`   |
| `chore`    | 其他杂项修改                     | `chore: 删除无用文件`                   |
| `revert`   | 回滚某次提交                     | `revert: 回滚首页布局调整`              |

---

## 3. scope 规范

`scope` 用来描述本次修改涉及的模块。

例如博客项目可以使用：

```text
blog
home
nav
sidebar
theme
vitepress
config
deploy
cloudflare
git
docs
```

例如：

```text
feat(home): 新增首页文章推荐区域
fix(sidebar): 修复侧边栏目录未显示的问题
ci(cloudflare): 修改 Cloudflare Pages 构建配置
```

如果本次修改没有明确模块，可以省略：

```text
chore: 删除无用文件
docs: 更新项目说明
```

---

## 4. subject 描述规范

提交描述要做到：

> 一眼看出这次提交修改了什么。

推荐：

```text
feat(blog): 新增文章分类功能
fix(nav): 修复导航栏链接跳转错误
docs(vitepress): 补充部署说明
build: 升级项目依赖
```

不推荐：

```text
修改代码
更新
fix bug
改一下
test
123
```

不要写没有实际意义的提交描述。

---

## 5. 常用提交示例

### 新增功能

```text
feat(blog): 新增文章分类功能
```

```text
feat(home): 新增首页文章列表
```

### 修复 Bug

```text
fix(vitepress): 修复侧边栏配置错误
```

```text
fix(nav): 修复导航栏跳转异常
```

### 修改文档

```text
docs(git): 新增 Git 提交描述规范
```

```text
docs(vitepress): 更新 VitePress 部署说明
```

### 修改样式

```text
style(home): 调整首页布局
```

```text
style(theme): 调整代码块样式
```

### 修改依赖

```text
build: 升级 VitePress 版本
```

```text
build: 更新 pnpm-lock.yaml
```

### 部署相关

```text
ci(cloudflare): 修改 Cloudflare Pages 构建命令
```

```text
ci(cloudflare): 修改构建输出目录
```

### 重构

```text
refactor(config): 重构 VitePress 导航配置
```

---

## 6. 多项修改

如果一次提交包含多个相关修改，可以使用正文补充说明。

例如：

```text
feat(blog): 完善博客基础功能

- 新增文章分类
- 新增文章标签
- 调整侧边栏目录
```

但如果修改内容彼此没有关系，应该拆成多个 commit。

例如不要这样：

```text
feat: 新增文章分类并修复导航栏同时修改首页样式
```

建议拆成：

```text
feat(blog): 新增文章分类功能
fix(nav): 修复导航栏跳转错误
style(home): 调整首页样式
```

---

## 7. 我的提交标准

以后统一优先使用：

```text
type(scope): 中文描述
```

例如：

```text
feat(blog): 新增文章分类功能
fix(vitepress): 修复配置错误
docs(git): 新增 Git 提交规范
style(home): 调整首页样式
refactor(config): 优化配置结构
build: 更新项目依赖
ci(cloudflare): 调整 Cloudflare Pages 部署配置
chore: 清理无用文件
```

原则：

1. 提交描述使用中文。
2. `type` 使用英文。
3. 描述尽量简短明确。
4. 一个 commit 尽量只做一件事。
5. 不使用 `修改代码`、`update`、`fix bug` 等没有意义的描述。
6. 提交前先确认本次修改属于哪一种类型。

---

## 8. 快速选择

不知道该使用哪个 `type` 时，可以按照下面判断：

```text
新增功能        → feat
修复 Bug        → fix
修改文档        → docs
调整样式        → style
代码重构        → refactor
性能优化        → perf
修改测试        → test
修改依赖/构建   → build
修改部署流程    → ci
其他杂项        → chore
回滚代码        → revert
```

---

## 9. 当前博客项目示例

例如目前 VitePress 博客开发过程中，可以这样提交：

```text
build(vitepress): 初始化 VitePress 项目
```

```text
docs(blog): 新增博客首页内容
```

```text
fix(git): 修复 package.json 被全局 gitignore 忽略的问题
```

```text
ci(cloudflare): 配置 VitePress 构建命令和输出目录
```

```text
build(pnpm): 更新项目依赖
```

```text
docs(git): 新增 Git 提交描述规范
```
