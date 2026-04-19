import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // BE 서버로 프록시 - CORS 문제 해결
      //  요청하는 경로가 /api 이면, target 경로로 전달하겠다
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  //  만약 요청 경로의 변경이 필요하면 rewrite 옵션을 통해 경로 변경 가능
      },
    },
  },
});
