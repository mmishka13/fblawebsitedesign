import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:8000/api'

function useDashboard(language) {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const url = `${API_BASE}/dashboard${language ? `?language=${encodeURIComponent(language)}` : ''}`
        const res = await fetch(url)
        if (!res.ok) return
        const json = await res.json()
        setData(json)
      } catch (err) {
        // swallow errors for now – keep demo resilient
      }
    }
    load()
  }, [language])

  return data
}

function useSessions(language) {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const params = language ? `?language=${encodeURIComponent(language)}` : ''
        const res = await fetch(`${API_BASE}/sessions${params}`)
        if (!res.ok) return
        const json = await res.json()
        setSessions(json)
      } catch {
        // ignore
      }
    }
    load()
  }, [language])

  return sessions
}

function useResources(language) {
  const [resources, setResources] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const params = language ? `?language=${encodeURIComponent(language)}` : ''
        const res = await fetch(`${API_BASE}/resources${params}`)
        if (!res.ok) return
        const json = await res.json()
        setResources(json)
      } catch {
        // ignore
      }
    }
    load()
  }, [language])

  return resources
}

function useAiTutor() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [tip, setTip] = useState('')
  const [busy, setBusy] = useState(false)

  async function send(language) {
    if (!message.trim() || busy) return
    setBusy(true)
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, message }),
      })
      if (!res.ok) return
      const json = await res.json()
      setReply(json.reply)
      setTip(json.tip)
    } finally {
      setBusy(false)
    }
  }

  return { message, setMessage, reply, tip, busy, send }
}

function ShellLayout() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="shell-nav" aria-label="Primary navigation">
        <button
          type="button"
          className="shell-logo"
          onClick={() => navigate('/')}
          aria-label="Go to home dashboard"
        >
          <span className="shell-logo-pill" aria-hidden="true">
            <span className="shell-logo-orbit" />
          </span>
          <span className="shell-logo-text">
            <span className="shell-logo-title">Language Learning Hub</span>
            <span className="shell-logo-subtitle">Students · 15–50 yrs · Global</span>
          </span>
        </button>

        <nav className="shell-nav-links" aria-label="Main sections">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `shell-nav-link ${isActive ? 'shell-nav-link-active' : ''}`
            }
          >
            <span className="shell-nav-link-indicator" aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `shell-nav-link ${isActive ? 'shell-nav-link-active' : ''}`
            }
          >
            <span className="shell-nav-link-indicator" aria-hidden="true" />
            <span>Calendar</span>
          </NavLink>
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `shell-nav-link ${isActive ? 'shell-nav-link-active' : ''}`
            }
          >
            <span className="shell-nav-link-indicator" aria-hidden="true" />
            <span>Resources</span>
          </NavLink>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              `shell-nav-link ${isActive ? 'shell-nav-link-active' : ''}`
            }
          >
            <span className="shell-nav-link-indicator" aria-hidden="true" />
            <span>Community</span>
          </NavLink>
        </nav>

        <div className="shell-nav-profile" aria-label="Demo student profile">
          <div className="shell-nav-avatar" aria-hidden="true">
            DM
          </div>
          <div className="shell-nav-profile-text">
            <span className="shell-nav-profile-name">Demo Student</span>
            <span className="shell-nav-profile-role">Beginner · Spanish &amp; Japanese</span>
          </div>
          <span className="shell-nav-pill">Streak · 5 days</span>
        </div>
      </header>

      <main id="main-content" className="shell-main">
        <div className="shell-main-inner">
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
          <p className="footer-note">
            Built for FBLA Website Design – demo data only. Replace videos and images with your own
            royalty-free media before competition.
          </p>
        </div>
      </main>
    </div>
  )
}

function HomeDashboard() {
  const [language, setLanguage] = useState('Spanish')
  const dashboard = useDashboard(language)
  const sessions = useSessions(language)
  const resources = useResources(language)
  const ai = useAiTutor()

  return (
    <>
      <section className="page-grid" aria-labelledby="dashboard-heading">
        <section className="hero-panel" aria-label="Live learning hero">
          <div className="hero-grid">
            <div>
              <div className="hero-kicker">
                <span className="hero-kicker-pill" aria-hidden="true" />
                <span>Live · AI · Pen Pals</span>
              </div>
              <h1 id="dashboard-heading" className="hero-title">
                <span>Language Lab</span>{' '}
                <span className="hero-title-underline">Orbit</span>
              </h1>
              <p className="hero-subtitle">
                A cream-and-copper cockpit where students from 15–50 hop into live sessions, AI
                chats, and pronunciation labs that feel like a sci‑fi study lounge instead of
                homework.
              </p>
              <div className="hero-cta-row">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => document.getElementById('calendar-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>Join a live session</span>
                  <span aria-hidden="true">↗</span>
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => document.getElementById('ai-tutor')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="btn-ghost-icon" aria-hidden="true">
                    ◎
                  </span>
                  <span>Start AI warm‑up</span>
                </button>
              </div>
              <div className="hero-meta-row" aria-label="Quick stats">
                <div className="hero-meta-pill">
                  <span className="hero-meta-dot" aria-hidden="true" />
                  <span>Students online · 128</span>
                </div>
                <div className="hero-meta-pill">
                  <span className="hero-meta-dot" aria-hidden="true" />
                  <span>Languages in orbit · 6</span>
                </div>
              </div>
            </div>

            <div className="hero-video-shell" aria-label="Preview of learners in live sessions">
              <video
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Short loop of students collaborating in an online class"
              >
                <source
                  src="https://videos.pexels.com/video-files/7972720/7972720-uhd_2560_1440_25fps.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="hero-video-overlay" aria-hidden="true" />
              <div className="hero-video-caption">
                <div>
                  <strong>Live Study Gallery</strong>
                  <div>Clips of real students in virtual classrooms keep the hub feeling alive.</div>
                </div>
                <div className="hero-video-tags" aria-label="Video tags">
                  <span className="hero-video-tag">Teens &amp; adults</span>
                  <span className="hero-video-tag">Cameras on</span>
                  <span className="hero-video-tag">Real voices</span>
                </div>
                <div className="hero-video-badge">
                  <span className="hero-video-dot" aria-hidden="true" />
                  <span>Replace this with your own approved stock footage.</span>
                </div>
              </div>
              <div
                className="hero-gallery-rail"
                aria-label="Horizontal gallery of live learning modes"
                role="list"
              >
                <button className="gallery-pill gallery-pill-kids" type="button" role="listitem">
                  <span className="gallery-pill-label">High school collab pods</span>
                  <span className="gallery-pill-dot" aria-hidden="true" />
                </button>
                <button className="gallery-pill" type="button" role="listitem">
                  <span className="gallery-pill-label">Adult night sessions</span>
                  <span className="gallery-pill-dot" aria-hidden="true" />
                </button>
                <button
                  className="gallery-pill gallery-pill-focus"
                  type="button"
                  role="listitem"
                >
                  <span className="gallery-pill-label">Silent focus rooms</span>
                  <span className="gallery-pill-dot" aria-hidden="true" />
                </button>
                <button className="gallery-pill" type="button" role="listitem">
                  <span className="gallery-pill-label">Pronunciation labs</span>
                  <span className="gallery-pill-dot" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="metrics-row" aria-label="Progress metrics overview">
            <MetricCard
              label="Lessons"
              value={dashboard?.progress?.lessons_completed ?? 0}
              chip="Completed"
            />
            <MetricCard
              label="Quizzes"
              value={dashboard?.progress?.quizzes_completed ?? 0}
              chip="Finished"
            />
            <MetricCard
              label="Words"
              value={dashboard?.progress?.vocabulary_learned ?? 0}
              chip="Learned"
            />
            <MetricCard
              label="Streak"
              value={dashboard?.progress?.activity_streak ?? 0}
              chip="Days active"
            />
          </div>
        </section>

        <aside className="side-panel" aria-label="Language and streak overview">
          <header className="side-header">
            <div>
              <div className="side-subtitle">Your orbit</div>
              <h2 className="side-title">Language focus</h2>
            </div>
            <span className="side-badge">15–50 yrs · friendly</span>
          </header>

          <div className="side-list" role="radiogroup" aria-label="Choose active language dashboard">
            {['Spanish', 'French', 'Hindi', 'Japanese', 'Korean', 'German'].map(lang => (
              <button
                key={lang}
                type="button"
                role="radio"
                aria-checked={language === lang}
                className="side-row"
                onClick={() => setLanguage(lang)}
              >
                <div className="side-row-main">
                  <div className="side-row-label">{lang}</div>
                  <div className="side-row-meta">
                    {lang === 'Spanish'
                      ? 'Travel phrases, café conversations, music lyrics.'
                      : lang === 'Japanese'
                        ? 'Anime lines, hiragana speed runs, intro chats.'
                        : 'Demo copy – customize per language.'}
                  </div>
                </div>
                <span className="side-row-tag">
                  {language === lang ? 'Active' : 'Preview'}
                </span>
              </button>
            ))}
          </div>

          <hr className="side-divider" />

          <footer className="side-footer">
            <div className="side-progress-bar" aria-hidden="true">
              <div className="side-progress-inner" />
            </div>
            <span className="side-pill">Weekly goal · 62%</span>
          </footer>
        </aside>
      </section>

      <section
        id="ai-tutor"
        className="tabbed-section"
        aria-label="AI tutor and pronunciation studio"
      >
        <header className="tabbed-header">
          <div>
            <div className="tabbed-title">Interactive Studio</div>
            <div className="side-subtitle">AI practice &amp; pronunciation lab</div>
          </div>
          <div className="tab-list" role="tablist" aria-label="Studio modes">
            <button
              type="button"
              className="tab-pill tab-pill-active"
              role="tab"
              aria-selected="true"
            >
              AI tutor
            </button>
            <button type="button" className="tab-pill" role="tab" aria-selected="false">
              Pronunciation
            </button>
          </div>
        </header>

        <div className="tab-panel">
          <div className="tab-panel-row">
            <section className="ai-chat-card" aria-label="AI conversation practice">
              <div className="ai-chat-badge">Demo AI · Text only</div>
              <p className="ai-response">
                Ask the AI to role‑play a barista, passport officer, homestay host, or anime
                character. In the full build, this would connect to a real language model.
              </p>
              <div className="ai-chat-input-row">
                <label className="visually-hidden" htmlFor="ai-message">
                  Message for AI tutor
                </label>
                <input
                  id="ai-message"
                  className="ai-input"
                  placeholder="Type a phrase you want to practice…"
                  value={ai.message}
                  onChange={e => ai.setMessage(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => ai.send(language)}
                  disabled={ai.busy}
                >
                  <span>{ai.busy ? 'Sending…' : 'Ask AI'}</span>
                </button>
              </div>
              {ai.reply && (
                <div className="ai-response" aria-live="polite">
                  <strong>AI reply:</strong> {ai.reply}
                  <br />
                  <strong>Tip:</strong> {ai.tip}
                </div>
              )}
            </section>

            <section className="pronunciation-card" aria-label="Pronunciation studio preview">
              <p>
                This panel sketches a pronunciation studio where students record, compare, and get
                tips on tricky sounds – scoped for a future phase of your MVP.
              </p>
              <div className="pronunciation-grid">
                <div className="pronunciation-pill">
                  <div className="pronunciation-pill-title">Repeat after me</div>
                  <div className="pronunciation-pill-meta">
                    Native audio plays, then the hub waits for your version with big, friendly
                    controls sized for touch.
                  </div>
                </div>
                <div className="pronunciation-pill">
                  <div className="pronunciation-pill-title">Phonetic x‑ray</div>
                  <div className="pronunciation-pill-meta">
                    Each word comes with syllable breakdowns and notes like “soft D” or “nasal
                    vowel.”
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        id="calendar-section"
        className="scroll-section"
        aria-label="Upcoming sessions and recommended resources"
      >
        <header className="scroll-header">
          <div className="scroll-title-block">
            <div className="scroll-kicker">Live schedule</div>
            <h2 className="scroll-title">
              Sessions <span className="scroll-accent">in orbit</span>
            </h2>
          </div>
          <div className="scroll-controls" aria-hidden="true">
            <span className="scroll-dot" />
            <span className="scroll-dot" />
            <span className="scroll-dot" />
          </div>
        </header>
        <div className="scroll-track" aria-hidden="true">
          <div className="scroll-track-inner" />
        </div>
        <div className="calendar-section">
          <section className="calendar-card" aria-label="Upcoming tutoring sessions">
            <div className="calendar-header">
              <div>
                <div className="side-subtitle">Today · Demo data</div>
                <h3 className="side-title">Upcoming sessions</h3>
              </div>
              <div className="calendar-pills" aria-hidden="true">
                <span className="calendar-pill">Weekly</span>
                <span className="calendar-pill">Monthly</span>
                <span className="calendar-pill">List</span>
              </div>
            </div>
            <div className="calendar-scroll">
              {sessions.map(session => (
                <article
                  key={session.id}
                  className="session-row"
                  aria-label={`${session.title} with ${session.tutor_name}`}
                >
                  <div className="session-main">
                    <h4 className="session-title">{session.title}</h4>
                    <div className="session-meta">
                      {session.session_type} · {session.language} · {session.difficulty}
                    </div>
                    <div className="session-tags">Tutor · {session.tutor_name}</div>
                  </div>
                  <div className="session-cta">
                    <div className="session-time">
                      {session.date} · {session.start_time}–{session.end_time}
                    </div>
                    <button
                      type="button"
                      className="session-button session-button-primary"
                    >
                      Join / waitlist
                    </button>
                  </div>
                </article>
              ))}
              {sessions.length === 0 && (
                <p>
                  No demo sessions loaded yet. The backend seeds Spanish and Japanese sessions on
                  first run.
                </p>
              )}
            </div>
          </section>

          <section className="resources-card" aria-label="Recommended resources">
            <div className="calendar-header">
              <div>
                <div className="side-subtitle">Library spotlight</div>
                <h3 className="side-title">Recommended for you</h3>
              </div>
            </div>
            <div className="resources-scroll">
              {resources.map(resource => (
                <article
                  key={resource.id}
                  className="resource-row"
                  aria-label={resource.title}
                >
                  <div className="resource-main">
                    <h4 className="resource-title">{resource.title}</h4>
                    <div className="resource-meta">
                      {resource.language} · {resource.difficulty} · {resource.category}
                    </div>
                    <div className="resource-tags">Topic · demo only</div>
                  </div>
                  <div className="resource-link">
                    {resource.url ? (
                      <a href={resource.url} target="_blank" rel="noreferrer">
                        Open resource ↗
                      </a>
                    ) : (
                      <span>Upload your own PDF or video here.</span>
                    )}
                  </div>
                </article>
              ))}
              {resources.length === 0 && (
                <p>No demo resources yet. The backend seeds a Spanish and a Japanese resource.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </>
  )
}

function CalendarPage() {
  const sessions = useSessions()

  return (
    <section aria-labelledby="calendar-page-heading">
      <header>
        <p className="side-subtitle">All live events</p>
        <h1 id="calendar-page-heading" className="side-title">
          Tutoring calendar
        </h1>
      </header>
      <p className="hero-subtitle">
        Weekly, monthly, and list views let students find conversation practice, grammar labs, and
        cultural exchanges that match their time zone.
      </p>
      <div className="calendar-scroll" style={{ marginTop: '1rem', maxHeight: 'none' }}>
        {sessions.map(session => (
          <article
            key={session.id}
            className="session-row"
            aria-label={`${session.title} with ${session.tutor_name}`}
          >
            <div className="session-main">
              <h2 className="session-title">{session.title}</h2>
              <div className="session-meta">
                {session.session_type} · {session.language} · {session.difficulty}
              </div>
              <div className="session-tags">Tutor · {session.tutor_name}</div>
            </div>
            <div className="session-cta">
              <div className="session-time">
                {session.date} · {session.start_time}–{session.end_time}
              </div>
              <button type="button" className="session-button session-button-primary">
                Join / waitlist
              </button>
            </div>
          </article>
        ))}
        {sessions.length === 0 && <p>No sessions found.</p>}
      </div>
    </section>
  )
}

function ResourcesPage() {
  const resources = useResources()

  return (
    <section aria-labelledby="resources-page-heading">
      <header>
        <p className="side-subtitle">Resource library</p>
        <h1 id="resources-page-heading" className="side-title">
          Study materials
        </h1>
      </header>
      <p className="hero-subtitle">
        Lessons, videos, quizzes, and PDFs live here. Students can filter by language, difficulty,
        and topic as your MVP grows.
      </p>
      <div className="resources-scroll" style={{ marginTop: '1rem', maxHeight: 'none' }}>
        {resources.map(resource => (
          <article
            key={resource.id}
            className="resource-row"
            aria-label={resource.title}
          >
            <div className="resource-main">
              <h2 className="resource-title">{resource.title}</h2>
              <div className="resource-meta">
                {resource.language} · {resource.difficulty} · {resource.category}
              </div>
              <div className="resource-tags">Topic · demo only</div>
            </div>
            <div className="resource-link">
              {resource.url ? (
                <a href={resource.url} target="_blank" rel="noreferrer">
                  Open resource ↗
                </a>
              ) : (
                <span>Upload your own resource file.</span>
              )}
            </div>
          </article>
        ))}
        {resources.length === 0 && <p>No resources found.</p>}
      </div>
    </section>
  )
}

function CommunityPage() {
  return (
    <section aria-labelledby="community-page-heading">
      <header>
        <p className="side-subtitle">Pen pals &amp; forums</p>
        <h1 id="community-page-heading" className="side-title">
          Community hub
        </h1>
      </header>
      <p className="hero-subtitle">
        This page is reserved for your pen pal matching system and language forums. The visual
        framing already supports threads, messages, and profile cards while keeping the interface
        simple for screen readers.
      </p>
      <div className="scroll-cards" style={{ marginTop: '1.1rem' }}>
        <article className="hover-card" aria-label="Pen pal matching">
          <div className="hover-card-header">
            <h2 className="hover-card-title">Pen pal radar</h2>
            <span className="hover-card-chip">Exchange partners</span>
          </div>
          <p className="hover-card-body">
            Match students by native/target language, interests, and time zone. Each card can link
            to a private, safe message thread – great for both shy beginners and confident speakers.
          </p>
          <div className="hover-card-footer">
            <span className="hover-card-level">Mocked · design only</span>
            <span className="hover-card-time">
              <span className="pill-dot" aria-hidden="true" /> Ready for future build
            </span>
          </div>
        </article>
        <article className="hover-card" aria-label="Discussion forums">
          <div className="hover-card-header">
            <h2 className="hover-card-title">Grammar help board</h2>
            <span className="hover-card-chip">Q&amp;A threads</span>
          </div>
          <p className="hover-card-body">
            Students post questions, vote on helpful answers, and mark “best explanations.” Categories
            for French, Spanish, Japanese, and more keep things organized.
          </p>
          <div className="hover-card-footer">
            <span className="hover-card-level">Mocked · design only</span>
            <span className="hover-card-time">
              <span className="pill-dot" aria-hidden="true" /> WCAG-friendly layout
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}

function MetricCard({ label, value, chip }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-chip">{chip}</div>
    </div>
  )
}

function App() {
  return <ShellLayout />
}

export default App
