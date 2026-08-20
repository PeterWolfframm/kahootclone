import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Library } from './pages/Library';
import { Discover } from './pages/Discover';
import { Editor } from './pages/Editor';
import { Reports, ReportDetail } from './pages/Reports';
import { HostLaunch, HostLive } from './pages/Host';
import { Play } from './pages/Play';
import { Showcase } from './pages/Showcase';
import { SpacetimeProvider } from './lib/spacetime';

export default function App() {
  return (
    <SpacetimeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/library" element={<Library />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/edit/:id" element={<Editor />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/host/:id" element={<HostLaunch />} />
          <Route path="/host/live/:pin" element={<HostLive />} />
          <Route path="/play/:pin" element={<Play />} />
          <Route path="/showcase" element={<Showcase />} />
        </Routes>
      </BrowserRouter>
    </SpacetimeProvider>
  );
}
