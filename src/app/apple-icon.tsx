import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 100 100" width="140" height="140">
          <path d="M 50,75 C 20,65 10,35 25,20 C 35,15 45,35 50,55" fill="#06b6d4" opacity="0.9" />
          <path d="M 50,75 C 80,65 90,35 75,20 C 65,15 55,35 50,55" fill="#facc15" opacity="0.9" />
          <path d="M 50,75 C 35,50 35,15 50,10 C 65,15 65,50 50,75" fill="#ec4899" opacity="0.9" />
          
          <circle cx="28" cy="28" r="4" fill="#09090b" opacity="0.5" />
          <circle cx="72" cy="28" r="4" fill="#09090b" opacity="0.5" />
          <circle cx="50" cy="18" r="4" fill="#09090b" opacity="0.5" />

          <path d="M 50,85 C 40,85 42,60 50,52 C 58,60 60,85 50,85" fill="#ffffff" />
          <path d="M 50,54 C 46,45 46,38 50,35 C 54,38 54,45 50,54" fill="#ffffff" />
          
          <circle cx="50" cy="27" r="1.5" fill="#ffffff" />
          <circle cx="44" cy="29" r="1.5" fill="#ffffff" />
          <circle cx="56" cy="29" r="1.5" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
