import React, { useState } from 'react'
import { Avatar, Collapse, Card, Col, Flex, Modal, Table, Row } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons';
import ModalAlineacion from './ModalAlineacion';

// import ModalAlineacion from '../ModalAlineacion/ModalAlineacion';

export default function ModalGoles(props) {
    const [isModalLineupOpen, setIsModalLineupOpen] = useState(false);
    const [keyJornada, setKeyJornada] = useState();

    const team = props.team;
    const teamNum = props.teamNum;
    const stats = props.stats;

    let customStats = [];
    customStats.push(stats.find(s => s.key === 'Juegos'));
    customStats.push(stats.find(s => s.key === 'Victorias'));
    customStats.push(stats.find(s => s.key === 'Empates'));
    customStats.push(stats.find(s => s.key === 'Derrotas'));
    customStats.push(stats.find(s => s.key === 'Goles'));
    customStats.push(stats.find(s => s.key === 'GolesR'));
    customStats.push({
        key: 'Suma',
        label: 'Suma',
        esEquipo: null,
    });
    customStats.push(stats.find(s => s.key === 'AA'));

    const showModalLineup = (key) => {
        setKeyJornada(key);
        setIsModalLineupOpen(true);
    };
    const closeModalLineup = () => {
        setIsModalLineupOpen(false);
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
        },
    ].concat(
        Object.values(customStats).map(t => {
            return {
                title: <div className={t.esEquipo === null ? 'total' : t.esEquipo ? 'equipo' : 'rival'
                }> {t.label}</div >,
                width: 80,
                render: (record) => {
                    if (t.key === 'Suma') {
                        const indexGoles = customStats.findIndex(s => s.key === 'Goles');
                        const indexGolesR = customStats.findIndex(s => s.key === 'GolesR');
                        if (record.key.includes('Avg')) {
                            let _key = record.key.replace('Avg', '');
                            const suma = customStats[indexGoles][`team${teamNum}`][_key] + customStats[indexGolesR][`team${teamNum}`][_key];
                            const avg = parseFloat((suma / stats[0][`team${teamNum}`][_key]).toFixed(2));
                            return (
                                <span>{avg}</span>
                            );
                        } else {
                            const suma = customStats[indexGoles][`team${teamNum}`][record.key] + customStats[indexGolesR][`team${teamNum}`][record.key];
                            return (
                                <span>{suma}</span>
                            );
                        }
                    } else {
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
                    }
                },
            }
        })
    );

    const columns = [
        {
            title: <Row gutter={[10, 0]} justify="center" align='middle'>
                <Col>
                    <b style={{ fontSize: '15px' }}>{team.name}</b>
                </Col>
                <Col>
                    <Avatar
                        shape='square'
                        size={25}
                        src={`https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_3,d_Competitors:default1.png/v5/Competitors/${team.id}`}
                    />
                </Col>
            </Row>,
            children: [
                {
                    title: 'Jornada',
                    dataIndex: 'key',
                    // rowScope: 'row',
                    width: 60,
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
                    width: 160,
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
                    width: 30,
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
                    width: 30,
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
                    width: 160,
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
                    title: <div className='equipo'>Victorias</div>,
                    dataIndex: ['stats', 'Victorias'],
                    // rowScope: 'row',
                    // width: 70,
                    sorter: (a, b) => {
                        a = a.stats['Victorias'];
                        b = b.stats['Victorias'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: <div className='equipo'>Empates</div>,
                    dataIndex: ['stats', 'Empates'],
                    // rowScope: 'row',
                    // width: 70,
                    sorter: (a, b) => {
                        a = a.stats['Empates'];
                        b = b.stats['Empates'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: <div className='equipo'>Derrotas</div>,
                    dataIndex: ['stats', 'Derrotas'],
                    // rowScope: 'row',
                    // width: 70,
                    sorter: (a, b) => {
                        a = a.stats['Derrotas'];
                        b = b.stats['Derrotas'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: <div className='equipo'>Goles</div>,
                    dataIndex: ['stats', 'Goles'],
                    // rowScope: 'row',
                    // width: 70,
                    sorter: (a, b) => {
                        a = a.stats['Goles'];
                        b = b.stats['Goles'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: <div className='rival'>Goles</div>,
                    dataIndex: ['stats', 'GolesR'],
                    // rowScope: 'row',
                    // width: 70,
                    sorter: (a, b) => {
                        a = a.stats['GolesR'];
                        b = b.stats['GolesR'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: 'Suma',
                    // rowScope: 'row',
                    // width: 70,
                    render: (_, record) => {
                        return record.stats['Goles'] + record.stats['GolesR']
                    },
                    sorter: (a, b) => {
                        a = a.stats['Goles'] + a.stats['GolesR'];
                        b = b.stats['Goles'] + b.stats['GolesR'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: 'Diferencia',
                    dataIndex: ['stats', 'Diferencia'],
                    // rowScope: 'row',
                    width: 90,
                    sorter: (a, b) => {
                        a = a.stats['Diferencia'];
                        b = b.stats['Diferencia'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
                {
                    title: 'AA',
                    dataIndex: ['stats', 'AA'],
                    // rowScope: 'row',
                    // width: 70,
                    sorter: (a, b) => {
                        a = a.stats['AA'];
                        b = b.stats['AA'];
                        if (a > b) {
                            return -1
                        }
                        else if (a < b) {
                            return 1
                        }
                        return 0
                    },
                },
            ],
        },
    ];

    const columnsGoles = [
        {
            title: 'Jornada',
            dataIndex: 'jornada',
            rowScope: 'row',
            width: 50,
            fixed: 'left',
            render: (text, record) => {
                return (
                    <Row className={`${record.resultado} marcador`}
                        justify='center'
                    >
                        <span>{text}</span>
                    </Row>
                );
            },
            sorter: (a, b) => {
                if (a.jornada < b.jornada) {
                    return -1
                }
                else if (a.jornada > b.jornada) {
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
                    width: 100,
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
                    width: 30,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador'>
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
                            <Row className='marcador'>
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
                {
                    title: 'Equipo',
                    dataIndex: 'visitante',
                    rowScope: 'row',
                    width: 100,
                    fixed: 'left',
                    render: (text, record) => {
                        return (
                            <Row className='marcador'>
                                <span>{text}</span>
                            </Row>
                        );
                    },
                },
            ],
        },
        {
            title: 'Time',
            dataIndex: 'gameTime',
            rowScope: 'row',
            width: 70,
            sorter: (a, b) => {
                if (a.gameTime < b.gameTime) {
                    return 1
                }
                else if (a.gameTime > b.gameTime) {
                    return -1
                }
                return 0
            },
        },
    ];

    // Order Desc
    team.scorerPlayers.sort((a, b) => b.goles.length - a.goles.length);
    team.assistPlayers.sort((a, b) => b.assists.length - a.assists.length);

    const panelStyle = {
        marginBottom: 24,
        border: 'none',
    };

    return (
        <><Row justify="center">
            <Table
                columns={totalColumns}
                dataSource={customKeys}
                bordered={true}
                pagination={false}
                size='small'
                scroll={{ x: 0 }}
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
                    showSorterTooltip={false}
                    scroll={{ x: 0 }}
                    style={{ paddingTop: "30px" }}
                    rowClassName={record => record.esLocal ? 'home' : 'away'}
                    sticky
                />
            </Row>
            <br />
            <Row gutter={[10, 0]} align='middle'>
                <Col>
                    <b>GOLES DE PENAL A FAVOR:</b>
                </Col>
                <Col>
                    <span>{team.forGolesDePenal}</span>
                </Col>
                <Col>
                    <b>GOLES DE PENAL EN CONTRA:</b>
                </Col>
                <Col>
                    <span>{team.againstGolesDePenal}</span>
                </Col>
                <Col>
                    <b>GOLES DE PENAL EN TOTAL:</b>
                </Col>
                <Col>
                    <span>{(team.forGolesDePenal + team.againstGolesDePenal)}</span>
                </Col>
            </Row>
            <Row gutter={[10, 0]} align='middle'>
                <Col>
                    <b>GOLES A FAVOR A/M:</b>
                </Col>
                <Col>
                    <span>{team.forGolesBefore45}</span>
                </Col>
                <Col>
                    <b>GOLES EN CONTRA A/M:</b>
                </Col>
                <Col>
                    <span>{team.againstGolesBefore45}</span>
                </Col>
                <Col>
                    <b>GOLES EN TOTAL A/M:</b>
                </Col>
                <Col>
                    <span>{(team.forGolesBefore45 + team.againstGolesBefore45)}</span>
                </Col>
            </Row>
            <Row gutter={[10, 0]} align='middle'>
                <Col>
                    <b>GOLES A FAVOR D/M:</b>
                </Col>
                <Col>
                    <span>{team.forGolesAfter45}</span>
                </Col>
                <Col>
                    <b>GOLES EN CONTRA D/M:</b>
                </Col>
                <Col>
                    <span>{team.againstGolesAfter45}</span>
                </Col>
                <Col>
                    <b>GOLES EN TOTAL D/M:</b>
                </Col>
                <Col>
                    <span>{(team.forGolesAfter45 + team.againstGolesAfter45)}</span>
                </Col>
            </Row>
            <Row gutter={[38, 0]}>
                <Col>
                    <h2>GOLES</h2>
                    <Collapse
                        bordered={false}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        items={
                            team.scorerPlayers.map((record, index) => {
                                return {
                                    key: index,
                                    label: <Flex justify='space-between' align='center'>
                                        <div style={{ paddingRight: "30px" }}>
                                            <Avatar
                                                size={48}
                                                src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record.athleteId}`}
                                            />
                                            <span>{record.name}</span>
                                        </div>
                                        <span>{record.goles.length}</span>
                                    </Flex>,
                                    children: <Table
                                        columns={columnsGoles}
                                        dataSource={record.goles}
                                        bordered={true}
                                        pagination={false}
                                        size='small'
                                        rowClassName={record => record.esLocal ? 'home' : 'away'}
                                    />
                                    ,
                                    style: panelStyle,
                                };
                            })
                        }
                    />
                </Col>
                <Col>
                    <h2>ASISTENCIAS</h2>
                    <Collapse
                        bordered={false}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        items={
                            team.assistPlayers.map((record, index) => {
                                return {
                                    key: index,
                                    label: <Flex justify='space-between' align='center'>
                                        <div style={{ paddingRight: "30px" }}>
                                            <Avatar
                                                size={48}
                                                src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record.athleteId}`}
                                            />
                                            <span>{record.name}</span>
                                        </div>
                                        <span>{record.assists.length}</span>
                                    </Flex>,
                                    children: <Table
                                        columns={columnsGoles}
                                        dataSource={record.assists}
                                        bordered={true}
                                        pagination={false}
                                        size='small'
                                        rowClassName={record => record.esLocal ? 'home' : 'away'}
                                    />
                                    ,
                                    style: panelStyle,
                                };
                            })
                        }
                    />
                </Col>
            </Row>
            < Modal open={isModalLineupOpen}
                onOk={closeModalLineup}
                onCancel={closeModalLineup}
                width='60%'
                centered='false'
            >
                <ModalAlineacion
                    team={team}
                    teamNum={teamNum}
                    keyJornada={keyJornada}
                />
            </Modal >
        </>
    )
}