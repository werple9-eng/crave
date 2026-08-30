import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  /**
   * Relative asset paths.
   *
   * GitHub Pages serves a project site from a subpath
   * (`user.github.io/crave/`), not the domain root, so absolute `/assets/...`
   * URLs would 404 there. Relative paths work on a subpath, at a domain root,
   * and from a local `dist` folder opened directly — so the same build
   * deploys anywhere without a host-specific config.
   */
  base: './',
})
