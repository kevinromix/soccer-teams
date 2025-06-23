import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Space } from "antd";
// const Clubs = React.lazy(() => import("./pages/Clubs/Clubs"));
import Clubs from "./pages/Clubs";
import Compare from "./pages/Compare";
import Stats from "./pages/Stats";
import Resultados from "./pages/Resultados";
import Equipo from "./pages/Equipo";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:customPath"
          element={
            <Clubs competitionId={competitionId} competition={competition} />
          }
        />
        <Route
          path={"/:customPath/resultados"}
          element={
            <Resultados
              competitionId={competitionId}
              competition={competition}
            />
          }
        />
        <Route
          path={"/:customPath/comparar"}
          element={
            <Compare competitionId={competitionId} competition={competition} />
          }
        />
        <Route
          path={"/:customPath/equipo"}
          element={
            <Equipo competitionId={competitionId} competition={competition} />
          }
        />
        <Route path={"/stats"} element={<Stats />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      {/* <Outlet /> */}
    </div>
  );
}

function Home() {
  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout>
        <Layout.Header
          style={{
            textAlign: "center",
            color: "#fff",
            height: 64,
            paddingInline: 60,
            lineHeight: "64px",
          }}
        >
          Ligas de fútbol
        </Layout.Header>
        <Layout.Content
          style={{
            textAlign: "center",
            lineHeight: "55px",
            backgroundColor: "#304b5d",
            color: "#304b5d",
          }}
        >
          <nav style={{ width: 400, margin: "100px auto" }}>
            <ul>
              {ligas.map((liga) => {
                return (
                  <li key={liga.competitionId}>
                    <Link style={{ color: "#fff" }} to={`${liga.path}`}>
                      <span>{liga.competition}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Layout.Content>
        <Layout.Footer>Made by Kevin Roman</Layout.Footer>
      </Layout>
    </Space>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

const ligas = [
  {
    competitionId: 7,
    competition: "Premier League",
    path: "premier-league",
  },
  {
    competitionId: 25,
    competition: "Bundesliga",
    path: "bundesliga",
  },
  {
    competitionId: 11,
    competition: "La Liga",
    path: "la-liga",
  },
  {
    competitionId: 17,
    competition: "Serie A",
    path: "serie-a",
  },
  {
    competitionId: 35,
    competition: "Ligue 1",
    path: "ligue-1",
  },
  {
    competitionId: 141,
    competition: "Liga Mx",
    path: "liga-mx",
  },
  {
    competitionId: 113,
    competition: "Brasileirao",
    path: "brasileirao",
  },
  {
    competitionId: 572,
    competition: "Champions League",
    path: "champions-league",
  },
  {
    competitionId: 573,
    competition: "Europa League",
    path: "europa-league",
  },
  {
    competitionId: 7685,
    competition: "Conference League",
    path: "conference-league",
  },
  {
    competitionId: 7016,
    competition: "Uefa Nations League",
    path: "uefa-nations-league",
  },
   {
    competitionId: 589,
    competition: "Copa Oro",
    path: "copa-oro",
  },
  {
    competitionId: 5096,
    competition: "Mundial De Clubes",
    path: "mundial-de-clubes",
  },
];

function competitionId(customPath) {
  return ligas.find((liga) => liga.path === customPath).competitionId;
}

function competition(customPath) {
  return ligas.find((liga) => liga.path === customPath).competition;
}
