// src/data/dummyPosts.js
export const dummyPosts = [
  {
    id: 1,
    title: 'Understanding Large Language Models: From Transformer to Real-World Applications',
    excerpt: 'A deep dive into how LLMs work under the hood, the transformer architecture, training process, and their real-world use cases.',
    coverImage: 'https://picsum.photos/seed/llm/600/400',
    category: 'AI & Innovation',
    author: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/40?img=1', verified: true },
    date: 'May 28, 2024',
    readTime: '12 min read',
    likes: 542,
    comments: 38,
  },
  {
    id: 2,
    title: 'CRISPR Gene Editing: Revolutionizing Modern Medicine',
    excerpt: 'Exploring the science behind CRISPR, its breakthroughs, ethical considerations, and future potential in human health.',
    coverImage: 'https://picsum.photos/seed/crispr/600/400',
    category: 'Biology & Medicine',
    author: { name: 'Dr. Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=5', verified: true },
    date: 'May 27, 2024',
    readTime: '8 min read',
    likes: 321,
    comments: 21,
  },
  {
    id: 3,
    title: 'Freedom is the only factor that makes human different from other Animals',
    excerpt: 'A practical guide to orchestrating autonomous agents using LangChain and the OpenAI API.',
    coverImage: 'https://picsum.photos/seed/agents/600/400',
    category: 'AI & Innovation',
    author: { name: 'Junga Bahadur Rana', avatar: 'https://biographyverce.com/wp-content/uploads/2024/07/Jung-Bahadur-Rana.jpg', verified: false },
    date: 'May 26, 2024',
    readTime: '10 min read',
    likes: 289,
    comments: 15,
  },
]

export const categories = [
  { name: 'Science & Tech', count: 1200 },
  { name: 'AI & Innovation', count: 892 },
  { name: 'Philosophy', count: 523 },
  { name: 'Biology & Medicine', count: 430 },
  { name: 'Physics & Maths', count: 618 },
  { name: 'Career & Growth', count: 711 },
]