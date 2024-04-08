import React, { useState } from 'react'
import { Avatar, Card, Badge, Image, Table, Col, Row, Modal } from 'antd';

import ModalPlayer from './ModalPlayer';

export default function ModalAlineacion(props) {
    const [team] = useState(props.team);
    const [competitorId] = useState(team.id);
    const [playerId, setPlayerId] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (id) => {
        setPlayerId(id);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    function setAlineacion(members, fieldArray, substitutes, esLocal) {
        // Es titular
        members.forEach(member => {
            if (member.status === 1) {
                if (member.yardFormationFieldSide === 20)
                    member.yardFormationFieldSide = 0;
                if (member.yardFormationFieldSide === 33)
                    member.yardFormationFieldSide = 25;
                if (member.yardFormationFieldSide === 66)
                    member.yardFormationFieldSide = 75;
                if (member.yardFormationFieldSide === 80)
                    member.yardFormationFieldSide = 100;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].key = member.key;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].athleteId = member.athleteId;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].competitorId = member.competitorId;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].name = member.name;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].ranking = member.ranking;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].image = member.image;
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].hasAmarilla = member.tarjetasAmarillas > 0; //tarjetasAmarillas.some(t => t.playerId === member.key);
                fieldArray[(member.yardFormationLine - 1)][member.yardFormationFieldSide].hasRoja = member.tarjetasRojas > 0;//tarjetasRojas.some(t => t.playerId === member.key);
            }
            if (member.status === 2 && member.substitutionPlayerId !== undefined) {
                let record = {
                    key: member.key,
                    substitute: {},
                    substituted: {},
                }
                record.substitute = {
                    key: member.key,
                    esLocal: esLocal,
                    athleteId: member.athleteId,
                    competitorId: member.competitorId,
                    name: member.name,
                    ranking: member.ranking,
                    image: member.image,
                    hasAmarilla: member.tarjetasAmarillas > 0,
                    hasRoja: member.tarjetasRojas > 0,
                    time: member.time,
                };
                const substituted = members.find(m => m.key === member.substitutionPlayerId);
                record.substituted = {
                    key: substituted.key,
                    esLocal: esLocal,
                    athleteId: substituted.athleteId,
                    competitorId: substituted.competitorId,
                    name: substituted.name,
                    ranking: substituted.ranking,
                    image: substituted.image,
                    hasAmarilla: substituted.tarjetasAmarillas > 0,
                    hasRoja: substituted.tarjetasRojas > 0,
                }
                substitutes.push(record);
            }
        });
    }

    const columns = [
        {
            dataIndex: 100,
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record[100].name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record[100].competitorId === competitorId ? () => showModal(record[100].key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record[100].ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record[100].hasAmarilla & record[100].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record[100].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record[100].hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record[100].athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record[100].name}</span>
                            </Row>
                        </Card>
                );
            },
        },
        {
            dataIndex: 75,
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record[75].name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record[75].competitorId === competitorId ? () => showModal(record[75].key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record[75].ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record[75].hasAmarilla & record[75].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record[75].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record[75].hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record[75].athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record[75].name}</span>
                            </Row>
                        </Card>
                );
            },
        },
        {
            dataIndex: 50,
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record[50].name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record[50].competitorId === competitorId ? () => showModal(record[50].key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record[50].ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record[50].hasAmarilla & record[50].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record[50].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record[50].hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record[50].athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record[50].name}</span>
                            </Row>
                        </Card >
                );
            },
        },
        {
            dataIndex: 25,
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record[25].name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record[25].competitorId === competitorId ? () => showModal(record[25].key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record[25].ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record[25].hasAmarilla & record[25].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record[25].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record[25].hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record[25].athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record[25].name}</span>
                            </Row>
                        </Card>
                );
            },
        },
        {
            dataIndex: 0,
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record[0].name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record[0].competitorId === competitorId ? () => showModal(record[0].key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record[0].ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record[0].hasAmarilla & record[0].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record[0].hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record[0].hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record[0].athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record[0].name}</span>
                            </Row>
                        </Card>
                );
            },
        },
    ];

    const columnsSub = [
        {
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record.substitute.name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record.substitute.competitorId === competitorId ? () => showModal(record.substitute.key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record.substitute.ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record.substitute.hasAmarilla & record.substitute.hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record.substitute.hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record.substitute.hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record.substitute.athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record.substitute.name}</span>
                            </Row>
                        </Card>
                );
            },
        },
        {
            rowScope: 'row',
            render: (text, record) => {
                return (
                    <Row justify={'center'}>
                        <span>{record.substitute.time}</span>
                    </Row>
                );
            },
        },
        {
            rowScope: 'row',
            render: (text, record) => {
                return (
                    record.substituted.name === undefined ? <div className='none' /> :
                        <Card className='customCard'
                            onClick={
                                record.substituted.competitorId === competitorId ? () => showModal(record.substituted.key) : null
                            }
                        >
                            <Row justify={'center'}>
                                <Badge offset={[-54, 46]}
                                    count={record.substituted.ranking}
                                >
                                    <Badge offset={[0, 10]}
                                        count={
                                            <Image
                                                preview={false}
                                                className='arbitro'
                                                src={
                                                    record.substituted.hasAmarilla & record.substituted.hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-to-red-right.svg" : record.substituted.hasRoja ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/red-card-right.svg" : record.substituted.hasAmarilla ? "https://ssl.gstatic.com/onebox/sports/soccer_timeline/yellow-card-right.svg" : ""}
                                            />
                                        }
                                    >
                                        <Avatar
                                            size={54}
                                            src={`https://imagecache.365scores.com/image/upload/f_png,w_32,h_32,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v5/Athletes/${record.substituted.athleteId}`}
                                        />
                                    </Badge>
                                </Badge>
                            </Row>
                            <Row justify={'center'}>
                                <span>{record.substituted.name}</span>
                            </Row>
                        </Card>
                );
            },
        },
    ];

    function resetData(esLocal) {
        return [
            {
                key: 1,
                esLocal: esLocal,
                0: {},
                25: {},
                50: {},
                75: {},
                100: {},
            },
            {
                key: 2,
                esLocal: esLocal,
                0: {},
                25: {},
                50: {},
                75: {},
                100: {},
            },
            {
                key: 3,
                esLocal: esLocal,
                0: {},
                25: {},
                50: {},
                75: {},
                100: {},
            },
            {
                key: 4,
                esLocal: esLocal,
                0: {},
                25: {},
                50: {},
                75: {},
                100: {},
            },
            {
                key: 5,
                esLocal: esLocal,
                0: {},
                25: {},
                50: {},
                75: {},
                100: {},
            },
        ];
    }
    let jornada = team.games.find(l => l.key === props.keyJornada);
    let topData = [];
    let bottomData = [];
    let topSubstitutes = [];
    let bottomSubstitutes = [];
    if (jornada.esLocal) {
        topData = resetData(true);
        bottomData = resetData(false);
        setAlineacion(jornada.homeCompetitor, topData, topSubstitutes, true);
        setAlineacion(jornada.awayCompetitor, bottomData, bottomSubstitutes, false);
    } else {
        topData = resetData(false);
        bottomData = resetData(true);
        setAlineacion(jornada.awayCompetitor, topData, topSubstitutes, false);
        setAlineacion(jornada.homeCompetitor, bottomData, bottomSubstitutes, true);
    }

    return (
        <>
            <Row justify='center' gutter={[8, 0]}>
                <Col>
                    <h3>Jornada {jornada.key}</h3>
                </Col>
                <Col>
                    <h3>{jornada.local}</h3>
                </Col>
                <Col>
                    <h3>{jornada.golesLocal}</h3>
                </Col>
                <Col>
                    <h3>-</h3>
                </Col>
                <Col>
                    <h3>{jornada.golesVisitante}</h3>
                </Col>
                <Col>
                    <h3>{jornada.visitante}</h3>
                </Col>
            </Row>
            <Row justify='center'>
                <Col>
                    <Table
                        columns={columns}
                        dataSource={topData}
                        bordered={true}
                        pagination={false}
                        showHeader={false}
                        size='small'
                        rowClassName={record => record.esLocal ? 'backgroundLocal' : 'backgroundVisita'}
                    />
                    <Table
                        columns={columns}
                        dataSource={bottomData}
                        bordered={true}
                        pagination={false}
                        showHeader={false}
                        size='small'
                        rowClassName={record => record.esLocal ? 'backgroundLocal rotated' : 'backgroundVisita rotated'}
                    />
                </Col>
            </Row>
            <Row justify='center'>
                <Col>
                    <Table
                        columns={columnsSub}
                        dataSource={topSubstitutes}
                        bordered={true}
                        pagination={false}
                        showHeader={false}
                        size='small'
                        rowClassName={record => record.substitute.esLocal ? 'backgroundLocal' : 'backgroundVisita'}
                    />
                    <Table
                        columns={columnsSub}
                        dataSource={bottomSubstitutes}
                        bordered={true}
                        pagination={false}
                        showHeader={false}
                        size='small'
                        rowClassName={record => record.substitute.esLocal ? 'backgroundLocal rotated' : 'backgroundVisita rotated'}
                    />
                </Col>
            </Row>
            <Modal open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width='88%'
                centered='false'
            >
                <ModalPlayer team={team} playerId={playerId} />
            </Modal>
        </>
    );
}