# Archive Content (MDX Draft)

`/archive` 라우트의 Fumadocs 전환을 대비한 MDX 콘텐츠 초안 디렉터리입니다.

## 구조

- `react/`
- `typescript/`
- `css/`
- `utilities/`
- `_template.mdx`: 신규 스니펫 작성 템플릿

## 메타데이터 규칙

frontmatter는 아래 필드를 사용합니다.

- `title`: 스니펫 제목
- `description`: 한 줄 설명
- `category`: `React | TypeScript | CSS | Utilities`
- `tags`: 문자열 배열
- `updatedAt`: `YYYY-MM-DD`

> 현재는 임시 Archive UI(`components/Archive`)와 별도로 관리됩니다.
> Fumadocs 도입 시 이 디렉터리를 콘텐츠 소스로 연결합니다.
