import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper, Avatar } from '@mui/material';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const dataLine = [
  { name: '20191001', oppo: 4000, vivo: 2400, apple: 2400 },
  { name: '20191002', oppo: 3000, vivo: 1398, apple: 2210 },
  // More data...
];

const dataBar = [
  { name: '周一', sales: 400, purchase: 240 },
  { name: '周二', sales: 300, purchase: 200 },
  // More data...
];

const dataPie = [
  { name: '小米', value: 400 },
  { name: '苹果', value: 300 },
  // More data...
];

const HomePage = () => {
  return (
    <Box display="flex">
      {/* Main Content */}
      <Box flex={1} padding={3}>
        <Grid container spacing={3}>
          {/* User Info */}
          <Grid item xs={12}>
            <Card>
              <CardContent display="flex">
                <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>A</Avatar>
                <Box>
                  <Typography variant="h5">Admin</Typography>
                  <Typography variant="body2">超级管理员</Typography>
                  <Typography variant="body2">上次登录时间：2021-7-19</Typography>
                  <Typography variant="body2">上次登录地点：武汉</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats */}
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">￥1234</Typography>
                <Typography>今日支付订单</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Add similar cards here */}
          
          {/* Line Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <LineChart width={600} height={300} data={dataLine}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="oppo" stroke="#8884d8" />
                  <Line type="monotone" dataKey="vivo" stroke="#82ca9d" />
                </LineChart>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <PieChart width={300} height={300}>
                  <Pie
                    data={dataPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <BarChart width={300} height={300} data={dataBar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;