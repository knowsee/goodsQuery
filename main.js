import App from './App'
import uvUI from '@/uni_modules/uv-ui-tools'
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uvUI);
  return {
    app
  }
}