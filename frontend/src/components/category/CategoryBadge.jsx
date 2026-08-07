// src/components/category/CategoryBadge.jsx
const colorMap = {
  'AI & Innovation': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
  'Biology & Medicine': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  'Science & Tech': 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  'Philosophy': 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  'Physics & Maths': 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  'Career & Growth': 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
}

export default function CategoryBadge({ category }) {
  const classes = colorMap[category] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${classes}`}>
      {category}
    </span>
  )
}