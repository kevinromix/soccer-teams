import React, { useState } from 'react'
import { Avatar, Tooltip, Card, Col, Modal, Table, Row } from 'antd'

import ModalGoles from './ModalGoles';
import ModalAlineacion from './ModalAlineacion';
import Alineaciones from './Alineaciones';

export default function Stats() {

    const [team] = useState(JSON.parse(localStorage.getItem('team')));
    const [teamNum] = useState(localStorage.getItem('teamNum'));
    const [stats] = useState(JSON.parse(localStorage.getItem('stats')));

    const [isModalGolesOpen, setIsModalGolesOpen] = useState(false);
    const [isModalLineupOpen, setIsModalLineupOpen] = useState(false);
    const [isModalLineupsOpen, setIsModalLineupsOpen] = useState(false);
    const [keyJornada, setKeyJornada] = useState();
    // MODAL GOLES
    const showModalGoles = () => {
        setIsModalGolesOpen(true);
    };
    const closeModalGoles = () => {
        setIsModalGolesOpen(false);
    };
    // MODAL LINEUP
    const showModalLineup = (key) => {
        setKeyJornada(key);
        setIsModalLineupOpen(true);
    };
    const closeModalLineup = () => {
        setIsModalLineupOpen(false);
    };
    // ALINEACIONES
    const showModalLineups = () => {
        setIsModalLineupsOpen(true);
    };
    const closeModalLineups = () => {
        setIsModalLineupsOpen(false);
    };

    let customKeys = [
        {
            key: 'total',
            label: 'Total:'
        },
        {
            key: 'totalAvg',
            label: 'Avg Total:'
        },
        {
            key: 'home',
            label: 'Home:'
        },
        {
            key: 'homeAvg',
            label: 'Avg Local:'
        },
        {
            key: 'away',
            label: 'Away:'
        },
        {
            key: 'awayAvg',
            label: 'Avg Away:'
        },
    ];

    const totalColumns = [
        {
            key: 'key',
            fixed: 'left',
            width: 100,
            render: (text, record) => {
                return (
                    <Row className={`marcador`} >
                        <span>{record.label}</span>
                    </Row>
                );
            },
        }
    ].concat(
        Object.values(stats).map(t => {
            return {
                title: () => {
                    if (t.key === 'Goles') {
                        return (
                            <Card className='customCard equipo'
                                onClick={showModalGoles}
                                style={{ fontSize: 12 }}
                            >
                                <span>Goles</span>
                            </Card>
                        );
                    } else {
                        return <div className={t.esEquipo ? 'equipo' : 'rival'}>{t.label}</div>
                    }
                },
                width: 75,
                render: (record) => {
                    if (record.key.includes('Avg')) {
                        let _key = record.key.replace('Avg', '');
                        let avg = parseFloat((t[`team${teamNum}`][_key] / stats[0][`team${teamNum}`][_key]).toFixed(2));
                        return (
                            <span>{avg}</span>
                        );
                    } else {
                        return (
                            <span>{t[`team${teamNum}`][record.key]}</span>
                        );
                    }
                },
            }
        })
    );

    const columns = [
        {
            title: <Card
                className={`customCard`}
                onClick={
                    () => showModalLineups()
                }
            >
                <Row
                    gutter={[10, 0]}
                    // justify='center'
                    align='middle'
                    style={{
                        position: 'sticky',
                        left: '570px',
                        width: '500px'
                    }}>
                    <Col>
                        <b style={{
                            fontSize: '15px'
                        }}
                        >
                            {team.name}
                        </b>
                    </Col>
                    <Col>
                        <Avatar
                            shape='square'
                            size={25}
                            src={`https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_3,d_Competitors:default1.png/v5/Competitors/${team.id}`}
                        />
                    </Col>
                </Row>
            </Card>,
            children: [
                {
                    title: 'Jornada',
                    dataIndex: 'key',
                    rowScope: 'row',
                    width: 75,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Card className={`${record.resultado} customCard marcador`}
                                onClick={() => showModalLineup(record.key)}
                            >
                                <Row justify='center' style={{ fontSize: 13 }}>
                                    <span>{text}</span>
                                </Row>
                            </Card>
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
                    title: 'E. Local',
                    dataIndex: 'local',
                    rowScope: 'row',
                    width: 150,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador'>
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
                {
                    title: 'M',
                    dataIndex: 'golesLocal',
                    rowScope: 'row',
                    width: 40,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador'>
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
                {
                    title: 'M',
                    dataIndex: 'golesVisitante',
                    rowScope: 'row',
                    width: 40,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador'>
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
                {
                    title: 'E. Visitante',
                    dataIndex: 'visitante',
                    rowScope: 'row',
                    width: 150,
                    fixed: 'left',
                    render: (text, _) => {
                        return (
                            <Row className='marcador'>
                                <span>{text}</span>
                            </Row>
                        );
                    },
                }
            ].concat(
                Object.values(stats).slice(1).map(stat => {
                    return {
                        title: <div className={stat.esEquipo ? 'equipo' : 'rival'}>{stat.label}</div>,
                        width: 90,
                        render: (_, record) => {
                            if (stat.key === 'Goles') {
                                return (
                                    <Tooltip
                                        title={
                                            record.goles.map((gol, i) => {
                                                return gol.competitorId === team.id ?
                                                    <div key={i}>
                                                        <span>{gol.gameTime}</span>
                                                    </div>
                                                    :
                                                    <div key={i} />
                                            })
                                        }
                                    >
                                        <Row align='middle' justify='start'>
                                            <span>{record.stats[stat.key]}</span>
                                        </Row>
                                    </Tooltip>
                                )
                            } else if (stat.key === 'GolesR') {
                                return (
                                    <Tooltip
                                        title={
                                            record.goles.map((gol, i) => {
                                                return gol.competitorId !== team.id ?
                                                    <div key={i}>
                                                        <span>{gol.gameTime}</span>
                                                    </div>
                                                    :
                                                    <div key={i} />
                                            })
                                        }
                                    >
                                        <Row align='middle' justify='start'>
                                            <span>{record.stats[stat.key]}</span>
                                        </Row>
                                    </Tooltip>
                                )
                            } else if (stat.key === 'Tarjetas Rojas') {
                                return (
                                    <Tooltip
                                        title={
                                            record.tarjetasRojas.map((tarjeta, i) => {
                                                return tarjeta.competitorId === team.id ?
                                                    <div key={i}>
                                                        <span>{tarjeta.gameTime}</span>
                                                    </div>
                                                    :
                                                    <div key={i} />
                                            })
                                        }
                                    >
                                        <Row align='middle' justify='start'>
                                            <span>{record.stats[stat.key]}</span>
                                        </Row>
                                    </Tooltip>
                                )
                            } else if (stat.key === 'Tarjetas RojasR') {
                                return (
                                    <Tooltip
                                        title={
                                            record.tarjetasRojas.map((tarjeta, i) => {
                                                return tarjeta.competitorId !== team.id ?
                                                    <div key={i}>
                                                        <span>{tarjeta.gameTime}</span>
                                                    </div>
                                                    :
                                                    <div key={i} />
                                            })
                                        }
                                    >
                                        <Row align='middle' justify='start'>
                                            <span>{record.stats[stat.key]}</span>
                                        </Row>
                                    </Tooltip>
                                )
                            } else {
                                return <span>{record.stats[stat.key]}</span>
                            }
                        },
                        sorter: (a, b) => {
                            a = a.stats[stat.key];
                            b = b.stats[stat.key];
                            if (a > b) {
                                return -1
                            }
                            else if (a < b) {
                                return 1
                            }
                            return 0
                        },
                    };
                }),
            ),
        },
    ];

    return (
        <div>
            <Row justify="center">
                <Table
                    columns={totalColumns}
                    dataSource={customKeys}
                    bordered={true}
                    pagination={false}
                    size='small'
                    scroll={{ x: 0 }}
                    style={{ padding: "30px 40px 0px 40px" }}
                    rowClassName={record => record.key.includes('home') ? 'home' : record.key.includes('away') ? 'away' : 'total'}
                />
            </Row>
            <Row justify="center">
                <Table
                    columns={columns}
                    dataSource={team.games}
                    bordered={true}
                    pagination={false}
                    size='small'
                    scroll={{ x: 0 }}
                    style={{ padding: "30px 40px", }}
                    rowClassName={record => record.esLocal ? 'home' : 'away'}
                    sticky
                />
            </Row>
            <Modal
                open={isModalLineupsOpen}
                onOk={closeModalLineups}
                onCancel={closeModalLineups}
                width='96%'
                centered='false'
            >
                <Alineaciones
                    team={team}
                    teamNum={teamNum}
                />
            </Modal>
            <Modal open={isModalGolesOpen}
                onOk={closeModalGoles}
                onCancel={closeModalGoles}
                width='88%'
                centered='false'
            >
                <ModalGoles
                    team={team}
                    teamNum={teamNum}
                    stats={stats}
                />
            </Modal>
            <Modal
                open={isModalLineupOpen}
                onOk={closeModalLineup}
                onCancel={closeModalLineup}
                width='88%'
                centered='false'
            >
                <ModalAlineacion
                    team={team}
                    teamNum={teamNum}
                    keyJornada={keyJornada}
                />
            </Modal>
        </div>
    )
}