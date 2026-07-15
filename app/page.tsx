import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { SubscriptionCard } from '@/components/shared/SubscriptionCard'
import { PostList } from '@/components/blog/PostList'
import { getRecentPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = getRecentPosts(5)

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="container-narrow py-8">
          {/* Hero Section */}
          <section className="py-4 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="max-w-2xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-800">Senior software architect</span> — 
                deep dives into <span className="text-vscode-blue font-medium">distributed systems</span>, 
                <span className="text-emerald font-medium"> cloud-native</span> patterns, 
                and <span className="text-vscode-blue font-medium">secure</span> by design. 
                Production-grade write-ups for the pragmatic engineer.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <i className="far fa-clock text-vscode-blue" /> 12 min read avg
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <i className="fas fa-code text-emerald" /> go, rust, typescript
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <i className="fas fa-cloud text-vscode-blue" /> k8s, aws, azure
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs text-gray-600 flex items-center gap-2">
                <i className="fas fa-shield-halved text-emerald" /> 
                security audit · <span className="font-mono text-vscode-blue">v1.4.2</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs text-gray-600 flex items-center gap-2">
                <i className="fas fa-chart-line text-vscode-blue" /> 
                analytics · <span className="font-mono">6.2k page views (weekly)</span>
              </div>
            </div>
          </section>

          {/* Subscription Card */}
          <SubscriptionCard />

          {/* Post List */}
          <PostList posts={posts} />
        </div>
      </main>

      <Footer />
    </>
  )
}

// // app/page.tsx - Debug version
// import { Suspense } from 'react'

// export default function HomePage() {
//   return (
//     <div>
//       <h1>Testing imports...</h1>
//       <Suspense fallback={<div>Loading...</div>}>
//         {/* Test imports one by one */}
//       </Suspense>
//     </div>
//   )
// }