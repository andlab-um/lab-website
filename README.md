# AND Lab 网站维护手册

面向维护者与 AI 编程助手。本文首先说明**当前已实现的内容格式**；待重构事项见 [发布前审查](docs/MAINTENANCE_REVIEW.md)，AI 操作规约见 [AGENTS.md](AGENTS.md)。

- 源码仓库：<https://github.com/andlab-um/lab-website>
- 正式域名配置：`_config.yml` 和 `CNAME`，目前为 `andlab-um.com`。
- 服务器预览：<https://cogniand.com/andlab-preview/>，静态目录为 `/opt/andlab-preview/`。
- 已通过 GitHub API 确认：正式站采用 GitHub Pages 原生构建，从 `main` 分支根目录发布，绑定 `andlab-um.com` 并强制 HTTPS。

基本流程：修改源码 → 本地检查 → 预览验证 → 审核 → 正式发布。不要直接维护 `_site/` 或服务器生成的 HTML，下一次构建会覆盖它们。

## 1. 内容在哪里修改

| 内容 | 编辑位置 |
| --- | --- |
| News 完整正文、原始照片和视频 | `_pages/home.md`，Welcome to our Lab 后、脚本前 |
| Lab Life / Publication 新闻短标题 | `_data/news_life_titles.yml` / `_data/news_publication_titles.yml` |
| 无原始照片时的补图 | `_data/news_life_media.yml` / `_data/news_publication_media.yml` |
| 成员、Alumni | `_data/member.yml`；照片在 `assets/images/team/` |
| 论文清单 | `_pages/publication.md` |
| BibTeX | `assets/files/ANDlab-publications-Bibtex.bib`，注意第 4 节下载文件差异 |
| Open Science 项目、资源 | `_includes/science_projects.md`、`_includes/science_resources.md` |
| Open Science 页头 | `_pages/open-science.html` |
| 招聘 | `_pages/position.md` |
| 首页研究方向、Roadmap | `_includes/home_research.html`、`_includes/home_roadmap.html` |
| 导航、域名、子路径 | `_config.yml`、`_includes/header.html` |
| 共享大标题字号 | `_sass/_home_typography.scss` 的 `--site-type-display` |
| 内页留白、排版 | `_sass/_inner_pages.scss` |

`/resource`、`/openproject` 是保留的旧入口，与 Open Science 共用 includes，不维护重复正文。

## 2. 启动与检查

在仓库根目录执行：

```sh
ruby --version
bundle --version
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4173
```

访问 <http://127.0.0.1:4173/>。修改 `_config.yml` 后重启服务。基本检查：

```sh
bundle exec jekyll build
git diff --check
node --check assets/js/home-motion.js
node --check assets/js/home-roadmap.js
node --check assets/js/inner-pages.js
node --check assets/js/lab-map.js
```

Node 仅用于独立 JS 语法检查。首页含 Liquid 的内联脚本需在构建后用浏览器验证。当前没有项目级测试框架，不把“构建成功”写成“全部测试通过”。

工作站目前使用 Ruby 2.6，Gemfile 有 ffi、Nokogiri 兼容限制；这是历史环境，不是新环境的长期推荐。正式发布前应统一运行时与锁定依赖，见审查文档。

## 3. 添加 News：当前可用格式

### 3.1 添加正文

准备已确认的日期、完整英文正文、短标题、分类意图、图片及说明、来源链接。在 `_pages/home.md` 的 `<h2 id="news">Welcome to our Lab</h2>` 后按日期倒序插入。每条以独立段落中的**加粗日期**开始，下一条日期之前的内容属于当前条目：

```markdown
**2026.09.20** AND Lab held a research workshop on social decision-making.

Lab members shared their ongoing work and discussed future collaborations.

<img src="{{ '/assets/images/news/2026-09-20-workshop.jpg' | relative_url }}" alt="AND Lab members discussing research at the workshop" loading="lazy">

Read more on the [event page](https://example.org/workshop).
```

这是占位示例，需替换事实、日期、素材和链接。新日期使用 `YYYY.MM.DD`，段落与图片之间留空行。不要写入脚本区，不要删除 front matter、include 或现有脚本。

旧日期有 `2025.9.2` 等形式，当前支持，但对应 YAML 键必须逐字一致。不要仅修改正文日期的补零格式。**日期目前兼作查找键，同日多条消息会共用标题/补图。** 遇到同日不同消息，先处理结构冲突，不伪造日期。

### 3.2 分类与短标题

当前没有可填写的 category 字段：脚本根据正文关键词判断 Publication 或 Lab Life。`accepted`、`published`、`publication`、`preprint`、`paper`、`article`、`dataset`、`journal`、`doi` 等会影响分类；`accepted interviews` 与 `journal club` 有 Lab Life 特例。必须检查最终分类，不为了操控分类改写事实。

在对应短标题文件添加一行，日期与正文完全相同：

```yaml
"2026.09.20": "Research Workshop at AND Lab"
```

Lab Life 用 `news_life_titles.yml`；论文新闻用 `news_publication_titles.yml`。缺少短标题时会使用首句，可能很长。YAML 用空格缩进、引号包围日期和含特殊字符的文本，禁止重复键。

### 3.3 图片、视频与来源

正文存在图片时，卡片采用识别到的第一张图。补充图仅在没有识别到正文图片时采用。

无照片的 Lab Life，可在 `news_life_media.yml` 添加：

```yaml
"2026.09.20":
  image: /assets/images/news/lab-illustrations/tools-api.png
  alt: "Illustration: ANDFlow mascot sharing research ideas"
```

论文动态可在 `news_publication_media.yml` 添加：

```yaml
"2026.09.20":
  image: /assets/images/news/2026-09-20-paper-figure.jpg
  alt: "Author et al. — experimental design, Figure 1"
  source: https://doi.org/REPLACE_WITH_CONFIRMED_DOI
  image_source: https://example.org/original-figure
  license: https://creativecommons.org/licenses/by/4.0/
```

提供 image、alt、source；image_source 用于追溯，license 仅填已核实的真实许可。示例许可不代表新图片已获授权。日期和路径都是示例，文件必须真实存在。

YAML 的 image 写 `/assets/...`，不加 `/andlab-preview`，模板会拼接子路径。正文的本地图片使用 relative_url。注意 Linux 文件名大小写；新文件建议有意义的英文名称、合理尺寸和压缩。

原文第一条链接通常优先作为 Read source，因此 DOI/事件原始链接应放在辅助链接前。插图标注 Illustration，不能当作现场照片。

**当前显示限制：** 卡片通过 JS 提取纯文本、第一张图和一个来源链接，不保留所有富文本链接或播放原始 iframe。源文件中保留多图不等于访客可见完整图库。视频新闻应提供可点击来源链接并检查按钮；需要完整图库/视频/富文本详情时，应另行实现详情页。

首页 News 卡片按正文顺序匀速连续循环滑动，刷新后各行最新一条从画面中央开始。卡片进入视野约 3 秒后开始播放。访客可用手指横滑、鼠标拖动，或聚焦卡片区域后按键盘左右方向键浏览；停止触摸或拖动约 5 秒后自动继续滑动，键盘焦点停留在卡片区域时暂停。系统开启“减少动态效果”时不自动播放。

### 3.4 验收

1. 查看 diff：旧事件全文保留，新事件日期与 YAML 键相同，无重复键。
2. 检查新图片路径、alt、来源及许可。
3. 构建后核对两行新闻的分类、标题、正文、图片、来源按钮。
4. 在首页验证最新一条从中央开始，自动循环、触控横滑、鼠标拖动和键盘方向键均可浏览 News。
5. 检查窄屏、长标题、缺图与减少动态效果设置。
6. 循环播放会复制卡片，验收时不要把动画副本算成新增事件或重复数据。

## 4. 添加论文和 BibTeX

在 `_pages/publication.md` 对应年份的 `.publication-year` section 内添加一个段落，论文之间空一行：

```markdown
Author, A., & Author, B. (2026). **Exact article title**. *Journal Name*, volume, article number. [[DOI](https://doi.org/CONFIRMED_DOI){:target="_blank"}]
```

论文标题加粗，脚本据此生成标题。预印本放 Preprint；正式发表后检查是否应移动而非重复添加。新年份同时添加 section 的 `id="2027"`、`### 2027` 及侧栏 `href="#2027"`。保留 markdown 属性和闭合标签。

注意：**当前 BibTeX 按钮指向 `ANDlab-publications-Bibtex_2025_10_27.bib`，不是无日期主文件。** 正式发布前应确定唯一维护文件，并同步按钮。仅修改主文件不会改变当前访客下载内容。BibTeX、DOI、作者、发表状态均使用核实资料。

论文清单与首页论文新闻分开维护，需要卡片时另按第 3 节操作。

## 5. 成员与 Alumni

照片放 `assets/images/team/`，在 `_data/member.yml` 对应组的 members 数组新增：

```yaml
    - name: "Member Name"
      image: member-name.jpg
      content:
        - "First biography paragraph."
        - "Research interests and current work."
      social:
        email: member@example.org
        website: https://example.org/
        google-scholar: https://scholar.google.com/citations?user=EXAMPLE
        github: https://github.com/EXAMPLE
```

content 必须是段落数组，image 只写文件名。没有的社交字段省略，不填假链接。照片约 3:4，检查裁切主体。

Alumni 使用不同结构：在 `title: Alumni` 下选择 alumni_groups 中对应组的 members，新增 `- name: "Name (Affiliation)"`，有真实链接才加 social。离组时移动到正确分类，不擅自补职位、去向。

## 6. Open Science 与 Join Us

- 项目：编辑 science_projects.md，复制完整 article.science-project，更新编号、标题、简介、详情和链接。保留 `<details markdown="1">` 与 `<summary markdown="0">`。
- 资源：编辑 science_resources.md 有序列表，保留表示类型的 span。过滤器读其文本；现有 Code、Tool、Questionnaire、Talk、Course、Book、Workshop。
- 招聘：编辑 position.md 对应 section；未经要求不改申请邮箱、表格、锚点及条件。
- 地图：assets/amap.html 加载 SDK，assets/js/lab-map.js 定义坐标和地址。地图问题另行处理，不通过改坐标解决底图加载失败。

## 7. 路径、部署与回滚

模板内站内资源统一使用：

```liquid
{{ '/assets/files/ANDlab-DataSharing.docx' | relative_url }}
```

不硬编码开发机地址、正式域名或预览前缀。外部 DOI、GitHub 和 mailto 保持原链接。当前仍有旧硬编码路径，修复清单见审查文档。

开发与正式根路径使用空 baseurl。预览需要以下环境覆盖配置，例如创建 `_config.preview.yml`：

```yaml
url: "https://cogniand.com"
baseurl: "/andlab-preview"
```

```sh
bundle exec jekyll build --config _config.yml,_config.preview.yml --destination /tmp/andlab-preview-build
```

上述配置文件是**待按示例创建的文件**。独立输出避免与正在运行的开发 watcher 共用目录。正式发布使用正式 url 和空 baseurl，不直接覆盖正式配置为预览配置。发布包只含公开静态产物；检查 Jekyll exclude，避免源码维护文档、本机配置或凭据被复制到站点。

### 服务器预览现状

实际 Nginx 配置是 `/www/server/nginx/conf/nginx.conf`，以 alias 指向 `/opt/andlab-preview/`。不能误操作另一套 /etc/nginx 配置或 CogniAND 主站目录。

已配置旧页面 publication/team/resource/openproject/position 的 extensionless → .html 重定向。**新增 open-science 尚缺对应规则**；只访问 open-science.html 不能证明导航可用。后续应完善预览路由或采用兼容的目录型 permalink。

发布前备份旧目录，优先上传独立版本目录，验证产物后切换，记录源码 commit、配置与回滚位置。同步覆盖时需确认精确目标，不对主站或父目录使用删除同步。SSH 凭据不写进仓库、README 或命令示例。

已有旧版备份：`/opt/andlab-preview.backup-20260912-1930`。回滚恢复旧静态目录；如果修改过 Nginx，需恢复匹配配置并用实际运行的 Nginx 二进制检查语法。备份存在不等于回滚已演练。

### 正式发布

正式发布当前由 GitHub Pages 从 `main` 根目录自动构建。设计改动保存在 `zixin_design`，通过 PR 审核、检查后合并到 `main` 触发正式发布。合并后检查 Pages 构建状态与正式页面；仅推送设计分支不会更新正式站。当前没有自定义发布 workflow，不另建一套与原生发布冲突的流程。

每次发布从导航实际点击 Home、Publications、Team、Open Science、Join Us；验证手机菜单、搜索、筛选、图片、BibTeX、申请表、数据共享表、课程页。检查请求未跳到错误域名，附件响应不是主站 HTML。不能只检查 .html 返回 200。

## 8. 交给 AI 的任务模板

先让 AI 读取 AGENTS.md、本手册和审查文档：

```text
按 README 当前 News 格式添加消息：
日期：YYYY.MM.DD
分类意图：Lab Life / Publication
短标题：...
完整正文：...
图片文件：...（或无图）
图片说明、来源和许可：...
来源链接：...

只更新内容及对应标题/媒体，不修改布局，不删除旧事件。
验证当前自动分类结果；同日冲突或缺少事实时明确报告。
完成构建、核对新图片和链接，报告修改文件及验证结果。
此次仅准备本地修改，不推送或部署。
```

要发布时明确目标是服务器预览还是 GitHub 正式页面。AI 需区分本地已改、预览已部署和正式已发布。未来迁移内容模型时同步修改 README/AGENTS，不能让手册描述尚未实现的格式。

## 9. 来源与许可

网站源于 [research-lab-website](https://github.com/ericdaat/research-lab-website) 和 [Allan Lab 模板](https://www.allanlab.org/aboutwebsite.html)。保留 LICENSE 与署名。论文图、照片、视频可能有独立许可，代码开源不等于所有素材均可转载。
