# Flow Care - Vercel Deployment Guide

### Prerequisites
- Node.js 18+ installed
- Vercel account
- Required API keys (Gemini, Handwriting OCR)

### Option 1: Single Project Deployment

Deploy both frontend and backend as one Vercel project:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Set Environment Variables**
Create `.env.local` or `.env` in project root:
```bash
# Production Backend URL (update after first deployment)
MCP_SERVER_URL=https://your-project-name.vercel.app

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
HOCR=your_handwriting_ocr_api_key
```

3. **Deploy**
```bash
npm run deploy
# or
vercel --prod
```

4. **Configure Environment Variables in Vercel Dashboard**
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all environment variables from your `.env.local`

### Option 2: Separate Backend Deployment (Advanced)

Deploy backend separately for better scalability:

1. **Deploy Backend**
```bash
cd backend-deployment
vercel --prod
```

2. **Update Frontend Environment**
Update `MCP_SERVER_URL` to your backend deployment URL

3. **Deploy Frontend**
```bash
cd ..
vercel --prod
```

**Note**: For most use cases, Option 1 (Single Project) is recommended as it's simpler and sufficient.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MCP_SERVER_URL` | Backend API URL | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `HOCR` | Handwriting OCR API key | No* |

*Required only if using OCR features

### Vercel Configuration

The project includes optimized Vercel configurations:
- `vercel.json` - Main project deployment settings
- `backend-deployment/vercel.json` - Separate backend deployment

## Architecture on Vercel

```
Frontend (Next.js) → Vercel Edge Network
       ↓
Backend API (Express) → Vercel Serverless Functions
       ↓
External APIs (Gemini, OCR)
```

## Post-Deployment Checklist

### 1. Verify API Endpoints
Test these endpoints on your deployed app:
- `GET /api/patients` - Patient list
- `POST /api/patients` - Add patient
- `POST /api/ai/chat` - AI chat functionality
- `POST /api/ocr/upload` - OCR upload (if using)

### 2. Test Core Functionality
- Add new patient
- Update patient status
- AI chat functionality
- Data persistence
- Real-time updates

### 3. Performance Optimization
- Check function execution times in Vercel dashboard
- Monitor cold start performance
- Verify API response times

## Security Considerations

### Production Security
- All API keys are stored as environment variables
- CORS is configured for your domain
- HTTPS is enabled by default on Vercel

### Recommended Additions
- Add authentication for patient data
- Implement rate limiting
- Add input validation
- Set up monitoring and alerts

## Monitoring

### Vercel Analytics
- Function execution logs
- Performance metrics
- Error tracking
- User analytics

### Additional Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for user sessions
- Custom analytics for medical workflows

## Continuous Deployment

### Git Integration
Connect your repository to Vercel for automatic deployments:
1. Connect GitHub/GitLab repository
2. Configure deployment branch (main/production)
3. Set up preview deployments for pull requests

### Deployment Workflow
```
Push to main → Vercel Build → Deploy → Update Environment
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure all dependencies are in `package.json`
   - Check import paths are correct

2. **Environment variables not working**
   - Verify variables are set in Vercel dashboard
   - Check variable names match exactly
   - Redeploy after adding variables

3. **API endpoints returning 404**
   - Check `vercel.json` routing configuration
   - Verify file structure matches expected paths

4. **Database/State persistence issues**
   - Current setup uses in-memory storage
   - For production, consider Vercel KV or external database

### Performance Issues

1. **Cold starts**
   - Normal for serverless functions
   - Consider upgrading to Vercel Pro for faster cold starts

2. **Function timeouts**
   - Check function execution time limits
   - Optimize long-running operations
   - Consider background jobs for heavy processing

## Scaling Considerations

### Current Limitations
- In-memory data storage (lost on function restarts)
- Serverless function execution time limits
- No real-time WebSocket connections

### Scaling Solutions
1. **Add Database**
   - Vercel Postgres
   - MongoDB Atlas
   - Supabase

2. **Real-time Features**
   - Pusher for WebSocket functionality
   - Vercel Edge Functions
   - Server-Sent Events

3. **Performance Optimization**
   - Redis for caching
   - CDN for static assets
   - Edge computing for global distribution

## 📞 Support

### Vercel Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

### Project-Specific Help
- Check project README.md
- Review deployment logs in Vercel dashboard
- Test locally with `npm run dev`

---

