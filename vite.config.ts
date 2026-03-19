import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `vite.config.ts`는 Node 환경에서 실행되지만, 현재 프로젝트 타입 설정에 node 타입이 없어
// `process`가 인식되지 않을 수 있음. 간단한 선언으로 빌드를 통과시킵니다.
declare const process: { env: Record<string, string | undefined> }

const base = process.env.VITE_BASE_URL ?? '/'

export default defineConfig({
  // GitHub Pages가 /{repo} 경로로 서빙될 때 정적 자산/라우팅 기준 경로를 맞추기 위함
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
})
