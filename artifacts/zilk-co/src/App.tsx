import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Home } from '@/pages/Home';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

// Route-level code splitting — ProjectPage and NotFound are lazy-loaded so
// they're excluded from the initial bundle. They're preloaded after mount.
const LazyProjectPage = lazy(() =>
  import('@/pages/ProjectPage').then((m) => ({ default: m.ProjectPage }))
);
const LazyNotFound = lazy(() => import('@/pages/not-found'));
const LazyBlog = lazy(() =>
  import('@/pages/Blog').then((m) => ({ default: m.BlogPage }))
);
const LazyBlogPost = lazy(() =>
  import('@/pages/Blog').then((m) => ({ default: m.BlogPost }))
);

// Dark fallback prevents any flash during lazy chunk load
const PageFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden />
);

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Switch key={location}>
        <Route path="/" component={Home} />

        <Route path="/blog">
          {() => (
            <Suspense fallback={<PageFallback />}>
              <LazyBlog />
            </Suspense>
          )}
        </Route>

        <Route path="/blog/:slug">
          {(params) => (
            <Suspense fallback={<PageFallback />}>
              <LazyBlogPost slug={params.slug} />
            </Suspense>
          )}
        </Route>

        <Route path="/work/:id">
          {() => (
            <Suspense fallback={<PageFallback />}>
              <LazyProjectPage />
            </Suspense>
          )}
        </Route>

        <Route>
          {() => (
            <Suspense fallback={<PageFallback />}>
              <LazyNotFound />
            </Suspense>
          )}
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
