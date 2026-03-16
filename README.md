# keno-backend

Proxy server that connects the keno website to the Luarmor API.
Your Luarmor API key stays secret on the server — never exposed to the browser.

## Setup on Render

1. Push this folder to a GitHub repo
2. Go to render.com → New → Web Service → connect the repo
3. Set these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variable:
   - Key: `LUARMOR_API_KEY`
   - Value: your Luarmor API key

## API Endpoints

### GET /config?project_id=XXX&user_key=YYY
Fetch a user's saved config from Luarmor.

### POST /config
Body: { project_id, user_key, config }
Save a config string to a user's Luarmor note field.

### GET /users?project_id=XXX
List all users/keys for a project.
