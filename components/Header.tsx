'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200/80">
      <div className="container-narrow py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link href="/" className="group">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
                <span className="text-gray-900">⌨️</span>
                <span className="text-gray-800">techwrite</span>
                <span className="text-vscode-blue text-2xl font-light">·</span>
                <span className="text-emerald text-2xl font-light">/</span>
                <span className="text-sm font-mono font-normal text-gray-500 pt-1">architect</span>
              </h1>
            </Link>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-gray-500">
              <span className="tag tag-vscode">SDLC</span>
              <span className="tag tag-emerald">DevOps</span>
              <span className="tag tag-gray">Analytics</span>
              <span className="tag tag-gray">Security</span>
              <span className="text-xs text-gray-400 ml-1">
                <i className="fas fa-shield-alt text-emerald mr-1" /> zero-trust
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-gray-400 text-xs">
              <i className="fas fa-rss text-vscode-blue mr-1" /> rss
            </span>
            <a href="#" className="text-vscode-blue hover:text-emerald transition-colors">
              <i className="fab fa-github text-lg" />
            </a>
            <a href="#" className="text-vscode-blue hover:text-emerald transition-colors">
              <i className="fab fa-twitter text-lg" />
            </a>
            <a href="#" className="text-vscode-blue hover:text-emerald transition-colors">
              <i className="fab fa-linkedin-in text-lg" />
            </a>
            <span className="w-px h-5 bg-gray-300 mx-1" />
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <i className="fas fa-circle text-emerald text-[6px]" /> 4.2k readers
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}