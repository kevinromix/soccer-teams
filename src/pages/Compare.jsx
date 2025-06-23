import React, { useState, useEffect } from "react";
import { Affix, Avatar, Row, Col, Table, Spin } from "antd";
import { Link, useParams } from "react-router-dom";

export default function Compare(props) {
  const [isLoading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  // --------------NOT CUSTOM-------------------
  const { customPath } = useParams();
  const [competitionIdT1] = useState(props.competitionId(customPath));
  const [competitionIdT2] = useState(props.competitionId(customPath));
  const seasonNumT1 = parseInt(localStorage.getItem("seasonNum"));
  const seasonNumT2 = parseInt(localStorage.getItem("seasonNum"));
  const [team1, setTeam1] = useState(JSON.parse(localStorage.getItem("team1")));
  const [team2, setTeam2] = useState(JSON.parse(localStorage.getItem("team2")));
  // ----------------CUSTOM--------------------
  // const [team1, setTeam1] = useState({ id: 227, name: "Unknown" });
  // const seasonNumT1 = 123;
  // const competitionIdT1 = 17;
  // const [team2, setTeam2] = useState({ id: 108, name: "Unknown" });
  // const seasonNumT2 = 130;
  // const competitionIdT2 = 7;

  useEffect(() => {
    async function fetchData() {
      let _team1 = team1;
      let _team2 = team2;
      let _stats = initData();
      // TEAM 1
      await getGames(_team1, competitionIdT1, seasonNumT1).then(
        async (t1Games) =>
          await new Promise(async (resolve) => setTimeout(resolve, 300)).then(
            async (_) =>
              // TEAM 2
              await getGames(_team2, competitionIdT2, seasonNumT2).then(
                async (t2Games) => {
                  // REGLA MISMO NUMERO DE JUEGOS --->
                  let lengthT1 = t1Games.length;
                  let lengthT2 = t2Games.length;
                  if (lengthT1 > lengthT2) {
                    let diferencia = lengthT1 - lengthT2;
                    t1Games = t1Games.slice(0, t1Games.length - diferencia);
                  } else if (lengthT2 > lengthT1) {
                    let diferencia = lengthT2 - lengthT1;
                    t2Games = t2Games.slice(0, t2Games.length - diferencia);
                  }
                  // <---- REGLA MISMO NUMERO DE JUEGOS
                  // TEAM 1
                  await setTeamGames(_team1, _stats, "1", t1Games).then(
                    async (_) => {
                      // TEAM 2
                      await setTeamGames(_team2, _stats, "2", t2Games).then(
                        async (_) => {
                          setLoading(false);
                          setStats(_stats);
                          setTeam1(_team1);
                          setTeam2(_team2);
                        }
                      );
                    }
                  );
                }
              )
          )
      );
    }
    if (isLoading) {
      fetchData();
    }
  }, [
    competitionIdT1,
    competitionIdT2,
    isLoading,
    seasonNumT1,
    seasonNumT2,
    team1,
    team2,
  ]);

  let customKeys = [
    {
      key: "AvgGoles",
      label: "Goles",
    },
    {
      key: "AvgAA",
      label: "AA",
    },
  ];

  const totalColumns = [
    {
      render: (_, record) => {
        return (
          <Row className="total">
            <span>{record.label}</span>
          </Row>
        );
      },
    },
    {
      title: (
        <div className="home">
          <span>Home</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="equipo">Team1</div>,
          render: (_, record) => {
            let avg;
            if (record.key === "AvgGoles") {
              const juegosT1 = stats["Juegos"]["team1"]["home"];
              const avgE = parseFloat(
                (stats["Goles"]["team1"]["home"] / juegosT1).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["GolesR"]["team1"]["home"] / juegosT1).toFixed(2)
              );
              avg = parseFloat(((avgE + avgR) / 2).toFixed(2));
            } else if (record.key === "AvgAA") {
              const juegosT1 = stats["Juegos"]["team1"]["home"];
              const avgE = parseFloat(
                (stats["AA"]["team1"]["home"] / juegosT1).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["AA"]["team1"]["home"] / juegosT1).toFixed(2)
              );
              avg = parseInt(((avgE + avgR) / 2) * 100);
            }
            return (
              <div className="home">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="away">
          <span>Away</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Team2</div>,
          render: (_, record) => {
            let avg;
            if (record.key === "AvgGoles") {
              const juegos = stats["Juegos"]["team2"]["away"];
              const avgE = parseFloat(
                (stats["Goles"]["team2"]["away"] / juegos).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["GolesR"]["team2"]["away"] / juegos).toFixed(2)
              );
              avg = parseFloat(((avgE + avgR) / 2).toFixed(2));
            } else if (record.key === "AvgAA") {
              const juegos = stats["Juegos"]["team2"]["away"];
              const avgE = parseFloat(
                (stats["AA"]["team2"]["away"] / juegos).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["AA"]["team2"]["away"] / juegos).toFixed(2)
              );
              avg = parseInt(((avgE + avgR) / 2) * 100);
            }
            return (
              <div className="away">
                <span>{avg}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Team1</div>,
          render: (_, record) => {
            let avg;
            if (record.key === "AvgGoles") {
              const juegos = stats["Juegos"]["team1"]["away"];
              const avgE = parseFloat(
                (stats["Goles"]["team1"]["away"] / juegos).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["GolesR"]["team1"]["away"] / juegos).toFixed(2)
              );
              avg = parseFloat(((avgE + avgR) / 2).toFixed(2));
            } else if (record.key === "AvgAA") {
              const juegos = stats["Juegos"]["team1"]["away"];
              const avgE = parseFloat(
                (stats["AA"]["team1"]["away"] / juegos).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["AA"]["team1"]["away"] / juegos).toFixed(2)
              );
              avg = parseInt(((avgE + avgR) / 2) * 100);
            }
            return (
              <div className="away">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="home">
          <span>Home</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Team2</div>,
          render: (_, record) => {
            let avg;
            if (record.key === "AvgGoles") {
              const juegosT1 = stats["Juegos"]["team2"]["home"];
              const avgE = parseFloat(
                (stats["Goles"]["team2"]["home"] / juegosT1).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["GolesR"]["team2"]["home"] / juegosT1).toFixed(2)
              );
              avg = parseFloat(((avgE + avgR) / 2).toFixed(2));
            } else if (record.key === "AvgAA") {
              const juegosT1 = stats["Juegos"]["team2"]["home"];
              const avgE = parseFloat(
                (stats["AA"]["team2"]["home"] / juegosT1).toFixed(2)
              );
              const avgR = parseFloat(
                (stats["AA"]["team2"]["home"] / juegosT1).toFixed(2)
              );
              avg = parseInt(((avgE + avgR) / 2) * 100);
            }
            return (
              <div className="home">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="total">
          <span>Clip</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="total">Copy</div>,
          render: (_, record) => {
            const juegosT1Home = stats["Juegos"]["team1"]["home"];
            const juegosT1Away = stats["Juegos"]["team1"]["away"];
            const juegosT2Home = stats["Juegos"]["team2"]["home"];
            const juegosT2Away = stats["Juegos"]["team2"]["away"];

            if (record.key === "AvgGoles") {
              return (
                <div className="total">
                  <button
                    onClick={() => {
                      // TEAM 1 HOME
                      const avgT1HE = parseFloat(
                        (
                          stats["Goles"]["team1"]["home"] / juegosT1Home
                        ).toFixed(2)
                      );
                      const avgT1HR = parseFloat(
                        (
                          stats["GolesR"]["team1"]["home"] / juegosT1Home
                        ).toFixed(2)
                      );
                      let team1Home = parseFloat(
                        ((avgT1HE + avgT1HR) / 2).toFixed(2)
                      );

                      // TEAM 2 Away
                      const avgT2AE = parseFloat(
                        (
                          stats["Goles"]["team2"]["away"] / juegosT2Away
                        ).toFixed(2)
                      );
                      const avgT2AR = parseFloat(
                        (
                          stats["GolesR"]["team2"]["away"] / juegosT2Away
                        ).toFixed(2)
                      );
                      let team2Away = parseFloat(
                        ((avgT2AE + avgT2AR) / 2).toFixed(2)
                      );

                      // TEAM 1 Away
                      const avgT1AE = parseFloat(
                        (
                          stats["Goles"]["team1"]["away"] / juegosT1Away
                        ).toFixed(2)
                      );
                      const avgT1AR = parseFloat(
                        (
                          stats["GolesR"]["team1"]["away"] / juegosT1Away
                        ).toFixed(2)
                      );
                      let team1Away = parseFloat(
                        ((avgT1AE + avgT1AR) / 2).toFixed(2)
                      );

                      // TEAM 2 HOME
                      const avgT2HE = parseFloat(
                        (
                          stats["Goles"]["team2"]["home"] / juegosT2Home
                        ).toFixed(2)
                      );
                      const avgT2HR = parseFloat(
                        (
                          stats["GolesR"]["team2"]["home"] / juegosT2Home
                        ).toFixed(2)
                      );
                      let team2Home = parseFloat(
                        ((avgT2HE + avgT2HR) / 2).toFixed(2)
                      );

                      const avgGolesL = ((team1Home + team2Away) / 2).toFixed(
                        2
                      );
                      const avgGolesLV = (
                        (team1Home + team2Away + team1Away + team2Home) /
                        4
                      ).toFixed(2);

                      // -------------AA----------------

                      // TEAM 1 HOME
                      const team1HomeAA = parseFloat(
                        (stats["AA"]["team1"]["home"] / juegosT1Home).toFixed(
                          2
                        ) * 100
                      );

                      // TEAM 2 Away
                      const team2AwayAA = parseFloat(
                        (stats["AA"]["team2"]["away"] / juegosT2Away).toFixed(
                          2
                        ) * 100
                      );

                      // TEAM 1 Away
                      const team1AwayAA = parseFloat(
                        (stats["AA"]["team1"]["away"] / juegosT1Away).toFixed(
                          2
                        ) * 100
                      );

                      // TEAM 2 HOME
                      const team2HomeAA = parseFloat(
                        (stats["AA"]["team2"]["home"] / juegosT2Home).toFixed(
                          2
                        ) * 100
                      );

                      const avgAAL = ((team1HomeAA + team2AwayAA) / 2).toFixed(
                        2
                      );
                      const avgAALV = (
                        (team1HomeAA +
                          team2AwayAA +
                          team1AwayAA +
                          team2HomeAA) /
                        4
                      ).toFixed(2);

                      const arr = [
                        [
                          avgGolesL,
                          avgGolesLV,
                          avgAAL,
                          avgAALV,
                          // team1HomeAA,
                          // team2AwayAA,
                          // team1AwayAA,
                          // team2HomeAA,
                          // team1Home,
                          // team2Away,
                          // team1Away,
                          // team2Home,
                        ],
                      ];

                      const excelData = arr
                        .map((lines) => lines.join("\t"))
                        .join("\n");
                      navigator.clipboard.writeText(excelData);
                    }}
                  >
                    Copy
                  </button>
                </div>
              );
            } else if (record.key === "AvgAA") {
              return <div className="total"></div>;
              //     <button
              //       onClick={() => {
              //         // TEAM 1 HOME
              //         const team1Home = parseFloat(
              //           (stats["AA"]["team1"]["home"] / juegosT1Home).toFixed(
              //             2
              //           ) * 100
              //         );

              //         // TEAM 2 Away
              //         const team2Away = parseFloat(
              //           (stats["AA"]["team2"]["away"] / juegosT2Away).toFixed(
              //             2
              //           ) * 100
              //         );

              //         // TEAM 1 Away
              //         const team1Away = parseFloat(
              //           (stats["AA"]["team1"]["away"] / juegosT1Away).toFixed(
              //             2
              //           ) * 100
              //         );

              //         // TEAM 2 HOME
              //         const team2Home = parseFloat(
              //           (stats["AA"]["team2"]["home"] / juegosT2Home).toFixed(
              //             2
              //           ) * 100
              //         );

              //         const arr = [
              //           [team1Home, team2Away, team1Away, team2Home],
              //         ];

              //         const excelData = arr
              //           .map((lines) => lines.join("\t"))
              //           .join("\n");
              //         navigator.clipboard.writeText(excelData);
              //       }}
              //     >
              //       Copy
              //     </button>
              //   </div>
              // );
            }
          },
        },
      ],
    },
  ];

  const colTotalTotal = [
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
    {
      title: (
        <div className="total">
          <span>Total</span>
        </div>
      ),
      children: [
        {
          title: <div className="equipo" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.total / stats["Juegos"].team1.total).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.total / stats["Juegos"].team2.total).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam1 !== avgTeam2) {
              if (!record.isDiff) {
                if (avgTeam1 > avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam1 < avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="total">
                <span>{icon}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Total</div>,
          render: (_, record) => {
            return (
              <div className="total">
                <span>{record.team1.total}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team1.total / stats["Juegos"].team1.total).toFixed(2)
            );
            return (
              <div className="total">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="total">
          <span>Total</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team2.total / stats["Juegos"].team2.total).toFixed(2)
            );
            return (
              <div className="total">
                <span>{avg}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="rival">Total</div>,
          render: (_, record) => {
            return (
              <div className="total">
                <span>{record.team2.total}</span>
              </div>
            );
          },
        },
        {
          title: <div className="rival" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.total / stats["Juegos"].team1.total).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.total / stats["Juegos"].team2.total).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam2 !== avgTeam1) {
              if (!record.isDiff) {
                if (avgTeam2 > avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam2 < avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="total">
                <span>{icon}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
  ];

  const colHomeAway = [
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
    {
      title: (
        <div className="home">
          <span>Home</span>
        </div>
      ),
      children: [
        {
          title: <div className="equipo" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.home / stats["Juegos"].team1.home).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.away / stats["Juegos"].team2.away).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam1 !== avgTeam2) {
              if (!record.isDiff) {
                if (avgTeam1 > avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam1 < avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="home">
                <span>{icon}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Total</div>,
          render: (_, record) => {
            return (
              <div className="home">
                <span>{record.team1.home}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team1.home / stats["Juegos"].team1.home).toFixed(2)
            );
            return (
              <div className="home">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="away">
          <span>Away</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team2.away / stats["Juegos"].team2.away).toFixed(2)
            );
            return (
              <div className="away">
                <span>{avg}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="rival">Total</div>,
          render: (_, record) => {
            return (
              <div className="away">
                <span>{record.team2.away}</span>
              </div>
            );
          },
        },
        {
          title: <div className="rival" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.home / stats["Juegos"].team1.home).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.away / stats["Juegos"].team2.away).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam2 !== avgTeam1) {
              if (!record.isDiff) {
                if (avgTeam2 > avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam2 < avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="away">
                <span>{icon}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
  ];

  const colHomeHome = [
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
    {
      title: (
        <div className="home">
          <span>Home</span>
        </div>
      ),
      children: [
        {
          title: <div className="equipo" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.home / stats["Juegos"].team1.home).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.home / stats["Juegos"].team2.home).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam1 !== avgTeam2) {
              if (!record.isDiff) {
                if (avgTeam1 > avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam1 < avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="home">
                <span>{icon}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Total</div>,
          render: (_, record) => {
            return (
              <div className="home">
                <span>{record.team1.home}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team1.home / stats["Juegos"].team1.home).toFixed(2)
            );
            return (
              <div className="home">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="home">
          <span>Home</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team2.home / stats["Juegos"].team2.home).toFixed(2)
            );
            return (
              <div className="home">
                <span>{avg}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="rival">Total</div>,
          render: (_, record) => {
            return (
              <div className="home">
                <span>{record.team2.home}</span>
              </div>
            );
          },
        },
        {
          title: <div className="rival" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.home / stats["Juegos"].team1.home).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.home / stats["Juegos"].team2.home).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam2 !== avgTeam1) {
              if (!record.isDiff) {
                if (avgTeam2 > avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam2 < avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="home">
                <span>{icon}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      render: (_, record) => {
        return (
          <Row
            className={record.esEquipo ? "equipo marcador" : "rival marcador"}
          >
            <span>{record.label}</span>
          </Row>
        );
      },
    },
  ];

  const colAwayHome = [
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
    {
      title: (
        <div className="away">
          <span>Away</span>
        </div>
      ),
      children: [
        {
          title: <div className="equipo" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.away / stats["Juegos"].team1.away).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.home / stats["Juegos"].team2.home).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam1 !== avgTeam2) {
              if (!record.isDiff) {
                if (avgTeam1 > avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam1 < avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="away">
                <span>{icon}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Total</div>,
          render: (_, record) => {
            return (
              <div className="away">
                <span>{record.team1.away}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team1.away / stats["Juegos"].team1.away).toFixed(2)
            );
            return (
              <div className="away">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="home">
          <span>Home</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team2.home / stats["Juegos"].team2.home).toFixed(2)
            );
            return (
              <div className="home">
                <span>{avg}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="rival">Total</div>,
          render: (_, record) => {
            return (
              <div className="home">
                <span>{record.team2.home}</span>
              </div>
            );
          },
        },
        {
          title: <div className="rival" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.away / stats["Juegos"].team1.away).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.home / stats["Juegos"].team2.home).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam2 !== avgTeam1) {
              if (!record.isDiff) {
                if (avgTeam2 > avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam2 < avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="home">
                <span>{icon}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
  ];

  const colAwayAway = [
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
    {
      title: (
        <div className="away">
          <span>Away</span>
        </div>
      ),
      children: [
        {
          title: <div className="equipo" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.away / stats["Juegos"].team1.away).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.away / stats["Juegos"].team2.away).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam1 !== avgTeam2) {
              if (!record.isDiff) {
                if (avgTeam1 > avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam1 < avgTeam2) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="away">
                <span>{icon}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Total</div>,
          render: (_, record) => {
            return (
              <div className="away">
                <span>{record.team1.away}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="equipo">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team1.away / stats["Juegos"].team1.away).toFixed(2)
            );
            return (
              <div className="away">
                <span>{avg}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      title: (
        <div className="away">
          <span>Away</span>
        </div>
      ),
      children: [
        {
          title: () => <div className="rival">Avg</div>,
          render: (_, record) => {
            let avg = parseFloat(
              (record.team2.away / stats["Juegos"].team2.away).toFixed(2)
            );
            return (
              <div className="away">
                <span>{avg}</span>
              </div>
            );
          },
        },
        {
          title: () => <div className="rival">Total</div>,
          render: (_, record) => {
            return (
              <div className="away">
                <span>{record.team2.away}</span>
              </div>
            );
          },
        },
        {
          title: <div className="rival" />,
          render: (_, record) => {
            let avgTeam1 = parseFloat(
              (record.team1.away / stats["Juegos"].team1.away).toFixed(2)
            );
            let avgTeam2 = parseFloat(
              (record.team2.away / stats["Juegos"].team2.away).toFixed(2)
            );
            let icon = "🟰";
            if (avgTeam2 !== avgTeam1) {
              if (!record.isDiff) {
                if (avgTeam2 > avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              } else {
                if (avgTeam2 < avgTeam1) {
                  icon = "✅";
                } else {
                  icon = "❌";
                }
              }
            }
            return (
              <div className="away">
                <span>{icon}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      render: (_, record) => {
        return (
          <Row className={record.esEquipo ? "equipo" : "rival"}>
            <span>{record.label}</span>
          </Row>
        );
      },
    },
  ];

  return (
    <div>
      <Affix>
        <Row
          gutter={[20, 0]}
          justify="center"
          align="middle"
          style={{
            backgroundColor: "#304b5d",
            color: "#fff",
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          <Col>
            <Link
              target={!isLoading ? "_blank" : null}
              to={!isLoading ? `/stats` : null}
              onClick={() => {
                localStorage.setItem("team", JSON.stringify(team1));
                localStorage.setItem("teamNum", "1");
                localStorage.setItem(
                  "stats",
                  JSON.stringify(Object.values(stats))
                );
              }}
            >
              <Row align="middle" gutter={[10, 0]} style={{ color: "#fff" }}>
                <Col>
                  <Avatar
                    shape="square"
                    size={25}
                    src={`https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_3,d_Competitors:default1.png/v5/Competitors/${team1.id}`}
                  />
                </Col>
                <Col>
                  <b>{team1.name}</b>
                </Col>
              </Row>
            </Link>
          </Col>
          <span>VS</span>
          <Col>
            <Link
              target={!isLoading ? "_blank" : null}
              to={!isLoading ? `/stats` : null}
              onClick={() => {
                localStorage.setItem("team", JSON.stringify(team2));
                localStorage.setItem("teamNum", "2");
                localStorage.setItem(
                  "stats",
                  JSON.stringify(Object.values(stats))
                );
              }}
            >
              <Row align="middle" gutter={[10, 0]} style={{ color: "#fff" }}>
                <Col>
                  <b>{team2.name}</b>
                </Col>
                <Col>
                  <Avatar
                    shape="square"
                    size={25}
                    src={`https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_3,d_Competitors:default1.png/v5/Competitors/${team2.id}`}
                  />
                </Col>
              </Row>
            </Link>
          </Col>
        </Row>
      </Affix>
      {isLoading ? (
        <Row justify="center" align="middle" style={{ minHeight: "87vh" }}>
          <Spin size="large" />
        </Row>
      ) : (
        <div>
          <Row justify="center">
            <Table
              columns={totalColumns}
              dataSource={customKeys}
              bordered={true}
              pagination={false}
              size="small"
              scroll={{ x: 0 }}
              style={{ padding: "30px 40px 0px 40px" }}
              rowClassName={(record) => record.class}
            />
          </Row>
          <br />
          <Row
            wrap={false}
            justify="space-between"
            style={{ overflow: "scroll", paddingBottom: "40px" }}
          >
            <Table
              columns={colTotalTotal}
              dataSource={Object.values(stats)}
              bordered={true}
              pagination={false}
              size="small"
              scroll={{ x: 0 }}
              style={{ padding: "0px 40px", marginLeft: "680px" }}
            />
            <Table
              columns={colHomeAway}
              dataSource={Object.values(stats)}
              bordered={true}
              pagination={false}
              size="small"
              scroll={{ x: 0 }}
              style={{ padding: "0px 40px" }}
            />
            <Table
              columns={colHomeHome}
              dataSource={Object.values(stats)}
              bordered={true}
              pagination={false}
              size="small"
              scroll={{ x: 0 }}
              style={{ padding: "0px 40px" }}
            />
            <Table
              columns={colAwayHome}
              dataSource={Object.values(stats)}
              bordered={true}
              pagination={false}
              size="small"
              scroll={{ x: 0 }}
              style={{ padding: "0px 40px" }}
            />
            <Table
              columns={colAwayAway}
              dataSource={Object.values(stats)}
              bordered={true}
              pagination={false}
              size="small"
              scroll={{ x: 0 }}
              style={{ padding: "0px 40px", marginRight: "355px" }}
            />
          </Row>
        </div>
      )}
    </div>
  );
}

// Funcion delay
async function delay(t) {
  return await new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}

// API GameStats
async function getStats(gameId) {
  // return await fetch(`https://webws.365scores.com/web/game/?appTypeId=5&langId=29&timezoneName=America/Mexico_City&userCountryId=31&gameId=${gameId}&topBookmaker=14`).then(async response => await response.json());
  return await fetch(
    `https://webws.365scores.com/web/game/stats/?appTypeId=5&langId=29&timezoneName=America/Mexico_City&userCountryId=31&games=${gameId}`
  ).then(async (response) => await response.json());
}

// API FIRST GAMES
async function getFirstGames(teamId) {
  return await fetch(
    `https://webws.365scores.com/web/games/results/?appTypeId=5&langId=10&timezoneName=America/Mexico_City&userCountryId=31&competitors=${teamId}&showOdds=true&includeTopBettingOpportunity=1&topBookmaker=14`
  ).then(async (response) => await response.json());
}

// async function getNextGames(teamId, lastGameId) {
//     return await fetch(`https://webws.365scores.com/web/games/?langId=29&timezoneId=79&userCountryId=31&apptype=5&competitors=${teamId}&games=1&aftergame=${lastGameId}&direction=-1&withmainodds=true`)
//         .then(async response => await response.json());
// }

// Obtener API Games
// async function addNextGames(teamId, lastGameId, seasonNum, firstResponse) {
//     await getNextGames(teamId, lastGameId).then(async (response) => {
//         // const lastIndex = response.games.length - 1;
//         let hasGame = false;
//         await response.games.forEach(game => {
//             if (game.seasonNum === seasonNum) {
//                 if (game.id < lastGameId) {
//                     lastGameId = game.id;
//                 }
//                 firstResponse.games.push(game);
//             }
//         });
//         if (hasGame) {
//             await new Promise(async resolve => setTimeout(resolve, 300));
//             await addNextGames(teamId, lastGameId, seasonNum, firstResponse);
//         }
//     });
//     return firstResponse;
// }

async function getGames(team, competitionId, seasonNum) {
  // let lastGameId;
  return await getFirstGames(team.id).then(async (response) => {
    // Filtramos solo los games de la season
    response.games = response.games.filter((game) => {
      return (
        // FILTRO DE LIGA -------->
        // game.competitionId === competitionId &&
        // FILTRO DE TEMPORADA -------->
        // game.seasonNum === seasonNum &&
        // FILTRO DE ID -------->
        // !isNaN(game.roundNum) &&
        // FILTRO RED CARDS -------->
        // game.homeCompetitor.redCards === 0 &&
        // (game.awayCompetitor.redCards === 0) &&
        // FILTRO DE SECRET -------->
        game.gameTime !== -1
      );
    });
    // Obtenemos el last gameId
    // lastGameId = response.games[response.games.length - 1].id;
    // Agregar los Juegos faltantes
    // await addNextGames(team.id, lastGameId, seasonNum, response).then(async fullResponse => {
    // Llenamos el arreglo de games
    response.games = response.games.slice(0, 16);
    return response.games;
  });
}

async function setTeamGames(team, stats, teamNum, games) {
  setGames(team, stats, teamNum, games);
  const responseData = [];
  await team.games
    .reduce(async function (promise, game) {
      return await promise.then(async function () {
        return await Promise.all([
          responseData.push(await getStats(game.id)),
          await delay(500),
        ]);
      });
    }, Promise.resolve())
    .then((_) => setGameStats(team, stats, teamNum, responseData));
}

// Llenar arreglo games
function setGames(team, stats, teamNum, games) {
  team.games = [];
  games.forEach((game) => {
    let _game = { stats: {} };
    _game.key = parseInt(game.roundNum);
    // if (isNaN(_game.key)) {
    //   _game.key = team.games.length + 1000;
    // }
    // GameId
    _game.id = parseInt(game.id);
    // Equipo esLocal
    _game.esLocal =
      parseInt(game.homeCompetitor.id) === parseInt(team.id) ? true : false;
    // homeCompetitor
    _game.local = game.homeCompetitor.name;
    // awayCompetitor
    _game.visitante = game.awayCompetitor.name;
    // Goles homeCompetitor
    _game.golesLocal = parseInt(game.homeCompetitor.score);
    // Goles awayCompetitor
    _game.golesVisitante = parseInt(game.awayCompetitor.score);
    // Total juegos local y visita
    stats["Juegos"][`team${teamNum}`].total++;
    if (_game.esLocal) {
      // Total juegos local
      stats["Juegos"][`team${teamNum}`].home++;
    } else {
      // Total juegos visita
      stats["Juegos"][`team${teamNum}`].away++;
    }
    // Resultado
    _game.stats["Victorias"] = 0;
    _game.stats["Empates"] = 0;
    _game.stats["Derrotas"] = 0;
    if (_game.golesLocal === _game.golesVisitante) {
      // Empate equipo
      _game.resultado = "empate";
      _game.stats["Empates"] = 1;
      // Total empates local y visita
      stats["Empates"][`team${teamNum}`].total++;
      if (_game.esLocal) {
        // Total empates local
        stats["Empates"][`team${teamNum}`].home++;
      } else {
        // Total empates visita
        stats["Empates"][`team${teamNum}`].away++;
      }
    } else if (_game.esLocal) {
      if (_game.golesLocal > _game.golesVisitante) {
        // Victoria equipo
        _game.resultado = "victoria";
        _game.stats["Victorias"] = 1;
        // Total victorias local y visita
        stats["Victorias"][`team${teamNum}`].total++;
        // Total victorias local
        stats["Victorias"][`team${teamNum}`].home++;
      } else {
        // Derrota equipo
        _game.resultado = "derrota";
        _game.stats["Derrotas"] = 1;
        // Total derrotas local y visita
        stats["Derrotas"][`team${teamNum}`].total++;
        // Total derrotas local
        stats["Derrotas"][`team${teamNum}`].home++;
      }
    } else if (_game.golesVisitante > _game.golesLocal) {
      // Victoria equipo
      _game.resultado = "victoria";
      _game.stats["Victorias"] = 1;
      // Total victorias local y visita
      stats["Victorias"][`team${teamNum}`].total++;
      // Total victorias visita
      stats["Victorias"][`team${teamNum}`].away++;
    } else {
      // Derrota equipo
      _game.resultado = "derrota";
      _game.stats["Derrotas"] = 1;
      // Total derrotas local y visita
      stats["Derrotas"][`team${teamNum}`].total++;
      // Total derrotas visita
      stats["Derrotas"][`team${teamNum}`].away++;
    }
    // Agregar al arreglo
    team.games.push(_game);
  });
}

function setGameStats(team, data, teamNum, response) {
  team.scorerPlayers = [];
  team.assistPlayers = [];
  team.forGolesDePenal = 0;
  team.againstGolesDePenal = 0;
  team.forGolesBefore45 = 0;
  team.againstGolesBefore45 = 0;
  team.forGolesAfter45 = 0;
  team.againstGolesAfter45 = 0;

  response?.forEach((result) => {
    try {
      const index = team.games.findIndex((g) => {
        console.log("game: ");
        console.log(g);
        console.log("result: ");
        console.log(result);
        return g.id === parseInt(result.games[0]?.id);
      });
      const homeCompetitor = result.games[0].homeCompetitor;
      const awayCompetitor = result.games[0].awayCompetitor;
      const esLocal = team.games[index].esLocal;
      team.games[index].goles = [];
      team.games[index].tarjetasAmarillas = [];
      team.games[index].tarjetasRojas = [];
      // GAME STATS
      setData(
        team.games[index],
        result.statistics,
        data,
        teamNum,
        esLocal,
        team.id
      );
      if (esLocal) {
        // GOLES EQUIPO
        team.games[index].stats["Goles"] = homeCompetitor.score;
        data["Goles"][`team${teamNum}`].total += homeCompetitor.score;
        data["Goles"][`team${teamNum}`][`home`] += homeCompetitor.score;
        // GOLES RIVAL
        team.games[index].stats["GolesR"] = awayCompetitor.score;
        data["GolesR"][`team${teamNum}`].total += awayCompetitor.score;
        data["GolesR"][`team${teamNum}`][`home`] += awayCompetitor.score;
        // PRECISIÓN EQUIPO
        team.games[index].stats["Precisión"] = parseFloat(
          (
            (team.games[index].stats["Pases completados"] /
              team.games[index].stats["Total de pases"]) *
            100
          ).toFixed(2)
        );
        data["Precisión"][`team${teamNum}`].total = parseFloat(
          (
            data["Precisión"][`team${teamNum}`].total +
            (data["Pases completados"][`team${teamNum}`].total /
              data["Total de pases"][`team${teamNum}`].total) *
              100
          ).toFixed(2)
        );
        data["Precisión"][`team${teamNum}`][`home`] = parseFloat(
          (
            data["Precisión"][`team${teamNum}`][`home`] +
            (data["Pases completados"][`team${teamNum}`][`home`] /
              data["Total de pases"][`team${teamNum}`][`home`]) *
              100
          ).toFixed(2)
        );
        // PRECISIÓN RIVAL
        team.games[index].stats["PrecisiónR"] = parseFloat(
          (
            (team.games[index].stats["Pases completadosR"] /
              team.games[index].stats["Total de pasesR"]) *
            100
          ).toFixed(2)
        );
        data["PrecisiónR"][`team${teamNum}`].total = parseFloat(
          (
            data["PrecisiónR"][`team${teamNum}`].total +
            (data["Pases completadosR"][`team${teamNum}`].total /
              data["Total de pasesR"][`team${teamNum}`].total) *
              100
          ).toFixed(2)
        );
        data["PrecisiónR"][`team${teamNum}`][`home`] = parseFloat(
          (
            data["PrecisiónR"][`team${teamNum}`][`home`] +
            (data["Pases completadosR"][`team${teamNum}`][`home`] /
              data["Total de pasesR"][`team${teamNum}`][`home`]) *
              100
          ).toFixed(2)
        );
        // DIFERENCIA
        const diferencia = homeCompetitor.score - awayCompetitor.score;
        team.games[index].stats["Diferencia"] = diferencia;
      } else {
        // GOLES EQUIPO
        team.games[index].stats["Goles"] = awayCompetitor.score;
        data["Goles"][`team${teamNum}`].total += awayCompetitor.score;
        data["Goles"][`team${teamNum}`][`away`] += awayCompetitor.score;
        // GOLES RIVAL
        team.games[index].stats["GolesR"] = homeCompetitor.score;
        data["GolesR"][`team${teamNum}`].total += homeCompetitor.score;
        data["GolesR"][`team${teamNum}`][`away`] += homeCompetitor.score;
        // PRECISIÓN EQUIPO
        team.games[index].stats["Precisión"] = parseFloat(
          (
            (team.games[index].stats["Pases completados"] /
              team.games[index].stats["Total de pases"]) *
            100
          ).toFixed(2)
        );
        data["Precisión"][`team${teamNum}`].total = parseFloat(
          (
            data["Precisión"][`team${teamNum}`].total +
            (data["Pases completados"][`team${teamNum}`].total /
              data["Total de pases"][`team${teamNum}`].total) *
              100
          ).toFixed(2)
        );
        data["Precisión"][`team${teamNum}`][`away`] = parseFloat(
          (
            data["Precisión"][`team${teamNum}`][`away`] +
            (data["Pases completados"][`team${teamNum}`][`away`] /
              data["Total de pases"][`team${teamNum}`][`away`]) *
              100
          ).toFixed(2)
        );
        // PRECISIÓN RIVAL
        team.games[index].stats["PrecisiónR"] = parseFloat(
          (
            (team.games[index].stats["Pases completadosR"] /
              team.games[index].stats["Total de pasesR"]) *
            100
          ).toFixed(2)
        );
        data["PrecisiónR"][`team${teamNum}`].total = parseFloat(
          (
            data["PrecisiónR"][`team${teamNum}`].total +
            (data["Pases completadosR"][`team${teamNum}`].total /
              data["Total de pasesR"][`team${teamNum}`].total) *
              100
          ).toFixed(2)
        );
        data["PrecisiónR"][`team${teamNum}`][`away`] = parseFloat(
          (
            data["PrecisiónR"][`team${teamNum}`][`away`] +
            (data["Pases completadosR"][`team${teamNum}`][`away`] /
              data["Total de pasesR"][`team${teamNum}`][`away`]) *
              100
          ).toFixed(2)
        );
        // DIFERENCIA
        const diferencia = awayCompetitor.score - homeCompetitor.score;
        team.games[index].stats["Diferencia"] = diferencia;
      }
      // AA
      const isAA = homeCompetitor.score > 0 && awayCompetitor.score > 0;
      if (isAA) {
        team.games[index].stats["AA"] = 1;
        data["AA"][`team${teamNum}`].total += 1;
        if (esLocal) {
          data["AA"][`team${teamNum}`].home += 1;
        } else {
          data["AA"][`team${teamNum}`].away += 1;
        }
      } else {
        team.games[index].stats["AA"] = 0;
      }
      // const members = result.game.members;
      // EVENTOS
      // result.game.events?.forEach((event) => {
      //     const esEquipo = event.competitorId === team.id;
      //     // EVENT GOLES
      //     if (event.eventType.id === 1) {
      //         const gameTime = parseInt(event.gameTime);
      //         team.games[index].goles.push({
      //             competitorId: event.competitorId,
      //             playerId: event.playerId,
      //             gameTime: gameTime,
      //         });
      //         if (esEquipo) {
      //             let _gol = {
      //                 key: team.games[index].key,
      //                 jornada: team.games[index].key,
      //                 resultado: team.games[index].resultado,
      //                 local: team.games[index].local,
      //                 golesLocal: team.games[index].golesLocal,
      //                 visitante: team.games[index].visitante,
      //                 esLocal: esLocal,
      //                 golesVisitante: team.games[index].golesVisitante,
      //                 gameTime: gameTime,
      //                 asistPlayerId: event.extraPlayers !== undefined ? event.extraPlayers[0] : null,
      //             }
      //             let indexGol = team.scorerPlayers.findIndex(player => player.playerId === event.playerId);
      //             if (indexGol !== -1) {
      //                 team.scorerPlayers[indexGol].goles.push(_gol);
      //             } else {
      //                 // const player = members.find(m => m.id === event.playerId);
      //                 // team.scorerPlayers.push(
      //                 //     {
      //                 //         playerId: player.id,
      //                 //         athleteId: player.athleteId,
      //                 //         name: player.name,
      //                 //         goles: [_gol],
      //                 //     }
      //                 // )
      //             }
      //         }
      //         //GOLES DE PENAL
      //         if (event.eventType.subTypeId === 3) {
      //             if (esEquipo) {
      //                 team.forGolesDePenal++;
      //             } else {
      //                 team.againstGolesDePenal++;
      //             }
      //         }
      //         // BEFORE AFTER MD
      //         if (gameTime <= 45) {
      //             if (esEquipo) {
      //                 team.forGolesBefore45++;
      //             } else {
      //                 team.againstGolesBefore45++;
      //             }
      //         } else {
      //             if (esEquipo) {
      //                 team.forGolesAfter45++;
      //             } else {
      //                 team.againstGolesAfter45++
      //             }
      //         }
      //         // ASISTENCIAS
      //         if (event.extraPlayers !== undefined) {
      //             if (esEquipo) {
      //                 let _assistance = {
      //                     key: team.games[index].key,
      //                     jornada: team.games[index].key,
      //                     resultado: team.games[index].resultado,
      //                     local: team.games[index].local,
      //                     golesLocal: team.games[index].golesLocal,
      //                     visitante: team.games[index].visitante,
      //                     esLocal: esLocal,
      //                     golesVisitante: team.games[index].golesVisitante,
      //                     gameTime: gameTime,
      //                 }
      //                 let indexAssist = team.assistPlayers.findIndex(player => player.playerId === event.extraPlayers[0]);
      //                 if (indexAssist !== -1) {
      //                     team.assistPlayers[indexAssist].assists.push(_assistance);
      //                 } else {
      //                     // const player = members.find(m => m.id === event.extraPlayers[0]);
      //                     // if (player !== undefined) {
      //                     //     team.assistPlayers.push(
      //                     //         {
      //                     //             playerId: player.id,
      //                     //             athleteId: player.athleteId,
      //                     //             name: player.name,
      //                     //             assists: [_assistance],
      //                     //         }
      //                     //     )
      //                     // }
      //                 }
      //             }
      //         }
      //     }
      //     // EVENT TARJETAS AMARILLAS
      //     if (event.eventType.id === 2) {
      //         team.games[index].tarjetasAmarillas.push({
      //             competitorId: event.competitorId,
      //             playerId: event.playerId,
      //             gameTime: parseInt(event.gameTime),
      //         });
      //     }
      //     // EVENT TARJETAS ROJAS
      //     if (event.eventType.id === 3) {
      //         team.games[index].tarjetasRojas.push({
      //             competitorId: event.competitorId,
      //             playerId: event.playerId,
      //             gameTime: parseInt(event.gameTime),
      //         });
      //     }
      // });
      // ALINEACION
      team.games[index].homeCompetitor = [];
      team.games[index].awayCompetitor = [];
      // result.game.homeCompetitor.lineups?.members.forEach(member => {
      //     team.games[index].homeCompetitor.push(setMemberStats(member, members, team.games[index].tarjetasAmarillas, team.games[index].tarjetasRojas));
      // });
      // result.game.awayCompetitor.lineups?.members.forEach(member => {
      //     team.games[index].awayCompetitor.push(setMemberStats(member, members, team.games[index].tarjetasAmarillas, team.games[index].tarjetasRojas));
      // });
    } catch (error) {}
  });
}

function setData(game, stats, data, teamNum, esLocal, teamId) {
  stats?.forEach((stat) => {
    switch (stat.name) {
      default:
        if (data.hasOwnProperty(stat.name)) {
          const value = parseInt(stat.value);
          if (stat.competitorId === teamId) {
            game.stats[stat.name] = value;
            data[stat.name][`team${teamNum}`]["total"] += value;
            if (esLocal) {
              data[stat.name][`team${teamNum}`][`home`] += value;
            } else {
              data[stat.name][`team${teamNum}`][`away`] += value;
            }
          } else if (
            stat.competitorId !== teamId &&
            data[stat.name].hasRStat !== false
          ) {
            game.stats[`${stat.name}R`] = value;
            data[`${stat.name}R`][`team${teamNum}`]["total"] += value;
            if (esLocal) {
              data[`${stat.name}R`][`team${teamNum}`][`home`] += value;
            } else {
              data[`${stat.name}R`][`team${teamNum}`][`away`] += value;
            }
          }
        }
        break;
    }
  });
}

function setMemberStats(member, members, tarjetasAmarillas, tarjetasRojas) {
  const auxMember = {};
  auxMember.key = member.id;
  auxMember.ranking = parseFloat(member.ranking);
  auxMember.ranking = auxMember.ranking > 0 ? auxMember.ranking : 0;
  auxMember.status = member.status;
  // INFO DEL JUGADOR
  const player = members.find((m) => m.id === auxMember.key);
  auxMember.athleteId = player.athleteId;
  auxMember.competitorId = player.competitorId;
  auxMember.name = player.name;
  auxMember.jerseyNumber = player.jerseyNumber;
  if (member.yardFormation !== undefined) {
    auxMember.yardFormationLine = member.yardFormation.line;
    auxMember.yardFormationFieldSide = member.yardFormation.fieldSide;
  }
  if (member.substitution !== undefined) {
    auxMember.substitutionPlayerId = member.substitution.playerId;
    auxMember.time = member.substitution.time;
  }
  if (member.stats !== undefined) {
    auxMember.stats = member.stats;
    member.stats.forEach((stat) => {
      switch (stat.name) {
        case "Minutes":
          auxMember.minutes = parseInt(stat.value);
          break;
        case "Goles":
          auxMember.goles = parseInt(stat.value);
          break;
        case "Asistencias":
          auxMember.asistencias = parseInt(stat.value);
          break;
        case "Total Remates":
          auxMember.totalRemates = parseInt(stat.value);
          break;
        case "Remates al arco":
          auxMember.rematesAPuerta = parseInt(stat.value);
          break;
        case "Remates Fuera":
          auxMember.rematesFuera = parseInt(stat.value);
          break;
        case "Pases completados":
          var arrayDeCadenas = stat.value.split("/");
          var arrayDeCadenas2 = arrayDeCadenas[1].split(" ");
          auxMember.totalPases = parseInt(arrayDeCadenas2[0]);
          auxMember.pasesCompletados = parseInt(arrayDeCadenas[0]);
          break;
        case "Faltas recibidas":
          auxMember.faltasRecibidas = parseInt(stat.value);
          break;
        case "Faltas cometidas":
          auxMember.faltasCometidas = parseInt(stat.value);
          break;
        default:
          break;
      }
    });
    // Tarjetas Amarillas
    auxMember.tarjetasAmarillas = tarjetasAmarillas.filter(
      (tarjeta) => tarjeta.playerId === auxMember.key
    ).length;
    // Tarjetas Rojas
    auxMember.tarjetasRojas = tarjetasRojas.filter(
      (tarjeta) => tarjeta.playerId === auxMember.key
    ).length;
  }
  return auxMember;
}

// ------------------------------------------------------------------------------------
// Inicializar arreglo total
function initData() {
  let auxData = [];
  auxData["Juegos"] = {
    key: "Juegos",
    label: "Juegos",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Victorias"] = {
    key: "Victorias",
    label: "Victorias",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Empates"] = {
    key: "Empates",
    label: "Empates",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Derrotas"] = {
    key: "Derrotas",
    label: "Derrotas",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["AA"] = {
    key: "AA",
    label: "AA",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Goles"] = {
    key: "Goles",
    label: "Goles",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["GolesR"] = {
    key: "GolesR",
    label: "Goles",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Total Remates"] = {
    key: "Total Remates",
    label: "Remates",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Total RematesR"] = {
    key: "Total RematesR",
    label: "Remates",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Remates al arco"] = {
    key: "Remates al arco",
    label: "R. Arco",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Remates al arcoR"] = {
    key: "Remates al arcoR",
    label: "R. Arco",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  // auxData["Remates Fuera"] = {
  //   key: "Remates Fuera",
  //   label: "R. Fuera",
  //   esEquipo: true,
  //   isDiff: false,
  //   team1: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  //   team2: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  // };
  // auxData["Remates FueraR"] = {
  //   key: "Remates FueraR",
  //   label: "R. Fuera",
  //   esEquipo: false,
  //   isDiff: true,
  //   team1: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  //   team2: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  // };
  // auxData["Remates bloqueados"] = {
  //   key: "Remates bloqueados",
  //   label: "R. Bloq",
  //   esEquipo: true,
  //   isDiff: false,
  //   team1: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  //   team2: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  // };
  // auxData["Remates bloqueadosR"] = {
  //   key: "Remates bloqueadosR",
  //   label: "R. Bloq",
  //   esEquipo: false,
  //   isDiff: true,
  //   team1: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  //   team2: {
  //     total: 0,
  //     home: 0,
  //     away: 0,
  //   },
  // };
  auxData["Salvadas de Portero"] = {
    key: "Salvadas de Portero",
    label: "Salv. Por",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Salvadas de PorteroR"] = {
    key: "Salvadas de PorteroR",
    label: "Salv. Por",
    esEquipo: false,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Posesión"] = {
    key: "Posesión",
    label: "Posesión",
    esEquipo: true,
    isDiff: false,
    hasRStat: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Total de pases"] = {
    key: "Total de pases",
    label: "Pases",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Total de pasesR"] = {
    key: "Total de pasesR",
    label: "Pases",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Precisión"] = {
    key: "Precisión",
    label: "Precisión",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["PrecisiónR"] = {
    key: "PrecisiónR",
    label: "Precisión",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Grandes chances"] = {
    key: "Grandes chances",
    label: "Gr. Chan",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Grandes chancesR"] = {
    key: "Grandes chancesR",
    label: "Gr. Chan",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Goles esperados"] = {
    key: "Goles esperados",
    label: "xG",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Goles esperadosR"] = {
    key: "Goles esperadosR",
    label: "xG",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };

  auxData["Pases completados"] = {
    key: "Pases completados",
    label: "P. Compl",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Pases completadosR"] = {
    key: "Pases completadosR",
    label: "P. Compl",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Fueras de Juego"] = {
    key: "Fueras de Juego",
    label: "F. Juego",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Fueras de JuegoR"] = {
    key: "Fueras de JuegoR",
    label: "F. Juego",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Saques de banda"] = {
    key: "Saques de banda",
    label: "Saq. Ban",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Saques de bandaR"] = {
    key: "Saques de bandaR",
    label: "Saq. Ban",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Saques de Esquina"] = {
    key: "Saques de Esquina",
    label: "Corners",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Saques de EsquinaR"] = {
    key: "Saques de EsquinaR",
    label: "Corners",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Centros al Área"] = {
    key: "Centros al Área",
    label: "Centros",
    esEquipo: true,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Centros al ÁreaR"] = {
    key: "Centros al ÁreaR",
    label: "Centros",
    esEquipo: false,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Faltas"] = {
    key: "Faltas",
    label: "Faltas",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["FaltasR"] = {
    key: "FaltasR",
    label: "Faltas",
    esEquipo: false,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Tarjetas Amarillas"] = {
    key: "Tarjetas Amarillas",
    label: "Tar. Am",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Tarjetas AmarillasR"] = {
    key: "Tarjetas AmarillasR",
    label: "Tar. Am",
    esEquipo: false,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Tarjetas Rojas"] = {
    key: "Tarjetas Rojas",
    label: "Tar. Roj",
    esEquipo: true,
    isDiff: true,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  auxData["Tarjetas RojasR"] = {
    key: "Tarjetas RojasR",
    label: "Tar. Roj",
    esEquipo: false,
    isDiff: false,
    team1: {
      total: 0,
      home: 0,
      away: 0,
    },
    team2: {
      total: 0,
      home: 0,
      away: 0,
    },
  };
  return auxData;
}
