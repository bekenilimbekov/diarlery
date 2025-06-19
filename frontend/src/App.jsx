import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import Home from './pages/Home';
import EntryForm from './pages/EntryForm';
import EntryView from './pages/EntryView';
import EntryEdit from './pages/EntryEdit';
import Tags from './pages/Tags';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Login from './pages/Login';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent() {
  const { user, login } = useContext(UserContext);
  const [darkMode, setdarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : false;

  })
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => {
    setdarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;

    })
  };
  useEffect(() => {
    const themeclass = darkMode ? 'dark' : 'light';
    document.body.className = '';
    document.body.classList.add(themeclass);

    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [darkMode])

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      login(storedUser);
    }
  }, [login]);

  if (loading) return <LoadingScreen />;
  if (!user) return <Login />;

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'} fade-in`}>
      <aside className="sidebar">
        <h2>DIARY</h2>
        {/* <button onClick={toggleDarkMode} style={{ marginBottom: '1rem' }}>
          {darkMode ? '☀️ Светлая тема' : '🌙 Тёмная тема'}
        </button> */}
        <label class="theme-toggle">
          <input
            type="checkbox"
            onChange = {toggleDarkMode}
            checked={darkMode}
            id="theme-toggle"
            name="theme-toggle"
            // class="theme-toggle-checkbox"

          />
          <span class="slider"></span>
        </label>

        <nav>
          <ul>
            <li><Link to="/">Все записи</Link></li>
            <li><Link to="/form">Создать запись</Link></li>
            <li><Link to="/tags">Теги</Link></li>
            <li><Link to="/settings">Настройки</Link></li>
            <li><Link to="/logout">Выйти</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<EntryForm />} />
          <Route path="/view/:id" element={<EntryView />} />
          <Route path="/edit/:id" element={<EntryEdit />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/settings" element={<Settings theme={darkMode ? 'dark' : 'light'} toggleTheme={toggleDarkMode} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
