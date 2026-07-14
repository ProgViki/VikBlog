import { compileMDX } from 'next-mdx-remote/rsc'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Mermaid } from '@/components/blog/Mermaid'
import { Callout } from '@/components/blog/Callout'


const components = {
  pre: ({ children }: { children: React.ReactNode }) => children,
  code: ({ className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  Mermaid,
  Callout,
}

export async function compileMDXContent(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        format: 'mdx',
      },
    },
  })

  return { content, frontmatter }
}

export function extractTOC(content: string) {
  const headings: { id: string; text: string; level: number }[] = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)$/)
    if (match) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      headings.push({ id, text, level })
    }
  }
  
  return headings
}