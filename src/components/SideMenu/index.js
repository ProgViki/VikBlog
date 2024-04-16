import { AppstoreOutlined, ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "../../App.css";

function SideMenu
() {
    const location = useLocation()
    const [selectedKeys, setSelectedKeys] = useState('/')
useEffect(() => {
  const pathName = location.pathName 
}, [location.pathName])

    const navigate = useNavigate()
  return (
    <div className="SideMenuVertical">
      <Menu
      className="SideMenuVertical"
      mode="vertical" 
      onClick={(item) => {
        navigate(item.key);
      }}
      selectedKeys={[selectedKeys]}
        items={[
            {
                label: "Dashboard",
                icon: <AppstoreOutlined />,
                key: "/",
            },
            {
                label: "Inventory",
                icon: <ShopOutlined />,
                key: "/inventory",
            },
            {
                label: "Orders",
                icon: <ShoppingCartOutlined />,
                key: "/orders",
            },
            {
                label: "Customers",
                icon: <UserOutlined />,
                key: "/customers",
            }
        ]}
        >
      </Menu>
    </div>
  )
}

export default SideMenu

