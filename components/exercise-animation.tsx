'use client'

interface Props {
  animationKey: string
  size?: number
}

const DIM = 'var(--gt-text-dim)'
const LIME = 'var(--gt-lime)'
const SW = 3

export function ExerciseAnimation({ animationKey, size = 140 }: Props) {
  switch (animationKey) {
    case 'floor-press':
      return (
        <svg width={size} height={size * (120 / 100)} viewBox="0 0 100 120" fill="none">
          {/* Ground */}
          <line x1="5" y1="95" x2="95" y2="95" stroke={DIM} strokeWidth={1.5} strokeLinecap="round" />
          {/* Head */}
          <circle cx="18" cy="80" r="6" stroke={DIM} strokeWidth={SW} />
          {/* Torso */}
          <line x1="24" y1="80" x2="75" y2="80" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Legs */}
          <line x1="75" y1="80" x2="90" y2="90" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="75" y1="80" x2="85" y2="86" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Upper arms (static, dim) */}
          <line x1="40" y1="80" x2="40" y2="62" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="55" y1="80" x2="55" y2="62" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Animated forearms + bar */}
          <g className="ex-anim" style={{ transformOrigin: '40px 62px', animation: 'ex-press 1.8s ease-in-out infinite alternate' }}>
            <line x1="40" y1="62" x2="40" y2="45" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          <g className="ex-anim" style={{ transformOrigin: '55px 62px', animation: 'ex-press 1.8s ease-in-out infinite alternate' }}>
            <line x1="55" y1="62" x2="55" y2="45" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          <g className="ex-anim" style={{ transformOrigin: '47px 45px', animation: 'ex-press 1.8s ease-in-out infinite alternate' }}>
            <line x1="35" y1="45" x2="60" y2="45" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'barbell-row':
      return (
        <svg width={size} height={size * (120 / 100)} viewBox="0 0 100 120" fill="none">
          {/* Ground */}
          <line x1="5" y1="112" x2="95" y2="112" stroke={DIM} strokeWidth={1.5} strokeLinecap="round" />
          {/* Head */}
          <circle cx="30" cy="30" r="6" stroke={DIM} strokeWidth={SW} />
          {/* Torso (bent ~45°) */}
          <line x1="30" y1="36" x2="72" y2="68" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Legs */}
          <line x1="72" y1="68" x2="78" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="72" y1="68" x2="65" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Static upper arm dim */}
          <line x1="50" y1="50" x2="54" y2="65" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Animated forearm */}
          <g className="ex-anim" style={{ transformOrigin: '50px 50px', animation: 'ex-row 1.8s ease-in-out infinite alternate' }}>
            <line x1="50" y1="50" x2="55" y2="90" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            {/* Bar */}
            <line x1="45" y1="90" x2="65" y2="90" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'overhead-press':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Head */}
          <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
          {/* Torso */}
          <line x1="50" y1="22" x2="50" y2="70" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Legs */}
          <line x1="50" y1="70" x2="43" y2="110" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="43" y1="110" x2="40" y2="140" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="70" x2="57" y2="110" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="57" y1="110" x2="60" y2="140" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Static upper arms (dim) */}
          <line x1="50" y1="28" x2="33" y2="45" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="28" x2="67" y2="45" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Static bar at shoulder (dim) */}
          <line x1="26" y1="45" x2="74" y2="45" stroke={DIM} strokeWidth={SW + 1} strokeLinecap="round" />
          {/* Animated forearms + bar above */}
          <g className="ex-anim" style={{ animation: 'ex-ohpress 1.8s ease-in-out infinite alternate' }}>
            <line x1="33" y1="45" x2="33" y2="20" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="67" y1="45" x2="67" y2="20" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="26" y1="20" x2="74" y2="20" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'bicep-curl':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Head */}
          <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
          {/* Torso */}
          <line x1="50" y1="22" x2="50" y2="72" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Legs */}
          <line x1="50" y1="72" x2="43" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="43" y1="112" x2="40" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="72" x2="57" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="57" y1="112" x2="60" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Upper arms (static, dim) */}
          <line x1="50" y1="30" x2="33" y2="55" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="30" x2="67" y2="55" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Left forearm animated */}
          <g className="ex-anim" style={{ transformOrigin: '33px 55px', animation: 'ex-curl-l 1.8s ease-in-out infinite alternate' }}>
            <line x1="33" y1="55" x2="25" y2="78" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          {/* Right forearm animated */}
          <g className="ex-anim" style={{ transformOrigin: '67px 55px', animation: 'ex-curl-r 1.8s ease-in-out infinite alternate' }}>
            <line x1="67" y1="55" x2="75" y2="78" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          {/* Bar */}
          <g className="ex-anim" style={{ transformOrigin: '50px 78px', animation: 'ex-curl-l 1.8s ease-in-out infinite alternate' }}>
            <line x1="22" y1="78" x2="78" y2="78" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'tricep-extension':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Head */}
          <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
          {/* Torso */}
          <line x1="50" y1="22" x2="50" y2="72" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Legs */}
          <line x1="50" y1="72" x2="43" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="43" y1="112" x2="40" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="72" x2="57" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="57" y1="112" x2="60" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Upper arms raised above head (static, dim) */}
          <line x1="50" y1="28" x2="38" y2="15" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="28" x2="62" y2="15" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Animated forearms (elbows at ~y15, forearms bend behind head) */}
          <g className="ex-anim" style={{ transformOrigin: '38px 15px', animation: 'ex-tricep 1.8s ease-in-out infinite alternate' }}>
            <line x1="38" y1="15" x2="30" y2="35" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          <g className="ex-anim" style={{ transformOrigin: '62px 15px', animation: 'ex-tricep 1.8s ease-in-out infinite alternate' }}>
            <line x1="62" y1="15" x2="70" y2="35" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          {/* Weight */}
          <g className="ex-anim" style={{ transformOrigin: '50px 35px', animation: 'ex-tricep 1.8s ease-in-out infinite alternate' }}>
            <line x1="26" y1="35" x2="74" y2="35" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'lateral-raise':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Head */}
          <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
          {/* Torso */}
          <line x1="50" y1="22" x2="50" y2="72" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Legs */}
          <line x1="50" y1="72" x2="43" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="43" y1="112" x2="40" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="72" x2="57" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="57" y1="112" x2="60" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Left arm (whole arm animated) */}
          <g className="ex-anim" style={{ transformOrigin: '42px 32px', animation: 'ex-lateral-l 2s ease-in-out infinite alternate' }}>
            <line x1="42" y1="32" x2="28" y2="55" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="28" y1="55" x2="20" y2="75" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          {/* Right arm (whole arm animated) */}
          <g className="ex-anim" style={{ transformOrigin: '58px 32px', animation: 'ex-lateral-r 2s ease-in-out infinite alternate' }}>
            <line x1="58" y1="32" x2="72" y2="55" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="72" y1="55" x2="80" y2="75" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'squat':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Head (static) */}
          <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
          {/* Animated squat body */}
          <g className="ex-anim" style={{ animation: 'ex-squat 2s ease-in-out infinite alternate' }}>
            {/* Torso */}
            <line x1="50" y1="22" x2="50" y2="68" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Thighs */}
            <line x1="50" y1="68" x2="35" y2="100" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="50" y1="68" x2="65" y2="100" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Shins */}
            <line x1="35" y1="100" x2="32" y2="125" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="65" y1="100" x2="68" y2="125" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Arms */}
            <line x1="50" y1="30" x2="33" y2="50" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="50" y1="30" x2="67" y2="50" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Bar */}
            <line x1="25" y1="26" x2="75" y2="26" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'romanian-deadlift':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Legs (static, upright) */}
          <line x1="50" y1="95" x2="43" y2="135" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="43" y1="135" x2="40" y2="155" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="95" x2="57" y2="135" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="57" y1="135" x2="60" y2="155" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Animated torso, head + arms hinge forward */}
          <g className="ex-anim" style={{ transformOrigin: '50px 95px', animation: 'ex-rdl 2s ease-in-out infinite alternate' }}>
            {/* Head */}
            <circle cx="50" cy="20" r="7" stroke={DIM} strokeWidth={SW} />
            {/* Torso */}
            <line x1="50" y1="27" x2="50" y2="95" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Arms */}
            <line x1="50" y1="40" x2="35" y2="65" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="35" y1="65" x2="35" y2="88" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="50" y1="40" x2="65" y2="65" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="65" y1="65" x2="65" y2="88" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            {/* Bar */}
            <line x1="25" y1="88" x2="75" y2="88" stroke={LIME} strokeWidth={SW + 1} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'lunges':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Head */}
          <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
          {/* Torso */}
          <line x1="50" y1="22" x2="50" y2="72" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Arms with weights */}
          <line x1="50" y1="30" x2="33" y2="55" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="33" y1="55" x2="30" y2="80" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="30" x2="67" y2="55" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="67" y1="55" x2="70" y2="80" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Back leg (static) */}
          <line x1="50" y1="72" x2="38" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="38" y1="112" x2="35" y2="145" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Front leg (animated stepping forward) */}
          <g className="ex-anim" style={{ animation: 'ex-lunge 2s ease-in-out infinite alternate' }}>
            <line x1="50" y1="72" x2="62" y2="108" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="62" y1="108" x2="65" y2="145" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'calf-raise':
      return (
        <svg width={size} height={size * (160 / 100)} viewBox="0 0 100 160" fill="none">
          {/* Ground */}
          <line x1="5" y1="155" x2="95" y2="155" stroke={DIM} strokeWidth={1.5} strokeLinecap="round" />
          {/* Entire figure rises */}
          <g className="ex-anim" style={{ animation: 'ex-calf 1.6s ease-in-out infinite alternate' }}>
            {/* Head */}
            <circle cx="50" cy="15" r="7" stroke={DIM} strokeWidth={SW} />
            {/* Torso */}
            <line x1="50" y1="22" x2="50" y2="72" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Arms */}
            <line x1="50" y1="30" x2="35" y2="55" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="50" y1="30" x2="65" y2="55" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Thighs */}
            <line x1="50" y1="72" x2="43" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            <line x1="50" y1="72" x2="57" y2="112" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
            {/* Shins */}
            <line x1="43" y1="112" x2="40" y2="145" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="57" y1="112" x2="60" y2="145" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            {/* Feet on tiptoe */}
            <line x1="36" y1="145" x2="44" y2="145" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
            <line x1="56" y1="145" x2="64" y2="145" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
        </svg>
      )

    case 'plank':
      return (
        <svg width={size} height={size * (120 / 100)} viewBox="0 0 100 120" fill="none">
          {/* Ground */}
          <line x1="5" y1="95" x2="95" y2="95" stroke={DIM} strokeWidth={1.5} strokeLinecap="round" />
          {/* Head */}
          <circle cx="15" cy="68" r="6" stroke={DIM} strokeWidth={SW} />
          {/* Forearms (dim, static) */}
          <line x1="22" y1="72" x2="35" y2="85" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="40" y1="72" x2="48" y2="85" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Animated torso line */}
          <g className="ex-anim" style={{ animation: 'ex-plank-pulse 2s ease-in-out infinite alternate', opacity: 0.7 }}>
            <line x1="22" y1="72" x2="85" y2="72" stroke={LIME} strokeWidth={SW} strokeLinecap="round" />
          </g>
          {/* Legs */}
          <line x1="85" y1="72" x2="88" y2="85" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="80" y1="72" x2="82" y2="85" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          {/* Feet */}
          <line x1="85" y1="85" x2="92" y2="85" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="79" y1="85" x2="86" y2="85" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
        </svg>
      )

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="20" r="8" stroke={DIM} strokeWidth={SW} />
          <line x1="50" y1="28" x2="50" y2="70" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="40" x2="35" y2="58" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="40" x2="65" y2="58" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="70" x2="40" y2="95" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
          <line x1="50" y1="70" x2="60" y2="95" stroke={DIM} strokeWidth={SW} strokeLinecap="round" />
        </svg>
      )
  }
}
