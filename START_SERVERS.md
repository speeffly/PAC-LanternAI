# How to Start Lantern AI Servers

## Quick Start (2 Terminals Required)

### Terminal 1 - Backend Server

```bash
cd lantern-ai/backend
npm run dev
```

The backend will start on **http://localhost:3001**

You should see:
```
🚀 Lantern AI API running on port 3001
📍 Health check: http://localhost:3001/health
📚 API docs: http://localhost:3001/api
```

---

### Terminal 2 - Frontend Server

```bash
cd lantern-ai/frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

---

## Access the Application

Once both servers are running:

1. **Open your browser** to: http://localhost:3000
2. **Start exploring** - You can use the app anonymously or create an account
3. **Test the API** directly at: http://localhost:3001/health

---

## Troubleshooting

### Backend won't start?
```bash
cd lantern-ai/backend
npm install
npm run dev
```

### Frontend won't start?
```bash
cd lantern-ai/frontend
npm install
npm run dev
```

### Port already in use?

**Backend (3001):**
- Find and kill the process using port 3001
- Or change the port in `backend/.env` file

**Frontend (3000):**
- Next.js will automatically suggest port 3001 if 3000 is busy
- Accept the suggested port or kill the process using 3000

### Environment Variables

Create `backend/.env` if it doesn't exist:
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=lantern-ai-secret-key-change-in-production
NODE_ENV=development
```

Create `frontend/.env.local` if it doesn't exist:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Testing the Setup

### 1. Test Backend Health
Open: http://localhost:3001/health

Should return:
```json
{
  "status": "OK",
  "message": "Lantern AI API is running",
  "timestamp": "2024-xx-xxTxx:xx:xx.xxxZ",
  "version": "1.0.0"
}
```

### 2. Test Frontend
Open: http://localhost:3000

You should see the Lantern AI homepage with:
- Welcome message
- "Start Your Career Journey" button
- ZIP code input

### 3. Test Full Flow
1. Enter a ZIP code (e.g., 12345)
2. Click "Start Your Career Journey"
3. Complete the 12-question assessment
4. View your career matches
5. Create an account to save progress
6. Generate action plans for careers

---

## Stopping the Servers

Press `Ctrl + C` in each terminal window to stop the servers.

---

## Development Tips

### Watch for Changes
Both servers have hot-reload enabled:
- **Backend**: Changes to `.ts` files will restart the server automatically
- **Frontend**: Changes to `.tsx` files will refresh the browser automatically

### View Logs
- Backend logs appear in Terminal 1
- Frontend logs appear in Terminal 2 and browser console

### API Documentation
Visit http://localhost:3001/api to see available endpoints

---

## Production Build

### Backend
```bash
cd lantern-ai/backend
npm run build
npm start
```

### Frontend
```bash
cd lantern-ai/frontend
npm run build
npm start
```

---

## Need Help?

- Check `QUICKSTART.md` for detailed setup instructions
- Check `FEATURES_COMPLETE.md` for feature documentation
- Check `TEST_API.md` for API testing examples
- Check browser console for frontend errors
- Check terminal output for backend errors
