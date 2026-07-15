'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -40% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <nav className="space-y-2">
      <div className="text-sm font-semibold text-muted-foreground mb-4">
        Table of Contents
      </div>
      <ul className="space-y-1">
        {headings.map((heading, index) => (
          <motion.li
            key={heading.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                'block text-sm transition-colors hover:text-primary',
                heading.level === 2 && 'pl-0',
                heading.level === 3 && 'pl-4',
                heading.level === 4 && 'pl-8',
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </a>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}