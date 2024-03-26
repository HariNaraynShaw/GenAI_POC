import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal } from 'antd';
import { PlusOutlined, TrophyFilled } from '@ant-design/icons';
import './Leaderboard.css';
import SubmitMetrics from '../SubmitMetrics/SubmitMetrics';


export interface LeaderBoardData {
    _id: string,
    user_name: string,
    email_id: string,
    lines_of_code: number,
    weekly_performance: number,
    reusability_refactoring: number,
    score?: number,
    time?: string,
    rank?:number,
}
interface LeaderboardResponse {
    data: LeaderBoardData[];
}

const colStyle: React.CSSProperties = {
  textShadow: '0px 1px 1px rgba(0, 0, 0, 0.2)',
}


const columns: any[] = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    style: colStyle,
    render: (rank: number, __: LeaderBoardData, index: number) => {
      if (rank === 1) {
        return (
          <Space>
            <TrophyFilled style={{ color: '#ffd700' }} />
          </Space>
        );
      }

      return rank;
    },
  },
  { 
    title: 'Name',
    dataIndex: 'user_name',
    key: 'user_name',
    style : {colStyle},
    render: (text: string) => {
      return (
        <span style={{textTransform: 'capitalize'}}>{text}</span>
      )
    }
  },
  { 
    title: 'Email',
    dataIndex: 'email_id',
    key: 'email_id',
    style : colStyle
  },
  { 
    title: 'Lines Of Code',
    dataIndex: 'lines_of_code',
    key: 'lines_of_code',
    style : colStyle 
  },
  { 
    title: 'Weekly Performance',
    dataIndex: 'weekly_performance',
    key: 'weekly_performance',
    style : colStyle 
  },
  { 
    title: 'Reusability',
    dataIndex: 'reusability_refactoring',
    key: 'reusability_refactoring',
    style : colStyle 
  },
  { 
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    style : colStyle,
  },
  { 
    title: 'Date',
    dataIndex: 'time',
    key: 'time',
    style : colStyle,
    render: (text: string) => {
      const date = new Date(text);
      const day = date.getDate().toString().padStart(2, '0');
      const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthAbbreviations[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
   },
];

const LEADERBOARD_URL = 'http://localhost:8000/leaderboard';
const WEEKLY_URL = 'http://localhost:8000/weeklydata';

const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LeaderBoardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAllData, setAllData] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  
  const fetchData = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
      const fetchedData: LeaderboardResponse = await response.json();
      console.log(fetchedData);
      
      setData(fetchedData.data);
      
      let calculatedSortedScore= calculateScore(fetchedData)
      calculatedSortedScore.forEach((item:LeaderBoardData,index:any) => {
        item.rank = index + 1;
      });
      setData(calculatedSortedScore)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(isAllData ? LEADERBOARD_URL : WEEKLY_URL);
  }, [isAllData]);

  const handleToggleData = () => {
    setAllData((prevIsAllData) => !prevIsAllData);
  };
  
  const handleSubmitMetricsSuccess = () => {
    setIsModalVisible(false);
    fetchData(isAllData ? LEADERBOARD_URL : WEEKLY_URL);
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const calculateScore = (scoredata: any) => {
    const scores = scoredata.data.map((item:any)=> {
      // Calculate scores for individual items
      const avg_lines_of_code_per_hour_score = calculateMaxAvg(item);
      const avg_lines_ofreusability_code_score = calculateMaxReusableAvg(item);
      const maxMaxAvg = scoredata.data.reduce((max:any, current:any) => {
            const currentMaxAvg = calculateMaxAvg(current);
            return max > currentMaxAvg ? max : currentMaxAvg;
          }, 0);
        
          const maxReusableAvg = scoredata.data.reduce((max:any, current:any) => {
            const currentMaxReusableAvg = calculateMaxReusableAvg(current);
            return max > currentMaxReusableAvg ? max : currentMaxReusableAvg;
          }, 0);
      // Calculate intermediate scores for the item
      const combined_score = (avg_lines_of_code_per_hour_score/maxMaxAvg * 8);
      const reusability_refactoring_score = (avg_lines_ofreusability_code_score/maxReusableAvg * 2) ;
  
      const total_score = Number((combined_score + reusability_refactoring_score).toFixed(2));
     
      // Return scores for each item
      return {
        ...item,
        score:total_score 
      };
    });
    scores.sort((a: any, b: any) => b.score - a.score);
    console.log("scores",scores);
    return scores;
  };
  
  const calculateMaxAvg = (obj: { weekly_performance: number; lines_of_code: number; }) => {
    // Handle cases where weekly_performance is 0 to avoid division by zero
    if (obj.weekly_performance === 0) {
      return 0; // Or any default value you want for division by zero
    }
    return obj.lines_of_code / obj.weekly_performance;
  };
  
  const calculateMaxReusableAvg = (obj: { reusability_refactoring: number; lines_of_code: number; }) => {
    // Handle cases where reusability_refactoring is 0 to avoid division by zero
    if (obj.reusability_refactoring === 0) {
      return 0; // Or any default value you want for division by zero
    }
    return obj.lines_of_code / obj.reusability_refactoring;
  };

  return (
    <div>
      <h1>
        Copilot Leaderboard
        <Button style={{ marginLeft: '10px', float: 'right' }} onClick={handleToggleData}>
          {isAllData ? 'Get Weekly Data' : 'Get All Data'}
        </Button>
        <Button style={{ marginLeft: '10px', float: 'right'  }} icon={<PlusOutlined />} onClick={showModal}>
          Add Metrics
        </Button>
      </h1>
      <Modal
        destroyOnClose={true}
        title="Add CoPilot Metrics"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <SubmitMetrics onSuccess={handleSubmitMetricsSuccess}  />
      </Modal>
      {error && <p>Error: {error}</p>}
      {data && (
        <Table 
          dataSource={data}
          columns={columns}
          rowKey="_id" 
          loading={isLoading}/>
          
      )}
    </div>
  );
}

export default Leaderboard;