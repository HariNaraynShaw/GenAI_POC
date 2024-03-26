import React from 'react';
import { Form, Input, Button, message, InputNumber } from 'antd';
import './SubmitMetrics.css';
import { LeaderBoardData } from '../Leaderboard/Leaderboard';

interface SubmitMetricsProps {
  onSuccess: () => void;
}

const SubmitMetricsUrl = 'http://localhost:8000/submit';

const SubmitMetrics: React.FC<SubmitMetricsProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  
  const handleSubmit = async (values: LeaderBoardData) => {
    const payload = values;
    console.log(payload)
    try {
      const response = await fetch(SubmitMetricsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      form.resetFields();

      message.success('Metrics submitted successfully!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to submit metrics. Please try again.');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={{
        lines_of_code: 0,
        weekly_performance: 0,
        reusability_refactoring: 0,
        score: 0,
      }}
      className="submit-metrics-form"
    >
      <div className="form-row">
        <Form.Item
          label="User Name"
          name="user_name"
          rules={[{ required: true, message: 'Please enter user name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email_id"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input />
        </Form.Item>
      </div>
      <div className="form-row">
        <Form.Item
          label="Lines of Code"
          name="lines_of_code"
          rules={[{ required: true, type: 'number', message: 'Please enter a valid number' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Weekly Performance(In 40 Hrs)"
          name="weekly_performance"
          rules={[
            { required: true, type:"number" ,message: 'Please enter the number of hours worked' },
            { validator: validateHours },
          ]}
        >
          <InputNumber style={{ width: '100%' }}  />
        </Form.Item>
      </div>
      <div className="form-row">
        <Form.Item
          label="Reusability Refactoring"
          name="reusability_refactoring"
          rules={[{ required: true, type: 'number', message: 'Please enter a valid number' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        {/* <Form.Item
          label="Score"
          name="score"
          rules={[{ required: true, type: 'number', message: 'Please enter a valid number' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item> */}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

const validateHours = (_:any, value:any) => {
  if (value && (value < 0 || value > 40)) {
    return Promise.reject('Please enter a valid number of hours between 0 and 40');
  }
  return Promise.resolve(); // Validation successful
};
export default SubmitMetrics;