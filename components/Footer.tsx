export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="container-narrow py-6 text-sm text-gray-400">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-500">
              techwrite<span className="text-vscode-blue">·</span>architect
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <i className="fas fa-shield-halved text-emerald" /> ssl/tls
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-chart-line text-vscode-blue" /> plausible
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-code-branch text-emerald" /> ci/cd
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-vscode-blue transition-colors">
              <i className="fab fa-github" />
            </a>
            <a href="#" className="text-gray-400 hover:text-vscode-blue transition-colors">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" className="text-gray-400 hover:text-vscode-blue transition-colors">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="#" className="text-gray-400 hover:text-vscode-blue transition-colors">
              <i className="fas fa-rss" />
            </a>
            <span className="text-xs text-gray-300">© {currentYear} · v1.4.2</span>
          </div>
        </div>
      </div>
    </footer>
  )
}