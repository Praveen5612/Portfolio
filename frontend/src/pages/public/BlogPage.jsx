import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { blogsApi } from '../../services/blogs.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'

export default function BlogPage() {
  const { settings } = useSettings()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogsApi.getAll().then(r => setPosts(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet><title>{`Blog | ${settings.site_name || 'Portfolio'}`}</title></Helmet>
      <section className="py-20">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="section-title">Blog</h1>
            <p className="section-subtitle">Thoughts on development, design, and technology</p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="card p-6 animate-pulse h-64 bg-slate-800/50" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog/${post.slug}`} className="card-hover group block h-full p-6">
                    {post.thumbnail && (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-700">
                        <img src={`${import.meta.env.VITE_API_URL}${post.thumbnail}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(post.tags || []).slice(0, 3).map(t => <span key={t} className="badge-blue text-xs">{t}</span>)}
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>{post.views} views</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
