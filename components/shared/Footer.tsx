import Link from 'next/link'
import { Github, Twitter, Linkedin, Rss, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-narrow py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              techwrite<span className="text-primary">·</span>architect
            </span>
            <span className="hidden md:inline">|</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="text-secondary">●</span> ssl/tls
              </span>
              <span className="flex items-center gap-1">
                <span className="text-primary">●</span> plausible
              </span>
              <span className="flex items-center gap-1">
                <span className="text-secondary">●</span> ci/cd
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="RSS"
            >
              <Rss className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>© {currentYear} techwrite · v2.0.0</p>
        </div>
      </div>
    </footer>
  )
}