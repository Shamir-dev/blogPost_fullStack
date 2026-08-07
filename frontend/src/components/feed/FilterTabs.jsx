// src/components/feed/FilterTabs.jsx
const tabs = [
  { label: '🔥 Popular', value: 'popular' },
  { label: 'All Time', value: 'recent' },
  { label: 'Recent', value: 'recent' },
  { label: 'Trending', value: 'trending' },
  { label: 'Following', value: 'following' },
]

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ label, value, disabled }) => (
        <button
          key={label}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          title={disabled ? 'Requires login — coming in a later phase' : undefined}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            disabled
              ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
              : active === value
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}