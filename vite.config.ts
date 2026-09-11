import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-frames-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/frames/')) {
            const urlPath = req.url.split('?')[0];
            const match = urlPath.match(/^\/frames\/split-(\d)\/(.+)$/);
            if (match) {
              const splitNum = match[1];
              const fileName = match[2];
              const filePath = path.resolve(__dirname, `frames split ${splitNum}`, fileName);
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'image/jpeg');
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
          }
          next();
        });
      },
      // Ensure build copies frames into dist/frames
      closeBundle() {
        const distFrames = path.resolve(__dirname, 'dist', 'frames');
        for (let i = 1; i <= 4; i++) {
          const srcDir = path.resolve(__dirname, `frames split ${i}`);
          const destDir = path.resolve(distFrames, `split-${i}`);
          if (fs.existsSync(srcDir)) {
            fs.mkdirSync(destDir, { recursive: true });
            const files = fs.readdirSync(srcDir);
            for (const file of files) {
              fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
            }
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
