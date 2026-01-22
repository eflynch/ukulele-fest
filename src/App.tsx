import { useState, useEffect } from 'react'
import festivalMap from './assets/festival map.png'

type Tab = 'lineup' | 'tickets' | 'camping' | 'sponsorship'

interface FlyingElement {
  id: number
  emoji: string
  top: number
  size: string
  color: string
  duration: number
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lineup')
  const [daysUntilFestival, setDaysUntilFestival] = useState(0)
  const [flyingElements, setFlyingElements] = useState<FlyingElement[]>([])
  const [points, setPoints] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [celebration, setCelebration] = useState(false)

  const handleElementClick = (elementId: number) => {
    if (!gameStarted) {
      setGameStarted(true)
    }
    const newPoints = points + 1
    setPoints(newPoints)
    setFlyingElements(prev => prev.filter(el => el.id !== elementId))

    if (newPoints === 20) {
      setCelebration(true)
      setTimeout(() => setCelebration(false), 5000) // Show for 5 seconds
    }
  }

  useEffect(() => {
    const calculateDays = () => {
      const festivalDate = new Date('2026-02-28')
      const today = new Date()
      const diffTime = festivalDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysUntilFestival(diffDays)
    }

    calculateDays()
    // Update daily
    const interval = setInterval(calculateDays, 1000 * 60 * 60 * 24)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Random flying elements
    const triggerRandomElements = () => {
      const emojis = ['🌴', '🎵', '🌺', '🌊', '☀️']
      const colors = ['#00ffff', '#ff00ff', '#ff6b9d', '#ffa500']

      // Create two elements at once
      for (let i = 0; i < 2; i++) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        const randomTop = Math.random() * 80 + 10 // 10-90% from top
        const randomSize = Math.random() * 4 + 4 // 4-8rem
        const randomDuration = Math.random() * 3 + 5 // 5-8 seconds

        const newElement: FlyingElement = {
          id: Date.now() + i, // Add i to ensure unique IDs
          emoji: randomEmoji,
          top: randomTop,
          size: `${randomSize}rem`,
          color: randomColor,
          duration: randomDuration
        }

        setFlyingElements(prev => [...prev, newElement])

        // Remove element after animation completes
        setTimeout(() => {
          setFlyingElements(prev => prev.filter(el => el.id !== newElement.id))
        }, randomDuration * 1000)
      }
    }

    // Trigger randomly between 10-20 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 10000 + 10000 // 10-20 seconds
      return setTimeout(() => {
        triggerRandomElements()
        scheduleNext()
      }, delay)
    }

    const timeout = scheduleNext()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-800 to-orange-600 select-none">
      <div className="relative overflow-hidden">
        {/* Retro grid background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top'
          }}></div>
        </div>

        {/* Flying random elements */}
        {flyingElements.map((element) => (
          <div
            key={element.id}
            className="absolute opacity-60 cursor-pointer"
            onClick={() => handleElementClick(element.id)}
            style={{
              top: `${element.top}%`,
              left: '-10%',
              fontSize: element.size,
              color: element.color,
              textShadow: `0 0 30px ${element.color}, 0 0 60px ${element.color}`,
              animation: `slide-across ${element.duration}s linear`,
              zIndex: 5
            }}>
            {element.emoji}
          </div>
        ))}
        <style>{`
          @keyframes slide-across {
            from {
              transform: translateX(0) rotate(0deg);
            }
            to {
              transform: translateX(120vw) rotate(360deg);
            }
          }
        `}</style>

        {/* Points Counter */}
        {gameStarted && (
          <div className="absolute top-6 left-6 z-50 bg-purple-900/60 backdrop-blur-sm border-2 border-cyan-400 px-6 py-3 rounded pointer-events-none"
               style={{
                 boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(255, 0, 255, 0.2)'
               }}>
            <div className="text-cyan-300 font-mono text-2xl font-bold"
                 style={{
                   textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff'
                 }}>
              SCORE: <span className="text-pink-400" style={{ textShadow: '0 0 10px #ff6b9d, 0 0 20px #ff6b9d' }}>{points}</span>
            </div>
          </div>
        )}

        {/* Celebration Overlay */}
        {celebration && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Strobing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 animate-pulse opacity-80"></div>

            {/* Spinning elements */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-6xl animate-spin"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 2 + 1}s`,
                    opacity: 0.7
                  }}>
                  {['🌴', '🎵', '🌺', '🌊', '☀️'][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>

            {/* Center message */}
            <div className="relative z-10 text-center">
              <h2 className="text-9xl font-bold mb-8 animate-pulse"
                  style={{
                    textShadow: `
                      0 0 20px #ff00ff,
                      0 0 40px #ff00ff,
                      0 0 60px #ff00ff,
                      0 0 80px #00ffff,
                      0 0 100px #00ffff,
                      0 0 120px #00ffff,
                      5px 5px 0px #00ffff,
                      -5px -5px 0px #ff00ff
                    `,
                    background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                LEGENDARY!!!
              </h2>
              <p className="text-5xl font-mono text-white font-bold"
                 style={{
                   textShadow: '0 0 30px #ff00ff, 0 0 60px #00ffff'
                 }}>
                🎉 YOU'RE A UKULELE MASTER! 🎉
              </p>
            </div>
          </div>
        )}

        {/* Neon Ukulele */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2">
          {/* Ukulele body outline */}
          <div className="relative w-80 h-96">
            {/* Body shape */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-80 rounded-full border-4 border-cyan-400 opacity-60"
                 style={{
                   borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                   boxShadow: '0 0 30px #00ffff, inset 0 0 30px rgba(0, 255, 255, 0.2)'
                 }}>
            </div>

            {/* Sound hole (pulsing circle) */}
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-80"
                 style={{
                   background: 'radial-gradient(circle, #ff6b9d 0%, #ff006e 30%, transparent 70%)',
                   boxShadow: '0 0 60px #ff006e, 0 0 100px #ff006e'
                 }}>
              {/* Sound hole rings */}
              <div className="absolute inset-0 rounded-full border-4 border-pink-300 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Bridge */}
            <div className="absolute top-56 left-1/2 -translate-x-1/2 w-24 h-2 bg-pink-400 opacity-60"
                 style={{
                   boxShadow: '0 0 20px #ff00ff'
                 }}>
            </div>

            {/* Neck */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-16 h-64 bg-gradient-to-t from-cyan-400/40 to-cyan-400/20 border-2 border-cyan-400/60"
                 style={{
                   boxShadow: '0 0 20px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1)'
                 }}>
              {/* Frets */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="absolute w-full h-0.5 bg-pink-400/60"
                     style={{ top: `${20 + i * 15}%`, boxShadow: '0 0 5px #ff00ff' }}>
                </div>
              ))}
            </div>

            {/* Strings */}
            {[-6, -2, 2, 6].map((offset, i) => (
              <div key={i} className="absolute h-96 w-0.5 bg-gradient-to-b from-pink-300/80 to-cyan-300/80"
                   style={{
                     left: `calc(50% + ${offset * 2}px)`,
                     top: '-128px',
                     boxShadow: '0 0 10px #ff00ff',
                     opacity: 0.7
                   }}>
              </div>
            ))}

            {/* Headstock */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-20 h-12 bg-cyan-400/30 border-2 border-cyan-400/60"
                 style={{
                   clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                   boxShadow: '0 0 20px #00ffff'
                 }}>
            </div>
          </div>
        </div>

        {/* Palm tree silhouettes */}
        <div className="absolute bottom-0 left-20 text-9xl opacity-40 text-cyan-400" style={{ textShadow: '0 0 20px #00ffff' }}>
          🌴
        </div>
        <div className="absolute bottom-0 right-32 text-9xl opacity-40 text-pink-400" style={{ textShadow: '0 0 20px #ff00ff' }}>
          🌴
        </div>
        <div className="absolute top-40 left-40 text-7xl opacity-30 text-pink-400 animate-spin" style={{ textShadow: '0 0 20px #ff00ff', animationDuration: '25s' }}>
          🌴
        </div>
        <div className="absolute top-60 right-60 text-6xl opacity-30 text-cyan-400 animate-spin" style={{ textShadow: '0 0 20px #00ffff', animationDuration: '20s', animationDirection: 'reverse' }}>
          🌴
        </div>
        <div className="absolute bottom-40 left-1/3 text-5xl opacity-25 text-pink-400 animate-spin" style={{ textShadow: '0 0 15px #ff00ff', animationDuration: '30s' }}>
          🌴
        </div>
        <div className="absolute top-1/3 right-40 text-8xl opacity-35 text-cyan-400 animate-spin" style={{ textShadow: '0 0 25px #00ffff', animationDuration: '18s', animationDirection: 'reverse' }}>
          🌴
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-20 px-6 pointer-events-none">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-3xl text-pink-400 font-mono tracking-widest mb-2"
                 style={{
                   textShadow: '0 0 10px #ff6b9d, 0 0 20px #ff6b9d'
                 }}>
              ✧ THIRD ANNUAL • 2/28/2026 ✧
            </div>
            <h1 className="text-8xl font-bold mb-4 animate-pulse"
                style={{
                  textShadow: `
                    0 0 10px #ff00ff,
                    0 0 20px #ff00ff,
                    0 0 30px #ff00ff,
                    0 0 40px #ff6b9d,
                    0 0 70px #ff6b9d,
                    0 0 80px #ff6b9d,
                    0 0 100px #ff6b9d,
                    3px 3px 0px #00ffff,
                    -3px -3px 0px #ff00ff
                  `,
                  background: 'linear-gradient(45deg, #ff00ff, #ff6b9d, #00ffff, #ffa500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              PLAY THE GRAY AWAY
            </h1>
            <div className="text-5xl text-cyan-300 font-mono tracking-widest mb-6 animate-pulse"
                 style={{
                   textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff'
                 }}>
              ▲▲▲ {daysUntilFestival} DAYS UNTIL UKULELE FEST!!! ▲▲▲
            </div>
          </div>

          {/* Tabs */}
          <div className="w-full max-w-4xl mb-8 pointer-events-auto">
            <div className="flex gap-4 justify-center flex-wrap">
              {(['lineup', 'tickets', 'camping', 'sponsorship'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 font-mono text-lg uppercase tracking-wider transition-all duration-300 border-2 ${
                    activeTab === tab
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                      : 'border-pink-500/50 bg-pink-500/10 text-pink-300 hover:border-pink-400 hover:bg-pink-400/20'
                  }`}
                  style={{
                    textShadow: activeTab === tab ? '0 0 10px #00ffff' : '0 0 10px #ff6b9d',
                    boxShadow: activeTab === tab ? '0 0 20px #00ffff, inset 0 0 20px #00ffff' : '0 0 10px #ff00ff'
                  }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full max-w-4xl mb-20 pointer-events-auto">
            <div className="bg-purple-900/40 backdrop-blur-sm border-2 border-cyan-400/50 p-8 min-h-[400px]"
                 style={{
                   boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(255, 0, 255, 0.1)'
                 }}>
              {activeTab === 'lineup' && (
                <div className="text-cyan-300">
                  <h2 className="text-4xl font-bold mb-6 text-pink-300" style={{ textShadow: '0 0 10px #ff6b9d' }}>
                    LINEUP
                  </h2>
                  <div className="space-y-6 font-mono">
                    <div className="border-l-4 border-cyan-400 pl-4 py-2">
                      <h3 className="text-2xl font-bold text-cyan-300">Plastic Ukulele Band</h3>
                      <p className="text-pink-300">The host with the most</p>
                    </div>
                    <div className="border-l-4 border-pink-400 pl-4 py-2">
                      <h3 className="text-2xl font-bold text-pink-300">DJ Fitzulele</h3>
                      <p className="text-cyan-300">Innovative artist blending beats and ukes</p>
                    </div>
                    <div className="border-l-4 border-cyan-400 pl-4 py-2">
                      <h3 className="text-2xl font-bold text-cyan-300">Jarxist Margon</h3>
                      <p className="text-pink-300">Award-winning musicians and educators</p>
                    </div>
                    <div className="border-l-4 border-pink-400 pl-4 py-2">
                      <h3 className="text-2xl font-bold text-pink-300">More artists TBA</h3>
                      <p className="text-cyan-300">Stay tuned for more announcements!</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="text-cyan-300">
                  <h2 className="text-4xl font-bold mb-6 text-pink-300" style={{ textShadow: '0 0 10px #ff6b9d' }}>
                    TICKET INFO
                  </h2>
                  <div className="space-y-6 font-mono">
                    <div className="border-2 border-cyan-400/50 p-6 bg-cyan-400/10">
                      <h3 className="text-3xl font-bold text-cyan-300 mb-2">Full Festival Pass (day of only)</h3>
                      <p className="text-5xl font-bold text-pink-400 mb-4">$0</p>
                      <ul className="space-y-2 text-cyan-300">
                        <li>✓ Full access to festival grounds except for VIP area</li>
                        <li>✓ All performances, workshops, and exhibitions</li>
                        <li>✓ All festival swag</li>
                        <li>✓ Food trucks</li>
                        <li>✓ Drink tickets</li>
                      </ul>
                    </div>
                    <div className="border-2 border-pink-400/50 p-6 bg-pink-400/10">
                      <h3 className="text-3xl font-bold text-pink-300 mb-2">VIP Pass (sold out)</h3>
                      <p className="text-5xl font-bold text-cyan-400 mb-4">$0</p>
                      <ul className="space-y-2 text-pink-300">
                        <li>✓ All full festival pass perks</li>
                        <li>✓ Access to VIP lounge area</li>
                        <li>✓ Hang out with the stars knowing you are a VIP</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'camping' && (
                <div className="text-cyan-300">
                  <h2 className="text-4xl font-bold mb-6 text-pink-300" style={{ textShadow: '0 0 10px #ff6b9d' }}>
                    CAMPING
                  </h2>
                  <div className="space-y-6 font-mono">
                    <p className="text-xl text-cyan-300">
                      Extremely limited camping is available! Inquire in advance!
                    </p>

                    {/* Festival Map */}
                    <img
                      src={festivalMap}
                      alt="Festival Grounds Map"
                      className="w-full rounded border-2 border-pink-400/50"
                      style={{
                        boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
                      }}
                    />

                    <div className="space-y-4">
                      <div className="border-l-4 border-cyan-400 pl-4 py-2">
                        <h3 className="text-2xl font-bold text-cyan-300">Amenities</h3>
                        <ul className="mt-2 space-y-1 text-pink-300">
                          <li>• Hot showers</li>
                          <li>• Clean restrooms</li>
                          <li>• Water stations</li>
                          <li>• 24/7 security</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-pink-400 pl-4 py-2">
                        <h3 className="text-2xl font-bold text-pink-300">Night Jams</h3>
                        <p className="mt-2 text-cyan-300">
                          Join spontaneous jam sessions in the camping area after hours. Bring your uke!
                        </p>
                      </div>
                      <div className="border-l-4 border-cyan-400 pl-4 py-2">
                        <h3 className="text-2xl font-bold text-cyan-300">What to Bring</h3>
                        <ul className="mt-2 space-y-1 text-pink-300">
                          <li>• Tent & sleeping gear (optional)</li>
                          <li>• Sunscreen & hat</li>
                          <li>• Reusable water bottle</li>
                          <li>• Good vibes only!</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sponsorship' && (
                <div className="text-cyan-300">
                  <h2 className="text-4xl font-bold mb-6 text-pink-300" style={{ textShadow: '0 0 10px #ff6b9d' }}>
                    SPONSORSHIP
                  </h2>
                  <div className="space-y-6 font-mono">
                    <p className="text-xl text-cyan-300">
                      Help us make Play the Gray Away even more radical! Sponsorship opportunities available.
                    </p>
                    <div className="space-y-4">
                      <div className="border-2 border-pink-400/50 p-6 bg-pink-400/10">
                        <h3 className="text-2xl font-bold text-pink-300 mb-3">🌟 Koa</h3>
                        <p className="text-3xl font-bold text-cyan-400 mb-4">1 bottle of gin</p>
                        <ul className="space-y-2 text-cyan-300">
                          <li>• Main stage naming rights</li>
                          <li>• Logo on all promotional materials</li>
                          <li>• 20 VIP passes</li>
                          <li>• Vendor booth location</li>
                        </ul>
                      </div>
                      <div className="border-2 border-cyan-400/50 p-6 bg-cyan-400/10">
                        <h3 className="text-2xl font-bold text-cyan-300 mb-3">⭐ Mahogany</h3>
                        <p className="text-3xl font-bold text-pink-400 mb-4">monetary equivalent of 1 bottle of gin</p>
                        <ul className="space-y-2 text-pink-300">
                          <li>• Logo on website and social media</li>
                          <li>• 10 VIP passes</li>
                          <li>• Vendor booth location</li>
                        </ul>
                      </div>
                      <div className="border-2 border-pink-400/50 p-6 bg-pink-400/10">
                        <h3 className="text-2xl font-bold text-pink-300 mb-3">✨ Plastic</h3>
                        <p className="text-3xl font-bold text-cyan-400 mb-4">any money at all</p>
                        <ul className="space-y-2 text-cyan-300">
                          <li>• Logo on website</li>
                          <li>• 5 VIP passes</li>
                          <li>• Social media shoutouts</li>
                        </ul>
                      </div>
                      <p className="text-center text-xl text-pink-300 pt-4">
                        Contact: sponsors@playthegrayaway.org
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-40"
             style={{
               background: 'linear-gradient(to top, #00ffff, transparent)',
               boxShadow: '0 -20px 40px #00ffff'
             }}>
        </div>

        {/* Decorative elements - tropical geometric */}
        <div className="absolute top-20 left-20 w-40 h-40 border-4 border-pink-500 opacity-50 rotate-45"></div>
        <div className="absolute bottom-32 right-20 w-60 h-60 border-4 border-cyan-400 opacity-50 animate-spin" style={{ animationDuration: '15s' }}></div>
      </div>
    </div>
  )
}

export default App
