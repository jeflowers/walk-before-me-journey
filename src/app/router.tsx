import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { AppShell } from '@app/components/AppShell';
import { StudyHomePage } from '@app/pages/StudyHomePage';
import { LandingPage } from '@app/pages/LandingPage';
import { WaypointsPage } from '@app/pages/WaypointsPage';
import { WaypointPage } from '@app/pages/WaypointPage';
import { CommunityPage } from '@app/pages/CommunityPage';
import { LexiconPage } from '@app/pages/LexiconPage';
import { ProfilePage } from '@app/pages/ProfilePage';
import { CommemorationPage } from '@app/pages/CommemorationPage';
import { PlaceholderPage } from '@app/pages/PlaceholderPage';

/** One entry per screen in the Psalm 26 flow. Replace each PlaceholderPage as the page is built. */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: ROUTES.landing, element: <LandingPage /> },
      { path: ROUTES.studyHome, element: <StudyHomePage /> },
      { path: ROUTES.waypoints, element: <WaypointsPage /> },
      { path: ROUTES.waypoint, element: <WaypointPage /> },
      { path: ROUTES.reflection, element: <PlaceholderPage name="Personal Reflection" reference="reference/desktop/personal_reflection_psalm_26.html" /> },
      { path: ROUTES.community, element: <CommunityPage /> },
      { path: ROUTES.lexicon, element: <LexiconPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      { path: ROUTES.commemoration, element: <CommemorationPage /> },
    ],
  },
]);
