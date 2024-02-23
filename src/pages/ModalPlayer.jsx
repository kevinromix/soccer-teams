import React, { useState } from 'react'
import { Avatar, Table, Row } from 'antd'

export default function ModalPlayer(props) {
    const [team] = useState(props.team);

    const columnsT = [
        {
            dataIndex: 'key',
            rowScope: 'row',
            width: 100,
            fixed: 'left',
            render: (text, record) => {
                return (
                    <Row className={`marcador`} >
                        <span>{text}</span>
                    </Row>
                );
            },
        },
        {
            title: () => <div className='equipo'>Juegos</div>,
            dataIndex: 'juegos',
            rowScope: 'row',
            width: 70,
        },
        {
            title: () => <div className='equipo'>Minutes</div>,
            dataIndex: 'minutes',
            rowScope: 'row',
            width: 65,
        },
        {
            title: () => <div className='equipo'>Goles</div>,
            dataIndex: 'goles',
            rowScope: 'row',
            width: 55,
        },
        {
            title: () => <div className='equipo'>Asist</div>,
            dataIndex: 'asistencias',
            rowScope: 'row',
            width: 55,
        },
        {
            title: () => <div className='equipo'>Ranking</div>,
            dataIndex: 'ranking',
            rowScope: 'row',
            width: 65,
        },
        {
            title: () => <div className='equipo'>Remates</div>,
            dataIndex: 'totalRemates',
            rowScope: 'row',
            width: 70,
        },
        {
            title: () => <div className='equipo'>R. Arco</div>,
            dataIndex: 'rematesAPuerta',
            rowScope: 'row',
            width: 65,
        },
        {
            title: () => <div className='equipo'>R. Fuera</div>,
            dataIndex: 'rematesFuera',
            rowScope: 'row',
            width: 70,
        },
        {
            title: () => <div className='equipo'>Tot. Pases</div>,
            dataIndex: 'totalPases',
            rowScope: 'row',
            width: 80,
        },
        {
            title: () => <div className='equipo'>P. Compl</div>,
            dataIndex: 'pasesCompletados',
            rowScope: 'row',
            width: 70,
        },
        {
            title: () => <div className='equipo'>Falt. Recib</div>,
            dataIndex: 'faltasRecibidas',
            rowScope: 'row',
            width: 80,
        },
        {
            title: () => <div className='equipo'>Falt. Comet</div>,
            dataIndex: 'faltasCometidas',
            rowScope: 'row',
            width: 85,
        },
        {
            title: () => <div className='equipo'>T. Am</div>,
            dataIndex: 'tarjetasAmarillas',
            rowScope: 'row',
            width: 60,
        },
        {
            title: () => <div className='equipo'>T. Roj</div>,
            dataIndex: 'tarjetasRojas',
            rowScope: 'row',
            width: 60,
        },
    ];

    const columns = [
        {
            title: 'Jornada',
            dataIndex: 'key',
            rowScope: 'row',
            width: 60,
            fixed: 'left',
            render: (text, record) => {
                return (
                    <Row justify={'center'} className={`${record.resultado} marcador`} >
                        <span>{text}</span>
                    </Row>
                );
            },
            sorter: (a, b) => {
                if (a.key < b.key) {
                    return -1
                }
                else if (a.key > b.key) {
                    return 1
                }
                return 0
            },
        },
        {
            title: 'Local',
            children: [
                {
                    title: 'Equipo',
                    dataIndex: 'local',
                    rowScope: 'row',
                    width: 160,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador' >
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
                {
                    title: 'M',
                    dataIndex: 'golesLocal',
                    rowScope: 'row',
                    width: 30,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador' >
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
            ],
        },
        {
            title: 'Visitante',
            children: [
                {
                    title: 'M',
                    dataIndex: 'golesVisitante',
                    rowScope: 'row',
                    width: 30,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador' >
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
                {
                    title: 'Equipo',
                    dataIndex: 'visitante',
                    rowScope: 'row',
                    width: 160,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador' >
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
            ],
        },
        {
            title: 'Minutes',
            dataIndex: 'minutes',
            rowScope: 'row',
            width: 60,
            sorter: (a, b) => {
                if (a.minutes < b.minutes) {
                    return 1
                }
                else if (a.minutes > b.minutes) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Goles',
            dataIndex: 'goles',
            rowScope: 'row',
            width: 60,
            sorter: (a, b) => {
                if (a.goles < b.goles) {
                    return 1
                }
                else if (a.goles > b.goles) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Asist',
            dataIndex: 'asistencias',
            rowScope: 'row',
            width: 55,
            sorter: (a, b) => {
                if (a.asistencias < b.asistencias) {
                    return 1
                }
                else if (a.asistencias > b.asistencias) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Ranking',
            dataIndex: 'ranking',
            rowScope: 'row',
            width: 60,
            sorter: (a, b) => {
                if (a.ranking < b.ranking) {
                    return 1
                }
                else if (a.ranking > b.ranking) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Remates',
            dataIndex: 'totalRemates',
            rowScope: 'row',
            width: 65,
            sorter: (a, b) => {
                if (a.totalRemates < b.totalRemates) {
                    return 1
                }
                else if (a.totalRemates > b.totalRemates) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'R. Arco',
            dataIndex: 'rematesAPuerta',
            rowScope: 'row',
            width: 80,
            sorter: (a, b) => {
                if (a.rematesAPuerta < b.rematesAPuerta) {
                    return 1
                }
                else if (a.rematesAPuerta > b.rematesAPuerta) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'R. Fuera',
            dataIndex: 'rematesFuera',
            rowScope: 'row',
            width: 85,
            sorter: (a, b) => {
                if (a.rematesFuera < b.rematesFuera) {
                    return 1
                }
                else if (a.rematesFuera > b.rematesFuera) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Tot. Pases',
            dataIndex: 'totalPases',
            rowScope: 'row',
            width: 95,
            sorter: (a, b) => {
                if (a.totalPases < b.totalPases) {
                    return 1
                }
                else if (a.totalPases > b.totalPases) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'P. Compl',
            dataIndex: 'pasesCompletados',
            rowScope: 'row',
            width: 85,
            sorter: (a, b) => {
                if (a.pasesCompletados < b.pasesCompletados) {
                    return 1
                }
                else if (a.pasesCompletados > b.pasesCompletados) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Falt. Recib',
            dataIndex: 'faltasRecibidas',
            rowScope: 'row',
            width: 95,
            sorter: (a, b) => {
                if (a.faltasRecibidas < b.faltasRecibidas) {
                    return 1
                }
                else if (a.faltasRecibidas > b.faltasRecibidas) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Falt. Comet',
            dataIndex: 'faltasCometidas',
            rowScope: 'row',
            width: 105,
            sorter: (a, b) => {
                if (a.faltasCometidas < b.faltasCometidas) {
                    return 1
                }
                else if (a.faltasCometidas > b.faltasCometidas) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'T. Am',
            dataIndex: 'tarjetasAmarillas',
            rowScope: 'row',
            width: 70,
            sorter: (a, b) => {
                if (a.tarjetasAmarillas < b.tarjetasAmarillas) {
                    return 1
                }
                else if (a.tarjetasAmarillas > b.tarjetasAmarillas) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'T. Roj',
            dataIndex: 'tarjetasRojas',
            rowScope: 'row',
            width: 70,
            sorter: (a, b) => {
                if (a.tarjetasRojas < b.tarjetasRojas) {
                    return 1
                }
                else if (a.tarjetasRojas > b.tarjetasRojas) {
                    return -1
                }
                return 0
            },
        },
    ];

    let data = [];
    let dataT = [];
    let playerProfile;

    team.games.forEach((jornada) => {
        let auxData = {};
        auxData.key = jornada.key;
        auxData.local = jornada.local;
        auxData.golesLocal = jornada.golesLocal;
        auxData.golesVisitante = jornada.golesVisitante;
        auxData.visitante = jornada.visitante;
        auxData.esLocal = jornada.esLocal;
        auxData.resultado = jornada.resultado;
        let player;
        if (auxData.esLocal) {
            player = jornada.homeCompetitor.find(m => m.key === props.playerId);
        } else {
            player = jornada.awayCompetitor.find(m => m.key === props.playerId);
        }
        auxData.minutes = player?.minutes || 0;
        auxData.goles = player?.goles || 0;
        auxData.asistencias = player?.asistencias || 0;
        auxData.ranking = player?.ranking || 0;
        auxData.totalRemates = player?.totalRemates || 0;
        auxData.rematesAPuerta = player?.rematesAPuerta || 0;
        auxData.rematesFuera = player?.rematesFuera || 0;
        auxData.totalPases = player?.totalPases || 0;
        auxData.pasesCompletados = player?.pasesCompletados || 0;
        auxData.faltasRecibidas = player?.faltasRecibidas || 0;
        auxData.faltasCometidas = player?.faltasCometidas || 0;
        auxData.tarjetasAmarillas = player?.tarjetasAmarillas || 0;
        auxData.tarjetasRojas = player?.tarjetasRojas || 0;

        if (playerProfile === undefined) playerProfile = player
        data.push(auxData);
    });
    let auxDataT = { key: 'Total:' };
    let auxDataTP = { key: 'Promedio:' };
    let auxDataTL = { key: 'Tot. Local:' };
    let auxDataTPL = { key: 'Prom. Local:' };
    let auxDataTV = { key: 'Tot. Visita:' };
    let auxDataTPV = { key: 'Prom. Visita:' };
    data.forEach((value) => {
        // TOTAL
        auxDataT.minutes = (auxDataT.minutes || 0) + value.minutes;
        auxDataT.goles = (auxDataT.goles || 0) + value.goles;
        auxDataT.asistencias = (auxDataT.asistencias || 0) + value.asistencias;
        auxDataT.ranking = parseFloat(((auxDataT.ranking || 0) + value.ranking).toFixed(2));
        auxDataT.totalRemates = (auxDataT.totalRemates || 0) + value.totalRemates;
        auxDataT.rematesAPuerta = (auxDataT.rematesAPuerta || 0) + value.rematesAPuerta;
        auxDataT.rematesFuera = (auxDataT.rematesFuera || 0) + value.rematesFuera;
        auxDataT.totalPases = (auxDataT.totalPases || 0) + value.totalPases;
        auxDataT.pasesCompletados = (auxDataT.pasesCompletados || 0) + value.pasesCompletados;
        auxDataT.faltasRecibidas = (auxDataT.faltasRecibidas || 0) + value.faltasRecibidas;
        auxDataT.faltasCometidas = (auxDataT.faltasCometidas || 0) + value.faltasCometidas;
        auxDataT.tarjetasAmarillas = (auxDataT.tarjetasAmarillas || 0) + value.tarjetasAmarillas;
        auxDataT.tarjetasRojas = (auxDataT.tarjetasRojas || 0) + value.tarjetasRojas;
        if (value.esLocal) {
            // TOTAL LOCAL
            auxDataTL.minutes = (auxDataTL.minutes || 0) + value.minutes;
            auxDataTL.goles = (auxDataTL.goles || 0) + value.goles;
            auxDataTL.asistencias = (auxDataTL.asistencias || 0) + value.asistencias;
            auxDataTL.ranking = parseFloat(((auxDataTL.ranking || 0) + value.ranking).toFixed(2));
            auxDataTL.totalRemates = (auxDataTL.totalRemates || 0) + value.totalRemates;
            auxDataTL.rematesAPuerta = (auxDataTL.rematesAPuerta || 0) + value.rematesAPuerta;
            auxDataTL.rematesFuera = (auxDataTL.rematesFuera || 0) + value.rematesFuera;
            auxDataTL.totalPases = (auxDataTL.totalPases || 0) + value.totalPases;
            auxDataTL.pasesCompletados = (auxDataTL.pasesCompletados || 0) + value.pasesCompletados;
            auxDataTL.faltasRecibidas = (auxDataTL.faltasRecibidas || 0) + value.faltasRecibidas;
            auxDataTL.faltasCometidas = (auxDataTL.faltasCometidas || 0) + value.faltasCometidas;
            auxDataTL.tarjetasAmarillas = (auxDataTL.tarjetasAmarillas || 0) + value.tarjetasAmarillas;
            auxDataTL.tarjetasRojas = (auxDataTL.tarjetasRojas || 0) + value.tarjetasRojas;
        } else {
            // TOTAL VISITA
            auxDataTV.minutes = (auxDataTV.minutes || 0) + value.minutes;
            auxDataTV.goles = (auxDataTV.goles || 0) + value.goles;
            auxDataTV.asistencias = (auxDataTV.asistencias || 0) + value.asistencias;
            auxDataTV.ranking = parseFloat(((auxDataTV.ranking || 0) + value.ranking).toFixed(2));
            auxDataTV.totalRemates = (auxDataTV.totalRemates || 0) + value.totalRemates;
            auxDataTV.rematesAPuerta = (auxDataTV.rematesAPuerta || 0) + value.rematesAPuerta;
            auxDataTV.rematesFuera = (auxDataTV.rematesFuera || 0) + value.rematesFuera;
            auxDataTV.totalPases = (auxDataTV.totalPases || 0) + value.totalPases;
            auxDataTV.pasesCompletados = (auxDataTV.pasesCompletados || 0) + value.pasesCompletados;
            auxDataTV.faltasRecibidas = (auxDataTV.faltasRecibidas || 0) + value.faltasRecibidas;
            auxDataTV.faltasCometidas = (auxDataTV.faltasCometidas || 0) + value.faltasCometidas;
            auxDataTV.tarjetasAmarillas = (auxDataTV.tarjetasAmarillas || 0) + value.tarjetasAmarillas;
            auxDataTV.tarjetasRojas = (auxDataTV.tarjetasRojas || 0) + value.tarjetasRojas;
        }
    });
    // TOTAL JUEGOS
    const totalJuegos = data.length;
    const jugados = data.filter(d => d.ranking > 0).length;
    auxDataT.juegos = jugados;
    // TOTAL JUEGOS LOCAL
    const totalJuegosLocal = data.filter(d => d.esLocal).length;
    const jugadosLocal = data.filter(d => d.ranking > 0 && d.esLocal).length;
    auxDataTL.juegos = jugadosLocal;
    // TOTAL JUEGOS VISITA
    const totalJuegosVisita = totalJuegos - totalJuegosLocal;
    const jugadosVisita = jugados - jugadosLocal;
    auxDataTV.juegos = jugadosVisita;
    // TOTAL PROMEDIO
    auxDataTP.juegos = parseFloat((auxDataT.juegos / totalJuegos * 100).toFixed(2)) + "%";
    auxDataTP.minutes = Math.round(auxDataT.minutes / jugados);
    auxDataTP.goles = parseFloat((auxDataT.goles / jugados).toFixed(2));
    auxDataTP.asistencias = parseFloat((auxDataT.asistencias / jugados).toFixed(2));
    auxDataTP.ranking = parseFloat((auxDataT.ranking / jugados).toFixed(2));
    auxDataTP.totalRemates = parseFloat((auxDataT.totalRemates / jugados).toFixed(2));
    auxDataTP.rematesAPuerta = parseFloat((auxDataT.rematesAPuerta / jugados).toFixed(2));
    auxDataTP.rematesFuera = parseFloat((auxDataT.rematesFuera / jugados).toFixed(2));
    auxDataTP.totalPases = parseFloat((auxDataT.totalPases / jugados).toFixed(2));
    auxDataTP.pasesCompletados = parseFloat((auxDataT.pasesCompletados / jugados).toFixed(2));
    auxDataTP.faltasRecibidas = parseFloat((auxDataT.faltasRecibidas / jugados).toFixed(2));
    auxDataTP.faltasCometidas = parseFloat((auxDataT.faltasCometidas / jugados).toFixed(2));
    auxDataTP.tarjetasAmarillas = parseFloat((auxDataT.tarjetasAmarillas / jugados).toFixed(2));
    auxDataTP.tarjetasRojas = parseFloat((auxDataT.tarjetasRojas / jugados).toFixed(2));
    // TOTAL PROMEDIO LOCAL
    auxDataTPL.juegos = parseFloat((auxDataTL.juegos / totalJuegosLocal * 100).toFixed(2)) + "%";
    auxDataTPL.minutes = Math.round(auxDataTL.minutes / jugadosLocal);
    auxDataTPL.goles = parseFloat((auxDataTL.goles / jugadosLocal).toFixed(2));
    auxDataTPL.asistencias = parseFloat((auxDataTL.asistencias / jugadosLocal).toFixed(2));
    auxDataTPL.ranking = parseFloat((auxDataTL.ranking / jugadosLocal).toFixed(2));
    auxDataTPL.totalRemates = parseFloat((auxDataTL.totalRemates / jugadosLocal).toFixed(2));
    auxDataTPL.rematesAPuerta = parseFloat((auxDataTL.rematesAPuerta / jugadosLocal).toFixed(2));
    auxDataTPL.rematesFuera = parseFloat((auxDataTL.rematesFuera / jugadosLocal).toFixed(2));
    auxDataTPL.totalPases = parseFloat((auxDataTL.totalPases / jugadosLocal).toFixed(2));
    auxDataTPL.pasesCompletados = parseFloat((auxDataTL.pasesCompletados / jugadosLocal).toFixed(2));
    auxDataTPL.faltasRecibidas = parseFloat((auxDataTL.faltasRecibidas / jugadosLocal).toFixed(2));
    auxDataTPL.faltasCometidas = parseFloat((auxDataTL.faltasCometidas / jugadosLocal).toFixed(2));
    auxDataTPL.tarjetasAmarillas = parseFloat((auxDataTL.tarjetasAmarillas / jugadosLocal).toFixed(2));
    auxDataTPL.tarjetasRojas = parseFloat((auxDataTL.tarjetasRojas / jugadosLocal).toFixed(2));
    // TOTAL PROMEDIO VISITA
    auxDataTPV.juegos = parseFloat((auxDataTV.juegos / totalJuegosVisita * 100).toFixed(2)) + "%";
    auxDataTPV.minutes = Math.round(auxDataTV.minutes / jugadosVisita);
    auxDataTPV.goles = parseFloat((auxDataTV.goles / jugadosVisita).toFixed(2));
    auxDataTPV.asistencias = parseFloat((auxDataTV.asistencias / jugadosVisita).toFixed(2));
    auxDataTPV.ranking = parseFloat((auxDataTV.ranking / jugadosVisita).toFixed(2));
    auxDataTPV.totalRemates = parseFloat((auxDataTV.totalRemates / jugadosVisita).toFixed(2));
    auxDataTPV.rematesAPuerta = parseFloat((auxDataTV.rematesAPuerta / jugadosVisita).toFixed(2));
    auxDataTPV.rematesFuera = parseFloat((auxDataTV.rematesFuera / jugadosVisita).toFixed(2));
    auxDataTPV.totalPases = parseFloat((auxDataTV.totalPases / jugadosVisita).toFixed(2));
    auxDataTPV.pasesCompletados = parseFloat((auxDataTV.pasesCompletados / jugadosVisita).toFixed(2));
    auxDataTPV.faltasRecibidas = parseFloat((auxDataTV.faltasRecibidas / jugadosVisita).toFixed(2));
    auxDataTPV.faltasCometidas = parseFloat((auxDataTV.faltasCometidas / jugadosVisita).toFixed(2));
    auxDataTPV.tarjetasAmarillas = parseFloat((auxDataTV.tarjetasAmarillas / jugadosVisita).toFixed(2));
    auxDataTPV.tarjetasRojas = parseFloat((auxDataTV.tarjetasRojas / jugadosVisita).toFixed(2));

    dataT.push(auxDataT);
    dataT.push(auxDataTP);
    dataT.push(auxDataTL);
    dataT.push(auxDataTPL);
    dataT.push(auxDataTV);
    dataT.push(auxDataTPV);

    return (
        <>
            <div style={{ background: "#fff" }}>
                <Avatar
                    size={54}
                    src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${playerProfile.athleteId}`}
                />
                <span>{playerProfile.name}</span>
            </div>
            <Row justify="center">
                <Table
                    columns={columnsT}
                    dataSource={dataT}
                    bordered={true}
                    pagination={false}
                    loading={props.isLoading}
                    size='small'
                    scroll={{ x: 0 }}
                    rowClassName={record => record.key.includes('Local') ? 'home' : record.key.includes('Visita') ? 'away' : 'total'}
                />
            </Row>
            <Row justify="center">
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered={true}
                    pagination={false}
                    size='small'
                    scroll={{ x: 0 }}
                    style={{ paddingTop: "30px" }}
                    rowClassName={record => record.esLocal ? 'home' : 'away'}
                    sticky
                />
            </Row>
        </>
    );

}