## Forest Fire Danger Rating System

To run, please ensure you have an .env file with the following variables:
```
NODE_ENV
PORT
MONGODB_URI
FRONTEND_URL
MAIL_SERVICE
ADMIN_EMAIL
ADMIN_EMAIL_PASSWORD
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY
```
Default node environment is development <br>
Default port is 5555 <br>
FRONTEND_URL is the domain name and port of the frontend React.js server, e.g. http://localhost:3000
MAIL_SERVICE, ADMIN_EMAIL, and ADMIN_EMAIL_PASSWORD are used for the nodeemailer for the Reset Password Email form. Example, if gmail account will be used using app password, use MAIL_SERVICE=gmail. Please check nodemailer for more details and other options.<br>
Token expiries may have values like 3000 (in milliseconds) or 3s for 3 seconds
or 3m for 3minutes, 1d for 1 day, etc<br>


Then check the vite.config.js in client folder to configure the reset password link (pluginRewriteAll) and proxy
Eg.
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginRewriteAll()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5555',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

```
where you change the target URL (backend server) and the port is the frontend server port<br>

Also check the mailOptions found in the forgotPassword function of the authController.js in the server component if the URL for the link is correct. The URL should be the frontend server <br>

To run, check the following commands
```
"scripts": {
    "start": "node server/server.js",
    "server": "nodemon server/server.js",
    "client": "npm run dev --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },
```