# AND Lab maintenance instructions

Scope: this website repository. Read README.md before content edits; read docs/MAINTENANCE_REVIEW.md before release preparation. User instructions override these defaults.

## Source of truth

- News body: _pages/home.md; date-keyed titles and supplemental images: _data/news_* files.
- Members: _data/member.yml. content is an array; Alumni use alumni_groups.
- Publications: _pages/publication.md; inspect the actual BibTeX download target before updating citations.
- Projects/resources: _includes/science_projects.md and _includes/science_resources.md, reused by legacy pages.
- Recruitment: _pages/position.md.
- Do not maintain generated _site files or remote generated HTML as source.

## Content changes

Preserve existing full text, dates, links, names and images unless the user requests changes. Do not invent authors, DOI, publication status, biographies, recruitment conditions or licenses. Content-only tasks must not redesign components.

New News entries start with a standalone **YYYY.MM.DD** paragraph. Keep blank lines around entries and media. Existing date strings are exact YAML lookup keys; do not normalize only one side. Report same-day collisions rather than inventing dates. The current system has no explicit category field or unique News ID; verify keyword-based classification. Do not use the proposed future schema until implemented.

Use quoted YAML date keys, space indentation and descriptive alt text. Check case-sensitive image paths. Supplemental media paths begin /assets/, without preview prefixes. Do not label illustrative images as documentary photos. Cards currently retain only the first image and selected source link; flag requests requiring full galleries or video detail views.

## Implementation

Use relative_url for internal template links. Preserve anchors, Markdown-in-HTML attributes and legacy routes. Reuse shared typography, colors and gutters. Respect reduced-motion preferences and keyboard navigation. Do not add another page-specific override to solve a shared style issue without first checking the shared rule.

Never include SSH passwords, deployment tokens or private account secrets in source, docs, commits or logs. Browser map keys require appropriate domain restrictions; local console evidence must not be presented as a verified production diagnosis. Do not print credentials during diagnostics.

## Verification and release

For content changes run Jekyll build and git diff --check. For modified standalone JS run node --check and verify behavior in a browser. Review new dates, generated text, media and links. Do not invent test commands or claim unrun checks passed.

For releases validate root and /andlab-preview builds. Click actual extensionless navigation, mobile menu and downloads; checking only .html pages is insufficient. Report existing failures separately. Do not mix unrelated fixes into content updates.

Commits, pushes and deployments follow the user's supplied scope, including existing session authorization. When authorized, inspect the exact target, prepare artifacts, back up the previous release and verify live results. Never upload vendor/, .bundle/, credentials or maintenance documents as site assets. Do not alter other sites on the CogniAND server.

Final handoff: what changed, what was verified, known limitations, and whether changes are local, preview-published or production-published.
