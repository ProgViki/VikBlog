import React, { useState } from 'react';
import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography} from "antd";
import { getOrders, getRevenue } from '../../API';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';
// import faker from "@faker-js/faker";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

function Dashboard() {

  

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard />
      </Space>
      <Space>
        <RecentOrders /> 
        <DashboardChart />
      </Space>
    </Space>
  )
}

export default Dashboard;

function DashboardCard(title, value) {
    const [orders, setOrders] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [customers, setCustomers] = useState(0);
    const [revenue, setRevenue] = useState(0);

    
    return (
      <Card>
        <Space direction="horizontal">
          <DashboardCard 
         icon ={<ShoppingCartOutlined style={{color: 'green', backgroundColor: "rgba(0,255,0,0.25",
            borderRadius: 20, fontSize: 24, padding: 8,}}/>}
          title="Orders" value={orders} bordered={false}/>
           <DashboardCard 

         icon ={<ShoppingOutlined style={{color: 'purple', backgroundColor: "rgba(0,0,255,0.25",
            borderRadius: 20, fontSize: 24, padding: 8,}}/>}
          title="Inventory" value={inventory} bordered={false}/>
           <DashboardCard 

         icon ={<UserOutlined style={{color: 'blue', backgroundColor: "rgba(0,255,0,0.25",
         borderRadius: 20, fontSize: 24, padding: 8,}}/>}
          title="Customer" value={customers} bordered={false}/>
           <DashboardCard

         icon ={<DollarCircleOutlined style={{color: 'red', backgroundColor: "rgba(255,0,0,0.25",
         borderRadius: 20, fontSize: 24, padding: 8,}}/>}
          title="Revenue" value={revenue} bordered={false}/>
        </Space>
        <Space>
        </Space>
      </Card>
    )}


    function RecentOrders() {
        const [dataSource, setDataSource] = useState([]);
        const [loading, setLoading] = useState(false);
    
    useEffect(() => {
    
        setLoading(true);
        getOrders().then(res => {
            setDataSource(res.products.splice(0, 3))
            setLoading(false);
        })
    }, []);
    
        return (
            <>
             <Typography.Text>Recent Orders</Typography.Text>        
           <Table columns={[
                {
                    title: "title",
                    dataIndex: "title"
                },
                {
                    title: "Quantity",
                    dataIndex: "quantity"
                },
                {
                    title: "Price",
                    dataIndex: "discountedPrice"
                }
            ]}
            loading={loading}
            dataSource={dataSource}
            pagination={false}
            ></Table>
            </>
        )
    
    }

function DashboardChart() {
    useEffect(() => {
        getRevenue().then(res => {
            const labels = res.carts.map(cart=>{
                return `User-${cart.userId}`;
            });
            const data = res.carts.map(cart=>{
                return cart.discountedTotal;
            });

        })
    }, []);

const  options = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
        },
        title: {
            display: true,
            text: "Order Revenue",
        },
    },
};

const labels = [
    "January", "February", "March", "April", "May", "June", "July",
]
const data = {
    labels,
    datasets: [
        {
            label: "Dataset 1",
            data: labels.map(() => Math.random() * 1000),
            backgroundColor: "rgba(255, 99, 132, 0.5)"
        },
        {
            label: "Dataset 2",
            data: labels.map(() => Math.random() * 1000),
            backgroundColor: "rgba(53, 162, 235, 0.5)"
        },
    ],
};

return (
    <Card style={{ width: 500, height: 250}}>
        <Bar options={options} data={data} />
    </Card>
)
}



 
