import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // 🔥 ADD THIS (IMPORTANT)
  build: {
    target: "es2015" // fixes "Unexpected token ?" error
  }
})

// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },

//    server: {
//     port: 5173, // The port your frontend will run on
//     proxy: {
//       // Requests to any path starting with /api will be forwarded
//       '/api': {
//         target: 'http://localhost:5000', // Your backend server address
//         changeOrigin: true, // Recommended for virtual hosted sites
//         secure: false,      // Set to false if your backend is http
//       },
//     },
//   },
// })
