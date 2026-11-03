import { useEffect, useState } from 'react'
import { imgSrc, gifSrc, exName } from '../lib/exercises.js'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'

// Big autoplaying animation; tap toggles to the still frame. `compact` shrinks it (superset cards).
// Custom exercises have no media — the animation stays blank by design (issue #11).
// `minimizable` (workout view) adds a persistent minimize/expand control so the animation stops
// eating the screen; the chosen size is saved to settings and carries across exercises and
// future workouts (issue #12).
export default function Media({ ex, id, compact, minimizable }) {
  const gif = ex?.gif ? gifSrc(ex) : null
  const still = ex?.img ? imgSrc(ex) : null
  const [playing, setPlaying] = useState(true)
  // A media load can fail — offline, a CDN hiccup, an exercise the dataset has no files for.
  // The state belongs to the animation on screen, not to the component: a sheet is reused for
  // the next exercise, so a dead request would otherwise kill the media of everything opened
  // after it, and a paused frame would carry over.
  const [load, setLoad] = useState({ failed: false, tries: 0 })
  const gifSize = useStore(s => s.S.gifSize)
  const update = useStore(s => s.update)

  useEffect(() => { setPlaying(true); setLoad({ failed: false, tries: 0 }) }, [gif])

  if (!gif || load.failed) return null
  const mini = minimizable && gifSize === 'mini'
  const toggleSize = e => { e.stopPropagation(); update(s => { s.gifSize = mini ? 'full' : 'mini' }) }
  // One retry before the frame is dropped: what fails is usually the network, not the file.
  // The `key` remounts the image, which is what makes the browser ask for it again.
  const onError = () => (load.tries < 1
    ? setTimeout(() => setLoad(s => ({ failed: false, tries: s.tries + 1 })), 400)
    : setLoad({ failed: true, tries: 0 }))

  return (
    <div className={'exmedia' + (compact ? ' compact' : '') + (mini ? ' mini' : '')} id={id} onClick={() => setPlaying(p => !p)}>
      <img key={load.tries} decoding="async" src={playing ? gif : (still || gif)} alt={exName(ex)} onError={onError} />
      {minimizable && (
        <button className="giftoggle" onClick={toggleSize}>
          <Icon name={mini ? 'expand' : 'minimize'} />{mini ? t('Expand') : t('Minimize')}
        </button>
      )}
      {!mini && (
        <span className="gifhint">
          <Icon name={playing ? 'pause' : 'play'} />{playing ? t('tap to pause') : t('tap to play')}
        </span>
      )}
    </div>
  )
}

export function Thumb({ ex }) {
  const img = ex?.img ? imgSrc(ex) : null
  const [load, setLoad] = useState({ failed: false, tries: 0 })
  // Same reasoning as Media: a row can be reused for another exercise, and a broken thumbnail
  // must not stick to whatever the list shows next.
  useEffect(() => { setLoad({ failed: false, tries: 0 }) }, [img])
  if (!img || load.failed) return <div className="thumb thumb-x"><Icon name="dumbbell" /></div>
  const onError = () => (load.tries < 1
    ? setTimeout(() => setLoad(s => ({ failed: false, tries: s.tries + 1 })), 400)
    : setLoad({ failed: true, tries: 0 }))
  return <img key={load.tries} className="thumb" loading="lazy" decoding="async" src={img} alt="" onError={onError} />
}
