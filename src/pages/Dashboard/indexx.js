import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography} from "antd";
import { getRevenue } from '../../API';


function Dashboards() {
  return (
    <div>
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard title="Orders" value={123445} bordered={false}/>
      </Space>
      <Space>
        <RecentOrders/> 
      </Space>
    </div>
  )
}
export default Dashboards