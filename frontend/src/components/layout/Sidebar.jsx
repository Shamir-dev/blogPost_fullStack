// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import * as Icons from 'lucide-react'
import {
  Home, Compass, Bookmark, FileText, PenSquare,
  Users, FolderOpen, Code2, Cpu, Lightbulb,
  FlaskConical, Sigma, TrendingUp,
} from 'lucide-react'
import { useCategories } from '../../hooks/useCategories.js'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/my-articles', label: 'My Articles', icon: FileText },
  { to: '/drafts', label: 'Drafts', icon: PenSquare },
  { to: '/following', label: 'Following', icon: Users },
  { to: '/collections', label: 'Collections', icon: FolderOpen },
]

// Fallback for the original categories, which were created before the icon field existed
const legacySlugIcons = {
  'science-tech': Code2,
  'ai-innovation': Cpu,
  'philosophy': Lightbulb,
  'biology-medicine': FlaskConical,
  'physics-maths': Sigma,
  'career-growth': TrendingUp,
}

function getCategoryIcon(category) {
  if (category.icon && Icons[category.icon]) return Icons[category.icon]
  if (legacySlugIcons[category.slug]) return legacySlugIcons[category.slug]
  return Code2
}

function linkClasses({ isActive }) {
  return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
  }`
}

export default function Sidebar({ isOpen, onClose }) {
  const { categories, loading } = useCategories()

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-20 lg:hidden" />
      )}

      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-30 shrink-0
          h-[calc(100vh-64px)] overflow-y-auto
          bg-white dark:bg-gray-950
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${isOpen
            ? 'translate-x-0 w-64 p-4'
            : '-translate-x-full lg:translate-x-0 w-64 lg:w-0 p-4 lg:p-0 lg:border-none lg:overflow-hidden'}
        `}
      >
        <div className="w-56">
          <nav className="space-y-1 mb-6">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClasses}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <p className="px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-600 mb-2">
            Categories
          </p>

          {loading ? (
            <div className="space-y-2 px-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <nav className="space-y-1">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat)
                return (
                  <NavLink key={cat.id} to={`/category/${cat.slug}`} className={linkClasses}>
                    <Icon size={18} />
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.post_count}</span>
                  </NavLink>
                )
              })}
            </nav>
          )}
        </div>
      </aside>
    </>
  )
}