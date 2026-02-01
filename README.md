# Grammar Bot Web UI

A modern, responsive web interface for AI-powered grammar correction. Built with Next.js 14 and designed to work with n8n workflows connected to Google Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## Features

- Clean, modern dark theme UI
- Real-time grammar correction powered by AI
- Shows corrected text with explanation of changes
- Copy to clipboard functionality
- Keyboard shortcuts (Ctrl+Enter to submit)
- Character count display
- Responsive design (mobile-friendly)
- Docker-ready for easy deployment

## Preview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Browser                                                    │
│     │                                                       │
│     ▼                                                       │
│  Next.js Frontend                                           │
│     │                                                       │
│     ▼ POST /api/correct                                     │
│  Next.js API Route ──────► n8n Webhook ──────► Gemini AI    │
│     │                                                       │
│     ▼                                                       │
│  Display corrected text + changes                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

Before using this web UI, you need to set up an n8n workflow that:

1. Receives POST requests with `{ "text": "your text here" }`
2. Sends the text to Google Gemini AI for grammar correction
3. Returns a response in this format:

```json
{
  "original": "your text here",
  "result": "CORRECTED: Your text here.\nCHANGES: Capitalized first letter, added period.",
  "status": "success"
}
```

### n8n Workflow Setup

1. Create a new workflow in n8n
2. Add a **Webhook** node (trigger)
   - HTTP Method: POST
   - Path: `grammar` (or your preferred path)
3. Add a **Google Gemini Chat Model** node
   - Use a prompt like: *"Correct the grammar of the following text. Respond with CORRECTED: [corrected text] and CHANGES: [list of changes made, or 'None' if already correct]"*
4. Add a **Respond to Webhook** node to return the result
5. Activate the workflow and copy the webhook URL

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/grammar-web-ui.git
cd grammar-web-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example environment file and update with your n8n webhook URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/grammar
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

### Option 1: Docker (Recommended)

1. Create a `.env` file with your webhook URL:

   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/grammar
   ```

2. Build and run with Docker Compose:

   ```bash
   docker-compose up -d --build
   ```

The container runs on port 3000 internally. Configure your reverse proxy (Nginx, Traefik, Caddy, etc.) to route traffic to the container.

### Option 2: Node.js

```bash
npm run build
npm start
```

### Option 3: Vercel / Other Platforms

This is a standard Next.js app and can be deployed to Vercel, Railway, or any platform supporting Next.js.

Set the `N8N_WEBHOOK_URL` environment variable in your platform's settings.

## Project Structure

```
grammar-web-ui/
├── app/
│   ├── api/correct/
│   │   └── route.ts        # API route (proxies to n8n)
│   ├── globals.css         # Global styles + Tailwind
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── CopyButton.tsx      # Copy to clipboard
│   ├── GrammarForm.tsx     # Main form component
│   ├── LoadingSpinner.tsx  # Loading indicator
│   └── ResultCard.tsx      # Results display
├── lib/
│   └── api.ts              # API client functions
├── .env.example            # Example environment config
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose config
└── next.config.js          # Next.js config (standalone output)
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_WEBHOOK_URL` | Your n8n webhook endpoint URL | Yes |

## API Reference

### POST /api/correct

Sends text to the n8n webhook for grammar correction.

**Request:**

```json
{
  "text": "i wants to go to the store"
}
```

**Response:**

```json
{
  "original": "i wants to go to the store",
  "corrected": "I want to go to the store.",
  "changes": "Capitalized 'I', changed 'wants' to 'want', added period.",
  "status": "success"
}
```

**Error Response:**

```json
{
  "error": "Error message here"
}
```

## Customization

### Styling

The app uses Tailwind CSS. Modify `app/globals.css` and component files to customize the appearance.

### Timeout

The default API timeout is 30 seconds. Modify `app/api/correct/route.ts` to change:

```typescript
const timeoutId = setTimeout(() => controller.abort(), 30000); // Change 30000 to desired ms
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to correct grammar" | Verify n8n workflow is active and `N8N_WEBHOOK_URL` is correct |
| CORS errors | Configure CORS in your n8n webhook or reverse proxy |
| Timeout errors | Increase timeout in API route or check n8n/Gemini response time |
| Empty response | Verify n8n workflow is published and Gemini credentials are valid |

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Backend:** [n8n](https://n8n.io/) + [Google Gemini](https://ai.google.dev/)
- **Deployment:** Docker / Node.js

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

**Dhany Yudi Prasetyo**

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
