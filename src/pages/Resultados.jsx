import React, { useState, useEffect } from "react";
import { Affix, Table, Row, Col } from "antd";
import { useParams } from "react-router-dom";

export default function Resultados(props) {
  const { customPath } = useParams();
  const [competition] = useState(props.competition(customPath));
  const [competitionId] = useState(props.competitionId(customPath));
  const [isLoading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [marcadores, setMarcadores] = useState([]);

  const columns = Object.keys(results[0] ?? [])
    .slice(1)
    .map((k) => {
      return {
        title: () => <div>{k}</div>,
        width: 75,
        fixed: k === "Jornada" ? "left" : "",
        render: (text, record) => {
          return (
            <div className={k}>
              <span>{record[k] ?? 0}</span>
            </div>
          );
        },
        sorter: (a, b) => {
          if (a[k] > b[k]) {
            return -1;
          } else if (a[k] < b[k]) {
            return 1;
          }
          return 0;
        },
      };
    });

  const columnsAvg = Object.keys(results[0] ?? [])
    .slice(1)
    .map((k) => {
      return {
        title: () => <div>{k}</div>,
        width: 75,
        fixed: k === "Jornada" ? "left" : "",
        render: (text, record) => {
          const length = results.length;
          let suma = 0;
          results.forEach((result) => {
            suma += result[k];
          });
          const promedio = parseFloat((suma / length).toFixed(2));
          return (
            <div className={k}>
              <span>{promedio}</span>
            </div>
          );
        },
      };
    });

  const marcadoresColumn = [
    {
      title: (
        <div>
          <span>Marcadores</span>
        </div>
      ),
      render: (text, record) => {
        return (
          <div>
            <span>{record.key}</span>
          </div>
        );
      },
    },
    {
      title: () => (
        <div>
          <span>Repeticiones</span>
        </div>
      ),
      render: (text, record) => {
        return (
          <div>
            <span>{record.value}</span>
          </div>
        );
      },
      sorter: (a, b) => {
        a = a.value;
        b = b.value;
        if (a > b) {
          return -1;
        }
        if (a < b) {
          return 1;
        }
        return 0;
      },
    },
  ];

  useEffect(() => {
    if (isLoading) {
      let _results = [];
      let _marcadores = [];
      fetchData(competitionId, _results, _marcadores).then((_) => {
        setResults(_results);
        setMarcadores(_marcadores);
        setLoading(false);
      });
    }
  }, [competitionId, isLoading]);

  return (
    <div>
      <Affix>
        <Row
          justify="center"
          align="middle"
          style={{
            backgroundColor: "#304b5d",
            color: "#fff",
          }}
        >
          <h2>{competition}</h2>
        </Row>
      </Affix>
      <Row
        wrap={false}
        justify="space-evenly"
        align="top"
        style={{
          overflow: "scroll",
          padding: "30px 40px",
        }}
      >
        <Row gutter={[0, 30]} style={{ width: 920 }}>
          <Col>
            <Table
              columns={columnsAvg}
              dataSource={[{ key: 0 }]}
              pagination={false}
              loading={isLoading}
              bordered={true}
              size="small"
              scroll={{ x: 0 }}
              sticky
            />
          </Col>
          <Col>
            <Table
              columns={columns}
              dataSource={results}
              pagination={false}
              loading={isLoading}
              showSorterTooltip={false}
              bordered={true}
              size="small"
              scroll={{ x: 0 }}
              sticky
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={marcadoresColumn}
              dataSource={Object.values(marcadores)}
              pagination={false}
              loading={isLoading}
              showSorterTooltip={false}
              bordered={true}
              size="small"
              scroll={{ x: 0 }}
            />
          </Col>
        </Row>
      </Row>
    </div>
  );
}

function initResult(index) {
  return {
    key: index,
    Jornada: index,
    Juegos: 0,
    Local: 0,
    Empate: 0,
    Visita: 0,
    AA: 0,
    Goles: 0,
    "0-0": 0,
    "1-1": 0,
    "2-1": 0,
    "1-2": 0,
    "2-0": 0,
    "2-2": 0,
    "1-0": 0,
    "0-1": 0,
    "0-2": 0,
    "3-0": 0,
    "3-1": 0,
    "3-2": 0,
    "3-3": 0,
    "1-3": 0,
    "2-3": 0,
    "0-3": 0,
    "1-4": 0,
    "4-0": 0,
    "5-0": 0,
    "5-1": 0,
  };
}

// API FIRST GAMES
async function getFirstGames(competitionId) {
  return await fetch(
    `https://webws.365scores.com/web/games/results/?appTypeId=5&langId=29&timezoneName=America/Mexico_City&userCountryId=31&competitions=${competitionId}&showOdds=true&includeTopBettingOpportunity=1&topBookmaker=14`
  ).then(async (response) => await response.json());
}

async function getNextGames(competitionId, lastGameId) {
  return await fetch(
    `https://webws.365scores.com/web/games/?langId=29&timezoneId=78&userCountryId=31&apptype=5&competitions=${competitionId}&games=1&aftergame=${lastGameId}&direction=-1&withmainodds=true`
  ).then(async (response) => await response.json());
}

async function setNextGames(
  competitionId,
  results,
  marcadores,
  seasonNum,
  lastGameId
) {
  await getNextGames(competitionId, lastGameId).then(async (response) => {
    if (response.games != null) {
      if (response.games[0].seasonNum === seasonNum) {
        response.games.forEach((game) => {
          setJornada(results, marcadores, game);
        });
        lastGameId = response.games[0].id;
        await new Promise(async (resolve) => setTimeout(resolve, 300));
        await setNextGames(
          competitionId,
          results,
          marcadores,
          seasonNum,
          lastGameId
        );
      }
    }
  });
}

async function fetchData(competitionId, results, marcadores) {
  let lastGameId;
  let seasonNum;
  await getFirstGames(competitionId)
    .then((response) => {
      if (response.games != null) {
        seasonNum = response.games[0].seasonNum;
        lastGameId = response.games[response.games.length - 1].id;
        let numJornadas = 0;
        // Find the las roundNum
        response.games.forEach((game) => {
          if (game.roundNum > numJornadas) {
            numJornadas = game.roundNum;
          }
        });
        // Init all Jornadas
        for (let i = 1; i <= numJornadas; i++) {
          results.push(initResult(i));
        }
        response.games.forEach((game) => {
          setJornada(results, marcadores, game);
        });
      }
    })
    .then(
      async (_) =>
        await new Promise(async (resolve) => setTimeout(resolve, 300))
    )
    .then(async (_) => {
      await setNextGames(
        competitionId,
        results,
        marcadores,
        seasonNum,
        lastGameId
      );
    });
}

function setJornada(results, marcadores, game) {
  const home = game.homeCompetitor;
  const away = game.awayCompetitor;
  const homeScore = home.score;
  const awayScore = away.score;
  // Total de Juegos
  results[game.roundNum - 1].Juegos += 1;
  // Total de Goles
  results[game.roundNum - 1].Goles += homeScore + awayScore;
  // AA
  if (homeScore > 0 && awayScore > 0) {
    results[game.roundNum - 1].AA += 1;
  }
  // L/E/V
  if (homeScore === awayScore) {
    results[game.roundNum - 1].Empate += 1;
  } else if (homeScore > awayScore) {
    results[game.roundNum - 1].Local += 1;
  } else {
    results[game.roundNum - 1].Visita += 1;
  }
  // Marcadores
  const stringyScore = `${homeScore}-${awayScore}`;
  if (stringyScore in results[game.roundNum - 1]) {
    results[game.roundNum - 1][stringyScore] += 1;
  }
  if (stringyScore in marcadores) {
    marcadores[stringyScore].value += 1;
  } else {
    marcadores[stringyScore] = {
      key: stringyScore,
      value: 1,
    };
  }
}
