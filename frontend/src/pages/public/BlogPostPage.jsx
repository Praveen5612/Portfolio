import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { blogsApi } from '../../services/blogs.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { settings } = useSettings()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogsApi.getBySlug(slug).then(r => setPost(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!post) return <div className="min-h-screen flex items-center justify-center text-slate-400">Post not found. <Link to="/blog" className="text-blue-400 ml-2">Back to Blog</Link></div>

  return (
    <>
      <Helmet>
        <title>{`${post.meta_title || post.title} | ${settings.site_name || 'Portfolio'}`}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </Helmet>
      <section className="py-20">
        <div className="container-custom max-w-3xl">
          <Link to="/blog" className="btn-ghost mb-8 inline-flex">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.tags || []).map(t => <span key={t} className="badge-blue">{t}</span>)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-slate-500 text-sm mb-8 pb-8 border-b border-slate-700">
              <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>{post.views} views</span>
            </div>

            {post.thumbnail && (
              <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-slate-800">
                <img src={`${import.meta.env.VITE_API_URL}${post.thumbnail}`} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div
              className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.article>
        </div>
      </section>
    </>
  )
}
