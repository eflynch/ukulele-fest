import { useState, useEffect, useRef } from 'react'
import festivalMap from './assets/festival map.png'
import toasterImage from './assets/toaster.png'
import CocktailChat from './CocktailChat'
import { lineupArtists } from './lineupData'

type Tab = 'lineup' | 'tickets' | 'camping' | 'sponsorship'

interface FlyingElement {
  id: number
  emoji: string
  isImage: boolean
  pointValue: number
  top: number
  left: number
  size: string
  color: string
  duration: number
  angle: number
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lineup')
  const [daysUntilFestival, setDaysUntilFestival] = useState(0)
  const [flyingElements, setFlyingElements] = useState<FlyingElement[]>([])
  const [points, setPoints] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [celebration, setCelebration] = useState(false)
  const [celebrationLevel, setCelebrationLevel] = useState(0) // 0 = none, 1 = 20pts, 2 = 50pts, 3 = 100pts, 4 = 500pts
  const [toasterPosition, setToasterPosition] = useState({ x: 25, y: 25 })
  const [chatOpen, setChatOpen] = useState(false)
  const pointsRef = useRef(points)

  // Keep ref in sync with points
  useEffect(() => {
    pointsRef.current = points
  }, [points])

  const handleElementClick = (elementId: number, pointValue: number) => {
    if (!gameStarted) {
      setGameStarted(true)
    }
    const newPoints = points + pointValue
    setPoints(newPoints)
    setFlyingElements(prev => prev.filter(el => el.id !== elementId))

    // Trigger celebration when first crossing 20 points
    if (points < 20 && newPoints >= 20) {
      setCelebrationLevel(1)
      setCelebration(true)
      setTimeout(() => setCelebration(false), 5000) // Show for 5 seconds
    }
    // Trigger MEGA celebration when first crossing 50 points
    else if (points < 50 && newPoints >= 50) {
      setCelebrationLevel(2)
      setCelebration(true)
      setTimeout(() => setCelebration(false), 5000) // Show for 5 seconds
    }
    // Trigger ULTIMATE celebration when first crossing 100 points
    else if (points < 100 && newPoints >= 100) {
      setCelebrationLevel(3)
      setCelebration(true)
      setTimeout(() => setCelebration(false), 5000) // Show for 5 seconds
    }
    // Trigger MAXIMUM celebration when first crossing 500 points
    else if (points < 500 && newPoints >= 500) {
      setCelebrationLevel(4)
      setCelebration(true)
      setTimeout(() => setCelebration(false), 5000) // Show for 5 seconds
    }
  }

  useEffect(() => {
    const calculateDays = () => {
      const festivalDate = new Date(2026, 1, 28) // Month is 0-indexed (1 = February)
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
      const regularElements = [
        { emoji: '🌴', isImage: false, pointValue: 1 },
        { emoji: '🎵', isImage: false, pointValue: 2 },
        { emoji: '🌺', isImage: false, pointValue: 3 },
        { emoji: '🌊', isImage: false, pointValue: 2 },
        { emoji: '☀️', isImage: false, pointValue: 3 },
        { emoji: toasterImage, isImage: true, pointValue: 10 }
      ]
      const toasterOnly = [
        { emoji: toasterImage, isImage: true, pointValue: 10 }
      ]

      // At 500+ points, everything becomes a toaster
      const elements = pointsRef.current >= 500 ? toasterOnly : regularElements
      const colors = ['#00ffff', '#ff00ff', '#ff6b9d', '#ffa500']

      // Create 5 elements if over 100 points, otherwise 1
      const numElements = pointsRef.current >= 100 ? 5 : 1

      for (let i = 0; i < numElements; i++) {
        const randomElement = elements[Math.floor(Math.random() * elements.length)]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        const randomAngle = Math.random() * 360 // Random angle in degrees
        const randomSize = Math.random() * 6 + 2 // 2-8rem (much more variation)
        const randomDuration = Math.random() * 4 + 5 // 5-9 seconds

        // Start from random edge of screen based on angle
        let randomTop, randomLeft
        if (randomAngle < 90) {
          // Start from left side
          randomLeft = -10
          randomTop = Math.random() * 100
        } else if (randomAngle < 180) {
          // Start from top
          randomTop = -10
          randomLeft = Math.random() * 100
        } else if (randomAngle < 270) {
          // Start from right side
          randomLeft = 110
          randomTop = Math.random() * 100
        } else {
          // Start from bottom
          randomTop = 110
          randomLeft = Math.random() * 100
        }

        const newElement: FlyingElement = {
          id: Date.now() + i * 100 + Math.floor(Math.random() * 100), // Integer IDs for CSS animations
          emoji: randomElement.emoji,
          isImage: randomElement.isImage,
          pointValue: randomElement.pointValue,
          top: randomTop,
          left: randomLeft,
          size: `${randomSize}rem`,
          color: randomColor,
          duration: randomDuration,
          angle: randomAngle
        }

        setFlyingElements(prev => [...prev, newElement])

        // Remove element after animation completes
        setTimeout(() => {
          setFlyingElements(prev => prev.filter(el => el.id !== newElement.id))
        }, randomDuration * 1000)
      }
    }

    // Trigger randomly between 1-3 seconds (much more frequent)
    let timeoutId: NodeJS.Timeout
    const scheduleNext = () => {
      const delay = Math.random() * 2000 + 1000 // 1-3 seconds
      timeoutId = setTimeout(() => {
        triggerRandomElements()
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => clearTimeout(timeoutId)
  }, [])

  // Collision detection for spinning guitar
  useEffect(() => {
    if (points < 50) return

    const checkCollisions = () => {
      const guitar = document.getElementById('spinning-guitar')
      if (!guitar) return

      const guitarRect = guitar.getBoundingClientRect()
      const guitarCenterX = guitarRect.left + guitarRect.width / 2
      const guitarCenterY = guitarRect.top + guitarRect.height / 2
      const guitarRadius = guitarRect.width / 2

      flyingElements.forEach((element) => {
        const elementDiv = document.querySelector(`[data-element-id="${element.id}"]`)
        if (!elementDiv) return

        const elementRect = elementDiv.getBoundingClientRect()
        const elementCenterX = elementRect.left + elementRect.width / 2
        const elementCenterY = elementRect.top + elementRect.height / 2
        const elementRadius = elementRect.width / 2

        // Calculate distance between centers
        const dx = guitarCenterX - elementCenterX
        const dy = guitarCenterY - elementCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Check if they're overlapping
        if (distance < guitarRadius + elementRadius) {
          handleElementClick(element.id, element.pointValue)
        }
      })

      requestAnimationFrame(checkCollisions)
    }

    const animationId = requestAnimationFrame(checkCollisions)
    return () => cancelAnimationFrame(animationId)
  }, [points, flyingElements])

  // Random movement for zooming toaster
  useEffect(() => {
    if (points < 100) return

    const scheduleNextMove = () => {
      const newX = Math.random() * 80 + 10 // 10-90%
      const newY = Math.random() * 80 + 10 // 10-90%
      setToasterPosition({ x: newX, y: newY })

      // Schedule next move with new random delay
      const delay = Math.random() * 1000 + 1000 // 1-2 seconds
      return setTimeout(scheduleNextMove, delay)
    }

    const timeout = scheduleNextMove()
    return () => clearTimeout(timeout)
  }, [points])

  // Collision detection for zooming toaster
  useEffect(() => {
    if (points < 100) return

    const checkCollisions = () => {
      const toaster = document.getElementById('zooming-toaster')
      if (!toaster) return

      const toasterRect = toaster.getBoundingClientRect()
      const toasterCenterX = toasterRect.left + toasterRect.width / 2
      const toasterCenterY = toasterRect.top + toasterRect.height / 2
      const toasterRadius = toasterRect.width / 2

      flyingElements.forEach((element) => {
        const elementDiv = document.querySelector(`[data-element-id="${element.id}"]`)
        if (!elementDiv) return

        const elementRect = elementDiv.getBoundingClientRect()
        const elementCenterX = elementRect.left + elementRect.width / 2
        const elementCenterY = elementRect.top + elementRect.height / 2
        const elementRadius = elementRect.width / 2

        // Calculate distance between centers
        const dx = toasterCenterX - elementCenterX
        const dy = toasterCenterY - elementCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Check if they're overlapping
        if (distance < toasterRadius + elementRadius) {
          handleElementClick(element.id, element.pointValue)
        }
      })

      requestAnimationFrame(checkCollisions)
    }

    const animationId = requestAnimationFrame(checkCollisions)
    return () => cancelAnimationFrame(animationId)
  }, [points, flyingElements])

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-800 to-orange-600 select-none"
      style={{
        cursor: points >= 500
          ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewport='0 0 64 64' style='font-size:56px;'><text y='56'>🍞</text></svg>") 32 32, auto`
          : points >= 20
          ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewport='0 0 64 64' style='font-size:56px;'><text y='56'>🎸</text></svg>") 32 32, auto`
          : 'auto'
      }}>
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
        {flyingElements.map((element) => {
          // Calculate end position based on angle (travel 200vw in the direction of the angle)
          const distance = 200 // viewport units
          const angleRad = (element.angle * Math.PI) / 180
          const endX = Math.cos(angleRad) * distance
          const endY = Math.sin(angleRad) * distance

          return (
            <div
              key={element.id}
              data-element-id={element.id}
              className="absolute opacity-60"
              onMouseDown={() => handleElementClick(element.id, element.pointValue)}
              style={{
                top: `${element.top}%`,
                left: `${element.left}%`,
                fontSize: element.isImage ? undefined : element.size,
                color: element.isImage ? undefined : element.color,
                textShadow: element.isImage ? undefined : `0 0 30px ${element.color}, 0 0 60px ${element.color}`,
                animation: `fly-${element.id} ${element.duration}s linear`,
                padding: points >= 20 ? '24px' : '12px',
                zIndex: 5
              }}>
              {element.isImage ? (
                <img
                  src={element.emoji}
                  alt="toaster"
                  style={{
                    width: element.size,
                    height: element.size,
                    filter: `drop-shadow(0 0 30px ${element.color}) drop-shadow(0 0 60px ${element.color})`
                  }}
                />
              ) : (
                element.emoji
              )}
              <style>{`
                @keyframes fly-${element.id} {
                  from {
                    transform: translate(0, 0);
                  }
                  to {
                    transform: translate(${endX}vw, ${endY}vh);
                  }
                }
              `}</style>
            </div>
          )
        })}


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
            <div className={`absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 ${celebrationLevel >= 2 ? 'animate-ping' : 'animate-pulse'} opacity-80`}></div>

            {/* Spinning elements */}
            <div className="absolute inset-0">
              {[...Array(celebrationLevel === 4 ? 200 : celebrationLevel === 3 ? 100 : celebrationLevel === 2 ? 50 : 20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-6xl animate-spin"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: celebrationLevel >= 2 ? `${Math.random() * 1 + 0.5}s` : `${Math.random() * 2 + 1}s`,
                    opacity: 0.7,
                    fontSize: celebrationLevel >= 2 ? `${Math.random() * 4 + 4}rem` : '3.75rem'
                  }}>
                  {celebrationLevel === 4 ? '🍞' : celebrationLevel === 3 ? ['🍞', '🎸', '⚡', '🌟', '💫'][Math.floor(Math.random() * 5)] : celebrationLevel === 2 ? ['🎸', '🎵', '⭐', '🔥', '💥'][Math.floor(Math.random() * 5)] : ['🌴', '🎵', '🌺', '🌊', '☀️'][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>

            {/* Center message */}
            <div className="relative z-10 text-center">
              <h2 className={`font-bold mb-8 ${celebrationLevel === 4 ? 'text-[16rem] animate-bounce' : celebrationLevel === 3 ? 'text-[14rem] animate-bounce' : celebrationLevel === 2 ? 'text-[12rem] animate-bounce' : 'text-9xl animate-pulse'}`}
                  style={{
                    textShadow: celebrationLevel === 4
                      ? `
                        0 0 50px #ffffff,
                        0 0 100px #ffffff,
                        0 0 150px #ffffff,
                        0 0 200px #ff6600,
                        0 0 250px #ff6600,
                        0 0 300px #ff6600,
                        20px 20px 0px #ff6600,
                        -20px -20px 0px #ffffff
                      `
                      : celebrationLevel === 3
                      ? `
                        0 0 40px #ffff00,
                        0 0 80px #ffff00,
                        0 0 120px #ffff00,
                        0 0 160px #ff0000,
                        0 0 200px #ff0000,
                        0 0 240px #ff0000,
                        15px 15px 0px #ff0000,
                        -15px -15px 0px #ffff00
                      `
                      : celebrationLevel === 2
                      ? `
                        0 0 30px #ff00ff,
                        0 0 60px #ff00ff,
                        0 0 90px #ff00ff,
                        0 0 120px #00ffff,
                        0 0 150px #00ffff,
                        0 0 180px #00ffff,
                        10px 10px 0px #00ffff,
                        -10px -10px 0px #ff00ff
                      `
                      : `
                        0 0 20px #ff00ff,
                        0 0 40px #ff00ff,
                        0 0 60px #ff00ff,
                        0 0 80px #00ffff,
                        0 0 100px #00ffff,
                        0 0 120px #00ffff,
                        5px 5px 0px #00ffff,
                        -5px -5px 0px #ff00ff
                      `,
                    background: celebrationLevel === 4
                      ? 'linear-gradient(45deg, #ffffff, #ff6600, #ffffff, #ff6600, #ffffff)'
                      : celebrationLevel === 3
                      ? 'linear-gradient(45deg, #ffff00, #ff0000, #ff00ff, #00ffff, #ffff00)'
                      : celebrationLevel === 2
                      ? 'linear-gradient(45deg, #ff0000, #ff00ff, #00ffff, #ffff00, #ff0000)'
                      : 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                {celebrationLevel === 4 ? 'TOASTPOCALYPSE!!!' : celebrationLevel === 3 ? 'INFINITE!!!' : celebrationLevel === 2 ? 'UNSTOPPABLE!!!' : 'LEGENDARY!!!'}
              </h2>
              <p className={`font-mono text-white font-bold ${celebrationLevel === 4 ? 'text-9xl' : celebrationLevel === 3 ? 'text-8xl' : celebrationLevel === 2 ? 'text-7xl' : 'text-5xl'}`}
                 style={{
                   textShadow: celebrationLevel === 4
                     ? '0 0 60px #ffffff, 0 0 120px #ff6600, 0 0 180px #ffffff'
                     : celebrationLevel === 3
                     ? '0 0 50px #ffff00, 0 0 100px #ff0000, 0 0 150px #ff00ff'
                     : celebrationLevel === 2
                     ? '0 0 40px #ff00ff, 0 0 80px #00ffff, 0 0 120px #ffff00'
                     : '0 0 30px #ff00ff, 0 0 60px #00ffff'
                 }}>
                {celebrationLevel === 4 ? '🍞🍞🍞 EVERYTHING IS TOAST! 🍞🍞🍞' : celebrationLevel === 3 ? '🍞⚡ TOAST MASTER SUPREME! ⚡🍞' : celebrationLevel === 2 ? '🔥🎸 ULTIMATE UKULELE GOD! 🎸🔥' : '🎉 YOU\'RE A UKULELE MASTER! 🎉'}
              </p>
            </div>
          </div>
        )}

        {/* Spinning Guitar/Toaster (appears at 50+ points) */}
        {points >= 50 && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}>
            <div
              id="spinning-guitar"
              className="animate-spin"
              style={{
                fontSize: '16rem',
                animationDuration: '2s',
                filter: points >= 500
                  ? 'drop-shadow(0 0 40px #ff6600) drop-shadow(0 0 80px #ffffff)'
                  : 'drop-shadow(0 0 40px #ffff00) drop-shadow(0 0 80px #ff00ff)'
              }}>
              {points >= 500 ? '🍞' : '🎸'}
            </div>
          </div>
        )}

        {/* Zooming Toaster (appears at 100+ points) */}
        {points >= 100 && (
          <div
            id="zooming-toaster"
            className="absolute pointer-events-none transition-all duration-1000 ease-in-out"
            style={{
              top: `${toasterPosition.y}%`,
              left: `${toasterPosition.x}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 11
            }}>
            <img
              src={toasterImage}
              alt="zooming toaster"
              style={{
                width: '20rem',
                height: '20rem',
                filter: 'drop-shadow(0 0 60px #ff0000) drop-shadow(0 0 120px #ffff00)'
              }}
            />
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

        {/* Palm tree silhouettes / Toasters at 500+ */}
        <div className={`absolute bottom-0 left-20 text-9xl opacity-40 ${points >= 500 ? 'text-orange-400' : 'text-cyan-400'}`} style={{ textShadow: points >= 500 ? '0 0 20px #ff6600' : '0 0 20px #00ffff' }}>
          {points >= 500 ? '🍞' : '🌴'}
        </div>
        <div className={`absolute bottom-0 right-32 text-9xl opacity-40 ${points >= 500 ? 'text-white' : 'text-pink-400'}`} style={{ textShadow: points >= 500 ? '0 0 20px #ffffff' : '0 0 20px #ff00ff' }}>
          {points >= 500 ? '🍞' : '🌴'}
        </div>
        <div className={`absolute top-40 left-40 text-7xl opacity-30 ${points >= 500 ? 'text-orange-400' : 'text-pink-400'} animate-spin`} style={{ textShadow: points >= 500 ? '0 0 20px #ff6600' : '0 0 20px #ff00ff', animationDuration: '25s' }}>
          {points >= 500 ? '🍞' : '🌴'}
        </div>
        <div className={`absolute top-60 right-60 text-6xl opacity-30 ${points >= 500 ? 'text-white' : 'text-cyan-400'} animate-spin`} style={{ textShadow: points >= 500 ? '0 0 20px #ffffff' : '0 0 20px #00ffff', animationDuration: '20s', animationDirection: 'reverse' }}>
          {points >= 500 ? '🍞' : '🌴'}
        </div>
        <div className={`absolute bottom-40 left-1/3 text-5xl opacity-25 ${points >= 500 ? 'text-orange-400' : 'text-pink-400'} animate-spin`} style={{ textShadow: points >= 500 ? '0 0 15px #ff6600' : '0 0 15px #ff00ff', animationDuration: '30s' }}>
          {points >= 500 ? '🍞' : '🌴'}
        </div>
        <div className={`absolute top-1/3 right-40 text-8xl opacity-35 ${points >= 500 ? 'text-white' : 'text-cyan-400'} animate-spin`} style={{ textShadow: points >= 500 ? '0 0 25px #ffffff' : '0 0 25px #00ffff', animationDuration: '18s', animationDirection: 'reverse' }}>
          {points >= 500 ? '🍞' : '🌴'}
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
                    LINEUP (order TBD)
                  </h2>
                  <div className="space-y-6 font-mono">
                    {lineupArtists.map((artist, index) => {
                      const isCyan = index % 2 === 0
                      return (
                        <div key={index} className={`border-l-4 ${isCyan ? 'border-cyan-400' : 'border-pink-400'} pl-4 py-2`}>
                          <h3 className={`text-2xl font-bold ${isCyan ? 'text-cyan-300' : 'text-pink-300'}`}>{artist.name}</h3>
                          <p className={isCyan ? 'text-pink-300' : 'text-cyan-300'}>{artist.description}</p>
                        </div>
                      )
                    })}
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

      {/* Cocktail Chat Button and Popup */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 shadow-2xl shadow-pink-500/30">
            <CocktailChat />
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 text-3xl shadow-lg shadow-pink-500/50 hover:scale-110 transition-transform flex items-center justify-center"
          title="An I Cocktail Recipe Generator"
        >
          {chatOpen ? '✕' : '🍹'}
        </button>
      </div>
    </div>
  )
}

export default App
