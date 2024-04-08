import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom";

import { Breadcrumb, Table, Avatar, Row, Col, Radio, Button, Input, Space, } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

export default function Clubs(props) {
  const { customPath } = useParams();
  const [competition] = useState(props.competition(customPath));
  const [competitionId] = useState(props.competitionId(customPath));
  const [seasonNum, setSeasonNum] = useState('');
  const [clubs, setClubs] = useState([]);
  const [totalGoles, setTotalGoles] = useState(0);
  const [promedioJornada, setPromedioJornada] = useState(0);
  const [promedioPartido, setPromedioPartido] = useState(0);
  const [opc, setOpc] = useState(1);
  const [team1, setTeam1] = useState({ id: -1, name: '' });
  const [team2, setTeam2] = useState({ id: -1, name: '' });
  const [{ isLoading, hasError, error }, setFetchState] = useState({
    isLoading: true,
    hasError: false,
    error: '',
  });

  useEffect(() => {
    if (isLoading) {
      fetch(`https://webws.365scores.com/web/standings/?appTypeId=5&langId=29&timezoneName=America/Mexico_City&userCountryId=31&competitions=${competitionId}&live=false&withSeasons=true`)
        .then((response) => response.json())
        .then((responseData) => {
          setSeasonNum(responseData.standings[0].seasonNum)
          let _clubs = []
          let totalGoles = 0;
          responseData.standings[0].rows.forEach((club) => {
            const _club = {
              key: club.position,
              id: club.competitor.id,
              club: club.competitor.name,
              gamePlayed: club.gamePlayed,
              gamesWon: club.gamesWon,
              gamesEven: club.gamesEven,
              gamesLost: club.gamesLost,
              for: club.for,
              against: club.against,
              diferenciaGoles: club.for - club.against,
              totalGoles: club.for + club.against,
              points: club.points,
            }
            totalGoles += _club.for;
            _clubs.push(_club)
          })
          setFetchState({
            isLoading: false,
            hasError: false,
          });
          setClubs(_clubs)
          setTotalGoles(totalGoles)
          const jornadas = _clubs[0].gamePlayed;
          const promedioJornada = parseFloat((totalGoles / jornadas).toFixed(2));
          setPromedioJornada(promedioJornada);
          setPromedioPartido(parseFloat((promedioJornada / (_clubs.length / 2)).toFixed(2)));
        })
        .catch((err) => {
          setFetchState({
            isLoading: false,
            hasError: true,
            error: err,
          })
        })
    }
  }, [competitionId, isLoading])

  // -------------------------------------------------------- //
  // const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              // setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <>{text}</>
        // <Highlighter
        //   searchWords={[searchText]}
        //   autoEscape
        //   textToHighlight={text ? text.toString() : ''}
        // />
      ) : (
        text
      ),
  });

  const columns = [
    {
      dataIndex: 'key',
      width: 40,
      rowScope: 'row',
    },
    {
      title: 'Club',
      dataIndex: 'club',
      width: 240,
      ...getColumnSearchProps('club'),
      sorter: (a, b) => {
        if (a.club < b.club) {
          return -1
        }
        if (a.club > b.club) {
          return 1
        }
        return 0
      },
      render: (text, record) => {
        return (
          <Link
            type='link'
            target={opc === 2 ? "_blank" : null}
            style={{ color: "#ededed", width: "100%", height: "100%" }}
            to={opc === 2 ? `/${customPath}/equipo` : null}
            onClick={() => {
              console.log("team:" + record.club);
              console.log("id:" + record.id);
              console.log("seasonNum:" + seasonNum);
              console.log("competitionId:" + competitionId);

              let _team =
              {
                id: record.id,
                name: record.club
              };
              if (opc === 1) {
                if (team1.id === record.id) {
                  setTeam1({ id: -1, name: '' })
                } else if (team2.id === record.id) {
                  setTeam2({ id: -1, name: '' })
                }
                else {
                  if (team1.id === -1) {
                    setTeam1(_team)
                  } else if (team2.id === -1) {
                    setTeam2(_team)
                  }
                }
              } else {
                localStorage.setItem("seasonNum", seasonNum);
                localStorage.setItem("team1", JSON.stringify(_team));
              }
            }
            }
          >
            <Row align="middle" gutter={8}>
              <Col>
                <Avatar
                  shape='square'
                  size={40}
                  src={`https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_3,d_Competitors:default1.png/v5/Competitors/${record.id}`}
                />
              </Col>
              <Col>
                <span>{text}</span>
              </Col>
            </Row>
          </Link>
        )
      }
    },
    {
      title: 'PJ',
      dataIndex: 'gamePlayed',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.gamePlayed < b.gamePlayed) {
          return 1
        }
        else if (a.gamePlayed > b.gamePlayed) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'G',
      dataIndex: 'gamesWon',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.gamesWon < b.gamesWon) {
          return 1
        }
        else if (a.gamesWon > b.gamesWon) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'E',
      dataIndex: 'gamesEven',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.gamesEven < b.gamesEven) {
          return 1
        }
        else if (a.gamesEven > b.gamesEven) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'P',
      dataIndex: 'gamesLost',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.gamesLost < b.gamesLost) {
          return 1
        }
        else if (a.gamesLost > b.gamesLost) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'GF',
      dataIndex: 'for',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.for < b.for) {
          return 1
        }
        else if (a.for > b.for) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'GC',
      dataIndex: 'against',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.against < b.against) {
          return 1
        }
        else if (a.against > b.against) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'DG',
      dataIndex: 'diferenciaGoles',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.diferenciaGoles < b.diferenciaGoles) {
          return 1
        }
        else if (a.diferenciaGoles > b.diferenciaGoles) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'TG',
      dataIndex: 'totalGoles',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.totalGoles < b.totalGoles) {
          return 1
        }
        else if (a.totalGoles > b.totalGoles) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Pts',
      dataIndex: 'points',
      rowScope: 'row',
      width: 55,
      sorter: (a, b) => {
        if (a.points < b.points) {
          return 1
        }
        else if (a.points > b.points) {
          return -1
        }
        return 0
      },
    },
  ];

  if (hasError) {
    return (
      <div>
        <h1>{error}</h1>
        <button onClick={() => setFetchState({ isLoading: true })}>Volver a intentarlo</button>
      </div>
    )
  }

  const onChange = (e) => {
    setOpc(e.target.value);
  };

  return (
    <>
      <Row justify="center">
        <Breadcrumb
          style={{ margin: "12px 0px 18px 0px" }}
          items={[
            {
              title: <a
                style={{ color: '#fff' }} href="/">Ligas</a>,

            },
            {
              title: <a style={{ color: '#fff' }} href={"/" + customPath}>{competition}
              </a>,
            },
          ]}
        />
      </Row>
      <Row align='top' gutter={[20, 0]} justify="center" style={{ color: '#fff', marginBottom: '10px' }}>
        <Col
          style={{
            width: '150px'
          }}
        >
          <Link
            target="_blank"
            to={`/${customPath}/resultados`}
          // onClick={() => {
          //   localStorage.setItem("clubs", JSON.stringify(clubs));
          // }}
          >
            <Button
              type='default'
              style={{
                position: 'absolute',
                top: '-10px',
              }}
            >
              Resultados
            </Button>
          </Link>
        </Col>
        <Col>
          <span>Total: {totalGoles}</span>
        </Col>
        <Col>
          <span>G/J: {promedioJornada}</span>
        </Col>
        <Col>
          <span>G/E: {promedioPartido}</span>
        </Col>
        <Col>
          <Radio.Group onChange={onChange} value={opc}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
          </Radio.Group>
        </Col>
        <Col
          style={{
            width: '110px'
          }}
        >
          {
            team1.id !== -1 && team2.id !== -1 ?
              <Link
                target="_blank"
                to={`/${customPath}/comparar`}
                onClick={() => {
                  localStorage.setItem("seasonNum", seasonNum);
                  localStorage.setItem("team1", JSON.stringify(team1));
                  localStorage.setItem("team2", JSON.stringify(team2));
                  setTeam1({ id: -1, name: '' })
                  setTeam2({ id: -1, name: '' })
                }}
              >
                <Button
                  type='primary'
                  style={{ position: 'absolute', top: '-10px' }}
                >Compare</Button>
              </Link>
              :
              <div></div>
          }
        </Col>
      </Row >
      <Row justify="center">
        <Table
          columns={columns}
          dataSource={clubs}
          pagination={false}
          loading={isLoading}
          showSorterTooltip={false}
          bordered={true}
          size='small'
          style={{ width: 820 }}
          className='customTable'
          rowClassName={record => team1.id === record.id ? 'ant-table-row-selected' : team2.id === record.id ? 'ant-table-row-selected2' : ''}
          sticky
        />
      </Row>
    </>
  )
}