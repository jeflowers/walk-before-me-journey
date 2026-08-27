import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { AppShell } from '@app/components/AppShell';
import { StudyHomePage } from '@app/pages/StudyHomePage';
import { LandingPage } from '@app/pages/LandingPage';
import { WaypointsPage } from '@app/pages/WaypointsPage';
import { PlaceholderPage } from '@app/pages/PlaceholderPage';

/** One entry per screen in the Psalm 26 flow. Replace each PlaceholderPage as the page is built. */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: ROUTES.landing, element: <LandingPage /> },
      { path: ROUTES.studyHome, element: <StudyHomePage /> },
      { path: ROUTES.waypoints, element: <WaypointsPage /> },
      { path: ROUTES.waypoint, element: <PlaceholderPage name="Waypoint Detail" reference="reference/desktop/waypoint_05_the_petition.html" /> },
      { path: ROUTES.reflection, element: <PlaceholderPage name="Personal Reflection" reference="reference/desktop/personal_reflection_psalm_26.html" /> },
      { path: ROUTES.community, element: <PlaceholderPage name="Community Feed" reference="reference/desktop/community_feed_psalm_26.html" /> },
      { path: ROUTES.lexicon, element: <PlaceholderPage name="Lexicon" reference="reference/desktop/lexicon_psalm_26.html" /> },
      { path: ROUTES.profile, element: <PlaceholderPage name="Profile / Sacred Archive" reference="reference/desktop/profile_sacred_archive.html" /> },
      { path: ROUTES.commemoration, element: <PlaceholderPage name="Commemoration" reference="reference/desktop/commemoration_psalm_26.html" /> },
    ],
  },
]);
