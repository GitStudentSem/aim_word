import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: (name, filename) => {
        // Извлекаем имя компонента из пути файла
        const componentName = filename.split('/').pop()?.replace('.module.css', '') || 'unknown';
        return `${componentName}__${name}`;
      }
    }
  }
})
