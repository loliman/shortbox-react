import { lazy } from "react";
import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import type { SessionData } from "./session";

const Home = lazy(() => import("../components/Home"));
const PublisherDetails = lazy(() => import("../components/details/PublisherDetails"));
const SeriesDetails = lazy(() => import("../components/details/SeriesDetails"));
const IssueDetailsDE = lazy(() => import("../components/details/IssueDetailsDE"));
const IssueDetailsUS = lazy(() => import("../components/details/IssueDetailsUS"));
const Filter = lazy(() => import("../components/filter/Filter"));
const Login = lazy(() => import("../components/Login"));
const Contact = lazy(() => import("../components/footer/Contact"));
const Impress = lazy(() => import("../components/footer/Impress"));
const Privacy = lazy(() => import("../components/footer/Privacy"));
const PublisherCreate = lazy(() => import("../components/restricted/create/PublisherCreate"));
const SeriesCreate = lazy(() => import("../components/restricted/create/SeriesCreate"));
const IssueCreate = lazy(() => import("../components/restricted/create/IssueCreate"));
const IssueCopy = lazy(() => import("../components/restricted/copy/IssueCopy"));
const PublisherEdit = lazy(() => import("../components/restricted/edit/PublisherEdit"));
const SeriesEdit = lazy(() => import("../components/restricted/edit/SeriesEdit"));
const IssueEdit = lazy(() => import("../components/restricted/edit/IssueEdit"));

type AppRoutesProps = {
  session?: SessionData;
  authReady?: boolean;
};

function guard(session: SessionData | undefined, authReady: boolean, element: ReactElement) {
  return (
    <PrivateRoute session={session} authReady={authReady}>
      {element}
    </PrivateRoute>
  );
}

export function AppRoutes({ session, authReady = false }: Readonly<AppRoutesProps>) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/de" replace />} />

      <Route path="/de" element={<Home />} />
      <Route path="/de/:publisher" element={<PublisherDetails />} />
      <Route path="/de/:publisher/:series" element={<SeriesDetails />} />
      <Route path="/de/:publisher/:series/:issue" element={<IssueDetailsDE />} />
      <Route path="/de/:publisher/:series/:issue/:variant" element={<IssueDetailsDE />} />

      <Route path="/us" element={<Home />} />
      <Route path="/us/:publisher" element={<PublisherDetails />} />
      <Route path="/us/:publisher/:series" element={<SeriesDetails />} />
      <Route path="/us/:publisher/:series/:issue" element={<IssueDetailsUS />} />
      <Route path="/us/:publisher/:series/:issue/:variant" element={<IssueDetailsUS />} />

      <Route path="/filter/de" element={<Filter />} />
      <Route path="/filter/us" element={<Filter />} />

      <Route path="/login" element={<Login />} />

      <Route path="/contact" element={<Contact />} />
      <Route path="/impress" element={<Impress />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/create/publisher" element={guard(session, authReady, <PublisherCreate />)} />
      <Route path="/create/series" element={guard(session, authReady, <SeriesCreate />)} />
      <Route path="/create/issue" element={guard(session, authReady, <IssueCreate />)} />
      <Route
        path="/create/issue/de/:publisher"
        element={guard(session, authReady, <IssueCreate />)}
      />
      <Route
        path="/create/issue/de/:publisher/:series"
        element={guard(session, authReady, <IssueCreate />)}
      />
      <Route
        path="/create/issue/us/:publisher"
        element={guard(session, authReady, <IssueCreate />)}
      />
      <Route
        path="/create/issue/us/:publisher/:series"
        element={guard(session, authReady, <IssueCreate />)}
      />

      <Route
        path="/copy/issue/de/:publisher/:series/:issue"
        element={guard(session, authReady, <IssueCopy />)}
      />
      <Route
        path="/copy/issue/us/:publisher/:series/:issue"
        element={guard(session, authReady, <IssueCopy />)}
      />

      <Route path="/edit/de/:publisher" element={guard(session, authReady, <PublisherEdit />)} />
      <Route
        path="/edit/de/:publisher/:series"
        element={guard(session, authReady, <SeriesEdit />)}
      />
      <Route
        path="/edit/de/:publisher/:series/:issue"
        element={guard(session, authReady, <IssueEdit />)}
      />
      <Route
        path="/edit/de/:publisher/:series/:issue/:variant"
        element={guard(session, authReady, <IssueEdit />)}
      />

      <Route path="/edit/us/:publisher" element={guard(session, authReady, <PublisherEdit />)} />
      <Route
        path="/edit/us/:publisher/:series"
        element={guard(session, authReady, <SeriesEdit />)}
      />
      <Route
        path="/edit/us/:publisher/:series/:issue"
        element={guard(session, authReady, <IssueEdit />)}
      />
      <Route
        path="/edit/us/:publisher/:series/:issue/:variant"
        element={guard(session, authReady, <IssueEdit />)}
      />

      <Route path="*" element={<Navigate to="/de" replace />} />
    </Routes>
  );
}
