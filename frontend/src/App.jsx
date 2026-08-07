// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import PostView from './pages/PostView.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import WritePost from './pages/WritePost.jsx'
import MyArticles from './pages/MyArticles.jsx'
import Drafts from './pages/Drafts.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import Profile from './pages/Profile.jsx'
import SearchResults from './pages/SearchResults.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import Following from './pages/Following.jsx'
import Collections from './pages/Collections.jsx'
import CollectionDetail from './pages/CollectionDetail.jsx'
import Settings from './pages/Settings.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AdminRoute from './components/auth/AdminRoute.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:slug" element={<CategoryPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/write" element={<WritePost />} />
          <Route path="/edit/:id" element={<WritePost />} />
          <Route path="/my-articles" element={<MyArticles />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/following" element={<Following />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App