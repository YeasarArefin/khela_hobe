# Khela Hobe 🎬

A modern web application for discovering and streaming live television channels with an intuitive user interface and seamless playback experience.

## Features ✨

- **Channel Browser** - Browse hundreds of live channels across multiple categories
- **Search & Filter** - Quickly find channels by name or category
- **Flexible Viewing** - Toggle between grid and list view layouts
- **Live Player** - High-performance video player with HLS streaming support
- **Auto-Slider** - Featured channels carousel with auto-rotation
- **Responsive Design** - Fully responsive interface for desktop and mobile devices
- **Category Organization** - Channels organized by categories (Sports, News, etc.)
- **Channel Details** - View channel information, logos, and descriptions
- **Skeleton Loading** - Smooth loading states with skeleton screens
- **Error Handling** - Comprehensive error capture and reporting

## Tech Stack 🛠️

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite + TanStack Start (Full-stack framework)
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Video Player**: HTML5 Video with HLS.js support
- **Icons**: Lucide React
- **Linting**: ESLint
- **Deployment**: Vercel

## Project Structure 📁

```
khela_hobe/
├── src/
│   ├── components/
│   │   ├── khela/              # Application-specific components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ChannelCard.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   └── ...
│   │   └── ui/                 # Radix UI wrapper components
│   ├── routes/                 # TanStack Router file-based routes
│   │   ├── index.tsx           # Home page
│   │   ├── player.$id.tsx      # Player page with channel ID
│   │   └── __root.tsx          # Root layout
│   ├── data/
│   │   └── channels.json       # Channel data source
│   ├── hooks/
│   │   └── use-mobile.tsx      # Mobile detection hook
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   ├── error-capture.ts    # Error handling
│   │   └── lovable-error-reporting.ts
│   ├── styles/
│   │   └── styles.css          # Global styles
│   ├── server.ts               # SSR server configuration
│   ├── start.ts                # Application entry point
│   └── router.tsx              # Router configuration
├── public/                      # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json
└── eslint.config.js
```

## Installation 🚀

### Prerequisites

- Node.js 16+
- npm or yarn package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd khela_hobe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Available Scripts 📝

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build with development mode enabled
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## Configuration ⚙️

### Channel Data

Channels are defined in `src/data/channels.json`. Each channel entry should have:

```json
{
  "id": "1",
  "name": "Channel Name",
  "logo": "https://...",
  "category": "Sports",
  "description": "Channel description",
  "stream_url": "http://...stream.m3u8",
  "featured": false,
  "number": 1
}
```

### Environment Setup

Create a `.env.local` file for environment-specific settings (if needed):

```
VITE_API_URL=your_api_url_here
```

## Deployment 🌐

This project is configured for deployment on **Vercel**. Nitro is pinned to the Vercel preset in `vite.config.ts`, so the app builds with a Vercel-compatible server bundle.

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Import the repository into Vercel
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: let Vercel detect it automatically
4. Deploy!

## Usage 📺

### Browsing Channels

1. Open the application in your browser
2. Browse channels in the grid view or switch to list view
3. Use the search bar to find specific channels
4. Filter by category using the category buttons

### Watching Streams

1. Click on a channel card to open the player
2. Use player controls to play, pause, and adjust volume
3. Full-screen mode is available on compatible browsers

### Filtering & Searching

- Type in the search bar to find channels by name
- Click category buttons to filter by type
- Results update in real-time as you search/filter

## Key Components 🧩

### Main Pages

- **Home (/)** - Channel browser with search, filter, and view toggle
- **Player (/:id)** - Full-screen video player for specific channel

### UI Components

- `Navbar` - Top navigation bar
- `HeroBanner` - Featured channels carousel
- `SearchBar` - Channel search input
- `CategoryFilter` - Category selection buttons
- `ChannelCard` - Channel display card (grid/list)
- `PlayerControls` - Video player controls
- `ViewToggle` - Grid/list view switcher
- `EmptyState` - No results message
- `SkeletonCard` - Loading placeholder

## Error Handling 🛡️

The application includes comprehensive error handling:

- Global error capture with `error-capture.ts`
- Error reporting to Lovable
- User-friendly error pages
- Console error logging for debugging

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing 🤝

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure code quality by running linting before submitting:

```bash
npm run lint
npm run format
```

## Performance Optimization 🚄

- Skeleton loading screens for better perceived performance
- Image lazy loading for channel logos
- Virtual scrolling for large channel lists (when implemented)
- Code splitting via Vite
- Optimized bundle size with TanStack tools

## Troubleshooting 🔧

### Streams not playing?

- Ensure stream URLs are valid and accessible
- Check browser console for CORS errors
- Verify HLS stream format (.m3u8)

### Slow performance?

- Clear browser cache
- Check network connection
- Disable browser extensions that may affect performance

### Development issues?

- Delete `node_modules` and `package-lock.json`, then reinstall
- Clear `.turbo` cache if using Turbo
- Restart the development server

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For issues, feature requests, or questions:

- Open an issue on GitHub
- Check existing issues before creating new ones
- Provide detailed information about your problem

## Acknowledgments 🙏

- Built with [TanStack](https://tanstack.com/) tools
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Made with ❤️ for seamless live streaming**
