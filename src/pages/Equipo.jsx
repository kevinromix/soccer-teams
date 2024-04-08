import React, { useState, useEffect } from 'react'
import { Avatar, Row, Col, Spin } from 'antd'
import { useParams } from "react-router-dom";
import Stats from './Stats';

export default function Equipo(props) {
    const { customPath } = useParams();
    const [competitionId] = useState(props.competitionId(customPath));
    const seasonNum = parseInt(localStorage.getItem("seasonNum"));
    const [team1, setTeam1] = useState(JSON.parse(localStorage.getItem("team1")));
    const [isLoading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchData() {
            let _team1 = team1;
            let _stats = initData();
            await getGames(_team1, _stats, '1', competitionId, seasonNum).then(async _ => {
                localStorage.setItem("team", JSON.stringify(_team1));
                localStorage.setItem("teamNum", '1');
                localStorage.setItem("stats", JSON.stringify(Object.values(_stats)));
                setTeam1(_team1);
            }).then(async _ => {
                setLoading(false);
            }
            );
        }
        if (isLoading) {
            fetchData();
        }
    }, [competitionId, isLoading, seasonNum, team1]);

    return (
        <div>
            <Row justify='center' align='middle' gutter={[10, 0]}
                style={{
                    paddingTop: '15px',
                }}>
                <Col>
                    <Avatar
                        shape='square'
                        size={25}
                        src={`https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_3,d_Competitors:default1.png/v5/Competitors/${team1.id}`}
                    />
                </Col>
                <Col>
                    <b>{team1.name}</b>
                </Col>
            </Row>
            {
                isLoading ?
                    <Row justify='center' align='middle' style={{ minHeight: '87vh' }} >
                        <Spin size='large' />
                    </Row>
                    :
                    <Stats />
            }
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
    return await fetch(`https://webws.365scores.com/web/game/?appTypeId=5&langId=29&timezoneName=America/Mexico_City&userCountryId=31&gameId=${gameId}&topBookmaker=14`).then(async response => await response.json());
}

// Obtener API Games
async function getGames(team, stats, teamNum, competitionId, seasonNum) {
    const response = await fetch(`https://webws.365scores.com/web/games/results/?appTypeId=5&langId=29&timezoneName=America/Mexico_City&userCountryId=31&competitors=${team.id}&showOdds=true&includeTopBettingOpportunity=1&topBookmaker=14`).then(async (response) => await response.json());
    // Llenamos el arreglo de games
    setGames(team, stats, teamNum, competitionId, seasonNum, response.games);
    // Obtenemos las stats con el API
    const responseData = [];
    await team.games.reduce(async function (promise, game) {
        return await promise.then(async function () {
            return await Promise.all([
                responseData.push(await getStats(game.id)),
                await delay(50)
            ]);
        });
    }, Promise.resolve()).then(_ => setGameStats(team, stats, teamNum, responseData));
}

// Llenar arreglo games
function setGames(team, stats, teamNum, competitionId, seasonNum, games) {
    team.games = [];
    games.forEach(game => {
        // Si es un juego de la temporada
        if (game.competitionId === competitionId && game.seasonNum === seasonNum) {
            let _game = { stats: {} };
            _game.key = parseInt(game.roundNum);
            if (isNaN(_game.key)) {
                _game.key = team.games.length + 1000
            }
            // GameId
            _game.id = parseInt(game.id)
            // Equipo esLocal
            _game.esLocal = parseInt(game.homeCompetitor.id) === parseInt(team.id) ? true : false;
            // homeCompetitor
            _game.local = game.homeCompetitor.name;
            // awayCompetitor
            _game.visitante = game.awayCompetitor.name;
            // Goles homeCompetitor
            _game.golesLocal = parseInt(game.homeCompetitor.score);
            // Goles awayCompetitor
            _game.golesVisitante = parseInt(game.awayCompetitor.score);
            // Total juegos local y visita
            stats['Juegos'][`team${teamNum}`].total++;
            if (_game.esLocal) {
                // Total juegos local
                stats['Juegos'][`team${teamNum}`].home++;
            } else {
                // Total juegos visita
                stats['Juegos'][`team${teamNum}`].away++;
            }
            // Resultado
            _game.stats['Victorias'] = 0;
            _game.stats['Empates'] = 0;
            _game.stats['Derrotas'] = 0;
            if (_game.golesLocal === _game.golesVisitante) {
                // Empate equipo
                _game.resultado = 'empate';
                _game.stats['Empates'] = 1;
                // Total empates local y visita
                stats['Empates'][`team${teamNum}`].total++;
                if (_game.esLocal) {
                    // Total empates local
                    stats['Empates'][`team${teamNum}`].home++;
                } else {
                    // Total empates visita
                    stats['Empates'][`team${teamNum}`].away++;
                }
            } else if (_game.esLocal) {
                if (_game.golesLocal > _game.golesVisitante) {
                    // Victoria equipo
                    _game.resultado = 'victoria';
                    _game.stats['Victorias'] = 1;
                    // Total victorias local y visita
                    stats['Victorias'][`team${teamNum}`].total++;
                    // Total victorias local
                    stats['Victorias'][`team${teamNum}`].home++;
                } else {
                    // Derrota equipo
                    _game.resultado = 'derrota';
                    _game.stats['Derrotas'] = 1;
                    // Total derrotas local y visita
                    stats['Derrotas'][`team${teamNum}`].total++;
                    // Total derrotas local
                    stats['Derrotas'][`team${teamNum}`].home++;
                }
            } else if (_game.golesVisitante > _game.golesLocal) {
                // Victoria equipo
                _game.resultado = 'victoria';
                _game.stats['Victorias'] = 1;
                // Total victorias local y visita
                stats['Victorias'][`team${teamNum}`].total++;
                // Total victorias visita
                stats['Victorias'][`team${teamNum}`].away++;
            } else {
                // Derrota equipo
                _game.resultado = 'derrota';
                _game.stats['Derrotas'] = 1;
                // Total derrotas local y visita
                stats['Derrotas'][`team${teamNum}`].total++;
                // Total derrotas visita
                stats['Derrotas'][`team${teamNum}`].away++;
            }
            // Agregar al arreglo
            team.games.push(_game);
        }
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
        const index = team.games.findIndex(g => g.id === parseInt(result.game?.id));
        const homeCompetitor = result.game.homeCompetitor;
        const awayCompetitor = result.game.awayCompetitor;
        const esLocal = team.games[index].esLocal;
        team.games[index].goles = [];
        team.games[index].tarjetasAmarillas = [];
        team.games[index].tarjetasRojas = [];
        // GAME STATS
        if (esLocal) {
            const hoa = `home`;
            setData(
                team.games[index],
                homeCompetitor.statistics,
                homeCompetitor.score,
                data,
                teamNum,
                hoa,
                true,
            );
            setData(
                team.games[index],
                awayCompetitor.statistics,
                awayCompetitor.score,
                data,
                teamNum,
                hoa,
                false,
            );
            // DIFERENCIA
            const diferencia = homeCompetitor.score - awayCompetitor.score;
            team.games[index].stats['Diferencia'] = diferencia;
        } else {
            const hoa = `away`;
            setData(
                team.games[index],
                awayCompetitor.statistics,
                awayCompetitor.score,
                data,
                teamNum,
                hoa,
                true,
            );
            setData(
                team.games[index],
                homeCompetitor.statistics,
                homeCompetitor.score,
                data,
                teamNum,
                hoa,
                false,
            );
            // DIFERENCIA
            team.games[index].stats['Diferencia'] = awayCompetitor.score - homeCompetitor.score;
        }
        // AA
        const isAA = homeCompetitor.score > 0 && awayCompetitor.score > 0;
        if (isAA) {
            team.games[index].stats['AA'] = 1;
            data['AA'][`team${teamNum}`].total += 1;
            if (esLocal) {
                data['AA'][`team${teamNum}`].home += 1;
            } else {
                data['AA'][`team${teamNum}`].away += 1;
            }
        } else {
            team.games[index].stats['AA'] = 0;
        }
        const members = result.game.members;
        // EVENTOS
        result.game.events?.forEach((event) => {
            const esEquipo = event.competitorId === team.id;
            // EVENT GOLES
            if (event.eventType.id === 1) {
                const gameTime = parseInt(event.gameTime);
                team.games[index].goles.push({
                    competitorId: event.competitorId,
                    playerId: event.playerId,
                    gameTime: gameTime,
                });
                if (esEquipo) {
                    let _gol = {
                        key: team.games[index].key,
                        jornada: team.games[index].key,
                        resultado: team.games[index].resultado,
                        local: team.games[index].local,
                        golesLocal: team.games[index].golesLocal,
                        visitante: team.games[index].visitante,
                        esLocal: esLocal,
                        golesVisitante: team.games[index].golesVisitante,
                        gameTime: gameTime,
                        asistPlayerId: event.extraPlayers !== undefined ? event.extraPlayers[0] : null,
                    }
                    let indexGol = team.scorerPlayers.findIndex(player => player.playerId === event.playerId);
                    if (indexGol !== -1) {
                        team.scorerPlayers[indexGol].goles.push(_gol);
                    } else {
                        const player = members.find(m => m.id === event.playerId);
                        team.scorerPlayers.push(
                            {
                                playerId: player.id,
                                athleteId: player.athleteId,
                                name: player.name,
                                goles: [_gol],
                            }
                        )
                    }
                }
                //GOLES DE PENAL
                if (event.eventType.subTypeId === 3) {
                    if (esEquipo) {
                        team.forGolesDePenal++;
                    } else {
                        team.againstGolesDePenal++;
                    }
                }
                // BEFORE AFTER MD
                if (gameTime <= 45) {
                    if (esEquipo) {
                        team.forGolesBefore45++;
                    } else {
                        team.againstGolesBefore45++;
                    }
                } else {
                    if (esEquipo) {
                        team.forGolesAfter45++;
                    } else {
                        team.againstGolesAfter45++
                    }
                }
                // ASISTENCIAS
                if (event.extraPlayers !== undefined) {
                    if (esEquipo) {
                        let _assistance = {
                            key: team.games[index].key,
                            jornada: team.games[index].key,
                            resultado: team.games[index].resultado,
                            local: team.games[index].local,
                            golesLocal: team.games[index].golesLocal,
                            visitante: team.games[index].visitante,
                            esLocal: esLocal,
                            golesVisitante: team.games[index].golesVisitante,
                            gameTime: gameTime,
                        }
                        let indexAssist = team.assistPlayers.findIndex(player => player.playerId === event.extraPlayers[0]);
                        if (indexAssist !== -1) {
                            team.assistPlayers[indexAssist].assists.push(_assistance);
                        } else {
                            const player = members.find(m => m.id === event.extraPlayers[0]);
                            if (player !== undefined) {
                                team.assistPlayers.push(
                                    {
                                        playerId: player.id,
                                        athleteId: player.athleteId,
                                        name: player.name,
                                        assists: [_assistance],
                                    }
                                )
                            }
                        }
                    }
                }
            }
            // EVENT TARJETAS AMARILLAS
            if (event.eventType.id === 2) {
                team.games[index].tarjetasAmarillas.push({
                    competitorId: event.competitorId,
                    playerId: event.playerId,
                    gameTime: parseInt(event.gameTime),
                });
            }
            // EVENT TARJETAS ROJAS
            if (event.eventType.id === 3) {
                team.games[index].tarjetasRojas.push({
                    competitorId: event.competitorId,
                    playerId: event.playerId,
                    gameTime: parseInt(event.gameTime),
                });
            }
        });
        // ALINEACION
        team.games[index].homeCompetitor = [];
        team.games[index].awayCompetitor = [];
        result.game.homeCompetitor.lineups?.members.forEach(member => {
            team.games[index].homeCompetitor.push(setMemberStats(member, members, team.games[index].tarjetasAmarillas, team.games[index].tarjetasRojas));
        });
        result.game.awayCompetitor.lineups?.members.forEach(member => {
            team.games[index].awayCompetitor.push(setMemberStats(member, members, team.games[index].tarjetasAmarillas, team.games[index].tarjetasRojas));
        });
    });
}

function setData(game, stats, score, data, teamNum, hOA, esEquipo) {
    stats?.forEach((stat) => {
        switch (stat.name) {
            default:
                if (data.hasOwnProperty(stat.name)) {
                    const value = parseInt(stat.value);
                    if (esEquipo) {
                        game.stats[stat.name] = value;
                        data[stat.name][`team${teamNum}`]['total'] += value;
                        data[stat.name][`team${teamNum}`][`${hOA}`] += value;
                    }
                    else {
                        game.stats[`${stat.name}R`] = value;
                        data[`${stat.name}R`][`team${teamNum}`]['total'] += value;
                        data[`${stat.name}R`][`team${teamNum}`][`${hOA}`] += value;
                    }
                }
                break;
        }
    });
    if (esEquipo) {
        // Goles
        game.stats['Goles'] = score;
        data['Goles'][`team${teamNum}`].total += score;
        data['Goles'][`team${teamNum}`][`${hOA}`] += score;
        // Precisión
        game.stats['Precisión'] = parseFloat((game.stats['Pases completados'] / game.stats['Total de pases'] * 100).toFixed(2));
        data['Precisión'][`team${teamNum}`].total = parseFloat((data['Precisión'][`team${teamNum}`].total + (data['Pases completados'][`team${teamNum}`].total / data['Total de pases'][`team${teamNum}`].total * 100)).toFixed(2));
        data['Precisión'][`team${teamNum}`][`${hOA}`] = parseFloat((data['Precisión'][`team${teamNum}`][`${hOA}`] + (data['Pases completados'][`team${teamNum}`][`${hOA}`] / data['Total de pases'][`team${teamNum}`][`${hOA}`] * 100)).toFixed(2));
    }
    else {
        // Goles
        game.stats['GolesR'] = score;
        data['GolesR'][`team${teamNum}`].total += score;
        data['GolesR'][`team${teamNum}`][`${hOA}`] += score;
        // Precisión
        game.stats['PrecisiónR'] = parseFloat((game.stats['Pases completadosR'] / game.stats['Total de pasesR'] * 100).toFixed(2));
        data['PrecisiónR'][`team${teamNum}`].total = parseFloat((data.PrecisiónR[`team${teamNum}`].total + (data['Pases completadosR'][`team${teamNum}`].total / data['Total de pasesR'][`team${teamNum}`].total * 100)).toFixed(2));
        data['PrecisiónR'][`team${teamNum}`][`${hOA}`] = parseFloat((data.PrecisiónR[`team${teamNum}`][`${hOA}`] + (data['Pases completadosR'][`team${teamNum}`][`${hOA}`] / data['Total de pasesR'][`team${teamNum}`][`${hOA}`] * 100)).toFixed(2));
    }
}

function setMemberStats(member, members, tarjetasAmarillas, tarjetasRojas) {
    const auxMember = {}
    auxMember.key = member.id;
    auxMember.ranking = parseFloat(member.ranking);
    auxMember.ranking = auxMember.ranking > 0 ? auxMember.ranking : 0;
    auxMember.status = member.status;
    // INFO DEL JUGADOR
    const player = members.find(m => m.id === auxMember.key);
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
                case "Remates a Puerta":
                    auxMember.rematesAPuerta = parseInt(
                        stat.value);
                    break;
                case "Remates Fuera":
                    auxMember.rematesFuera = parseInt(stat.value);
                    break;
                case "Pases completados":
                    var arrayDeCadenas = stat.value.split('/');
                    var arrayDeCadenas2 = arrayDeCadenas[1].split(' ');
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
        auxMember.tarjetasAmarillas = tarjetasAmarillas.filter(tarjeta => tarjeta.playerId === auxMember.key).length;
        // Tarjetas Rojas
        auxMember.tarjetasRojas = tarjetasRojas.filter(tarjeta => tarjeta.playerId === auxMember.key).length;
    }
    return auxMember;
}

// ------------------------------------------------------------------------------------
// Inicializar arreglo total
function initData() {
    let auxData = [];
    auxData['Juegos'] = {
        key: 'Juegos',
        label: 'Juegos',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Victorias'] = {
        key: 'Victorias',
        label: 'Victorias',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Empates'] = {
        key: 'Empates',
        label: 'Empates',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Derrotas'] = {
        key: 'Derrotas',
        label: 'Derrotas',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['AA'] = {
        key: 'AA',
        label: 'AA',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Goles'] = {
        key: 'Goles',
        label: 'Goles',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['GolesR'] = {
        key: 'GolesR',
        label: 'Goles',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Goles esperados'] = {
        key: 'Goles esperados',
        label: 'xG',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Goles esperadosR'] = {
        key: 'Goles esperadosR',
        label: 'xG',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Grandes chances'] = {
        key: 'Grandes chances',
        label: 'Gr. Chan',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Grandes chancesR'] = {
        key: 'Grandes chancesR',
        label: 'Gr. Chan',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Posesión'] = {
        key: 'Posesión',
        label: 'Posesión',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['PosesiónR'] = {
        key: 'PosesiónR',
        label: 'Posesión',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Ataques'] = {
        key: 'Ataques',
        label: 'Ataques',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['AtaquesR'] = {
        key: 'AtaquesR',
        label: 'Ataques',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Total Remates'] = {
        key: 'Total Remates',
        label: 'Remates',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Total RematesR'] = {
        key: 'Total RematesR',
        label: 'Remates',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Remates a Puerta'] = {
        key: 'Remates a Puerta',
        label: 'R. Arco',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Remates a PuertaR'] = {
        key: 'Remates a PuertaR',
        label: 'R. Arco',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Remates Fuera'] = {
        key: 'Remates Fuera',
        label: 'R. Fuera',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Remates FueraR'] = {
        key: 'Remates FueraR',
        label: 'R. Fuera',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Remates bloqueados'] = {
        key: 'Remates bloqueados',
        label: 'R. Bloq',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Remates bloqueadosR'] = {
        key: 'Remates bloqueadosR',
        label: 'R. Bloq',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Salvadas de Portero'] = {
        key: 'Salvadas de Portero',
        label: 'Salv. Por',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Salvadas de PorteroR'] = {
        key: 'Salvadas de PorteroR',
        label: 'Salv. Por',
        esEquipo: false,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Pelotas al poste'] = {
        key: 'Pelotas al poste',
        label: 'P. Poste',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Pelotas al posteR'] = {
        key: 'Pelotas al posteR',
        label: 'P. Poste',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Asistencias esperadas'] = {
        key: 'Asistencias esperadas',
        label: 'Asis. Esp',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Asistencias esperadasR'] = {
        key: 'Asistencias esperadasR',
        label: 'Asis. Esp',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de Esquina'] = {
        key: 'Saques de Esquina',
        label: 'Corners',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de EsquinaR'] = {
        key: 'Saques de EsquinaR',
        label: 'Corners',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Centros al Área'] = {
        key: 'Centros al Área',
        label: 'Centros',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Centros al ÁreaR'] = {
        key: 'Centros al ÁreaR',
        label: 'Centros',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Fueras de Juego'] = {
        key: 'Fueras de Juego',
        label: 'F. Juego',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Fueras de JuegoR'] = {
        key: 'Fueras de JuegoR',
        label: 'F. Juego',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Total de pases'] = {
        key: 'Total de pases',
        label: 'Pases',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Total de pasesR'] = {
        key: 'Total de pasesR',
        label: 'Pases',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Precisión'] = {
        key: 'Precisión',
        label: 'Precisión',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['PrecisiónR'] = {
        key: 'PrecisiónR',
        label: 'Precisión',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Pases completados'] = {
        key: 'Pases completados',
        label: 'P. Compl',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Pases completadosR'] = {
        key: 'Pases completadosR',
        label: 'P. Compl',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Faltas'] = {
        key: 'Faltas',
        label: 'Faltas',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['FaltasR'] = {
        key: 'FaltasR',
        label: 'Faltas',
        esEquipo: false,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de falta'] = {
        key: 'Saques de falta',
        label: 'Saq. Fal',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de faltaR'] = {
        key: 'Saques de faltaR',
        label: 'Saq. Fal',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Barridas'] = {
        key: 'Barridas',
        label: 'Barridas',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['BarridasR'] = {
        key: 'BarridasR',
        label: 'Barridas',
        esEquipo: false,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de banda'] = {
        key: 'Saques de banda',
        label: 'Saq. Ban',
        esEquipo: true,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de bandaR'] = {
        key: 'Saques de bandaR',
        label: 'Saq. Ban',
        esEquipo: false,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de puerta'] = {
        key: 'Saques de puerta',
        label: 'Saq. Pue',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Saques de puertaR'] = {
        key: 'Saques de puertaR',
        label: 'Saq. Pue',
        esEquipo: false,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Tarjetas Amarillas'] = {
        key: 'Tarjetas Amarillas',
        label: 'Tar. Am',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Tarjetas AmarillasR'] = {
        key: 'Tarjetas AmarillasR',
        label: 'Tar. Am',
        esEquipo: false,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Tarjetas Rojas'] = {
        key: 'Tarjetas Rojas',
        label: 'Tar. Roj',
        esEquipo: true,
        isDiff: true,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    auxData['Tarjetas RojasR'] = {
        key: 'Tarjetas RojasR',
        label: 'Tar. Roj',
        esEquipo: false,
        isDiff: false,
        team1: {
            total: 0,
            home: 0,
            away: 0,
        },
    };
    return auxData;
}