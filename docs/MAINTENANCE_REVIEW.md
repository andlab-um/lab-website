# 发布前代码与运维审查

日期：2026-09-12。依据当前本地源码与会话中已读取的预览 Nginx 配置。本文是待办建议，不表示已完成重构或已检查 GitHub Pages 后台。地图按用户要求暂时搁置。

## 结论与优先级

发布准备进展：已核实 Pages 使用 `main` 根目录原生构建，正式域名和 HTTPS 已配置；已修复 Bootstrap、附件及课程/视频子路径链接，并在 .gitignore 排除本机依赖。以下表格保留原审查记录，运行时升级、依赖锁定、预览 Nginx 新路由和 BibTeX 统一仍待后续处理。

继续使用 Jekyll 足以支撑实验室网站。优先修复发布路径和可复现构建，再把内容与模板分离。日常 AI 更新最终应只涉及内容记录和图片，并由自动化检查保障。

| 优先级 | 观察证据 | 建议 | 验收 |
| --- | --- | --- | --- |
| P0 | footer.html 以 site.url + baseurl 加载 Bootstrap，前次预览仅覆盖 baseurl | 改为 relative_url；为预览配置独立 url | 预览不向旧正式域名请求脚本，手机菜单能展开 |
| P0 | position.md、publication.md、science_projects.md 有根路径附件，science_resources.md 有 ../assets 路径 | 统一站内下载 URL 的子路径处理 | 从真实页面点击附件，返回预期文件而非主站 HTML |
| P0 | 预览 Nginx 只列举旧页面 .html 重定向，缺 open-science | 完善新路由，或规划兼容的目录型 permalink | 点击 /andlab-preview/open-science 能正常打开 |
| P0 | .gitignore 未忽略 vendor/ 和 .bundle/，且 *.lock 忽略锁文件 | 排除本机依赖/缓存/秘密，选定运行时后纳入 Gemfile.lock | 全新检出能重复构建，暂存区不含本机依赖 |
| P0 | Gemfile 为 Ruby 2.6 限制旧 ffi/Nokogiri，未建立 CI 运行时 | 统一受支持的 Ruby/Bundler 与依赖版本，整体验证 | 开发、CI、发布使用一致的已验证环境 |
| P1 | BibTeX 按钮指向日期版，维护说明历史上要求更新主文件 | 统一下载与维护文件 | 新论文出现在实际下载文件中 |
| P1 | description 仍为模板内容，多页 sitemap:false，预览继承正式 canonical | 确认正式索引策略，预览 noindex，分离环境配置 | 检查构建后 head 与索引配置 |

P0 指正式发布前优先处理，不是断言所有页面均已坏。表内能确认的是源码或配置风险；线上实际响应仍需针对性复现。此次审查没有修改这些运行时代码。

## News 的核心重构

目前 home.md 混合事件正文、Liquid 数据与大量分类/渲染 JS；标题、配图又散在四份 YAML。以日期作为键无法区分同日事件，关键词分类容易误判，修改内容就可能改变类别。

建议逐条迁移为 Jekyll collection：每条一个 `_news/YYYY-MM-DD-slug.md`，构建时生成卡片和详情页，JS 只处理动态效果。以下是**拟议格式，尚未实现，不能直接用于当前内容更新**：

```yaml
---
id: "2026-09-20-workshop"
date: "2026-09-20"
category: "life"
title: "Research Workshop at AND Lab"
image: "/assets/images/news/2026-09-20-workshop.jpg"
image_alt: "Lab members discussing research"
source_url: "https://example.org/workshop"
---
Full Markdown body here.
```

ID 用于关联，日期用于排序，类别明确填写。迁移保留完整正文、全部图片、视频和原链接；建立旧记录到新 ID 的对应表，对照数量与文字后切换。关闭 JavaScript 后仍可阅读内容。无需为此引入数据库或重建整站。

## 自动校验与发布

先检查 schema：必填字段、真实日期、唯一 ID、类别枚举、YAML 重复键、图片存在、alt、排序和链接协议。检查两种构建的内部链接、锚点、附件与脚本。外链检测区分失效与暂时超时/反爬，避免阻塞所有内容更新。

PR CI 负责构建和检查，正式发布任务复用已验证产物，并记录源码 commit、构建配置、校验和、备份与回滚版本。先核实仓库 Settings → Pages，确定采用原生构建还是 Actions artifact 发布，不同时配置相互覆盖的两套流程。目前没有已配置的自动发布工作流。

部署前检查 Jekyll exclude。README、AGENTS、docs、预览环境配置、缓存及秘密不应成为站点公开产物。仓库里保留维护文档与把维护文档公开发布是两个独立选择。

## 代码规范

- `_sass/_customize_style.scss` 约 2700 行，与新模块样式重叠。按 Header、Home、News、Roadmap、Inner pages 拆分，先扫描引用再清理旧规则，课程页也要覆盖。
- 复用共享字号、颜色、间距、断点 token；减少 ID 高权重选择器、行内样式和依靠加载顺序修补的覆盖。
- 将 home.md 内联脚本迁到独立 JS，通过 JSON script 节点传递 Liquid 数据，使语法检查和内容编辑分离。
- Resource 后续采用显式数据类型，不再从彩色 span 推断分类。论文结构化时保留全部作者、出处和引用信息，维护 BibTeX 一致性。
- 统一语义标题层级，当前 Publication 主标题是 h2；检查键盘可操作、搜索反馈、减少动态效果和复制卡片的可访问性。
- Bootstrap/jQuery 升级前检查手机导航及旧课程页面，不直接替换 CDN 版本。依赖升级单独提交，便于回滚。
- 图片先扫描引用再归档设计试验素材；保留三张研究方向原图与真实新闻素材，采用合理尺寸、压缩、宽高和 lazy loading。

## 建议分批执行

1. 发布可靠性：路径、附件、路由、运行时、忽略规则与构建检查，保留现有设计。
2. 内容模型：News 迁移与字段校验，新旧内容逐条对照，同步 README/AGENTS。
3. 样式清理：组件化 SCSS、静态内容渲染、脚本分离，宽屏与窄屏回归。
4. 发布流程：核实后的 GitHub 正式发布、预览部署、版本记录与回滚演练。

每批可独立回滚。地图暂不修改；未来诊断需读取目标环境请求或错误，本地 INVALID_USER_DOMAIN 不能单独证明所有线上底图问题均由白名单造成。不要在手册存放真实 Key、安全码或服务器凭据。
