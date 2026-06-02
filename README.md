# AIKitchen - AI-Powered Recipe Suggestion App

Turn your ingredients into delicious meals with AI.

## Features

- **Ingredient Input** - Add ingredients as chips/tags with autocomplete
- **AI Dish Suggestions** - Get dish recommendations based on available ingredients
- **Recipe Generation** - Full recipes with prep steps, cook steps, tips
- **Dynamic Images** - Auto-fetched food images from Pexels/Unsplash
- **YouTube Videos** - Related recipe video suggestions
- **Favorites** - Save recipes to local storage
- **Dark Mode** - Toggle between light and dark themes
- **Responsive** - Mobile-first design
- **Copy / Share / Print** - Recipe utility features

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- react-hot-toast

## Getting Started

### 1. Clone and install

```bash
cd aikitchen
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | One of | OpenAI API key |
| `GROQ_API_KEY` | One of | Groq API key (free alternative) |
| `PEXELS_API_KEY` | No | For food images |
| `UNSPLASH_ACCESS_KEY` | No | Fallback for food images |
| `YOUTUBE_API_KEY` | No | For recipe video search |
| `NEXT_PUBLIC_PEXELS_API_KEY` | No | Public Pexels key (client-side fallback) |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | No | Public Unsplash key (client-side fallback) |

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## API Setup Guides

### OpenAI
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

### Groq (Free Alternative)
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Create a free API key
3. Add to `.env.local`: `GROQ_API_KEY=gsk_...`

### Pexels (Images)
1. Go to [pexels.com/api](https://www.pexels.com/api/)
2. Sign up for free API access
3. Add to `.env.local`: `PEXELS_API_KEY=...`

### YouTube Data API
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create an API key
4. Add to `.env.local`: `YOUTUBE_API_KEY=...`

## Sample Prompts

### Example Input 1
```
Rice, Onion, Tomato, Egg, Garlic
```
_Might suggest: Fried Rice, Spanish Omelette, Tomato Egg Drop Soup_

### Example Input 2
```
Chicken, Potato, Carrot, Soy Sauce
```
_Might suggest: Chicken Stew, Teriyaki Chicken, Pot Roast_

### Example Input 3
```
Pasta, Tomato, Basil, Cheese, Olive Oil
```
_Might suggest: Pasta Pomodoro, Caprese Pasta, Aglio e Olio_

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aikitchen)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
aikitchen/
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── api/       # API routes
│   │   ├── favorites/ # Favorites page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx   # Main page
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/    # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service layers
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
└── .env.example       # Environment variables template
```

## License

MIT
