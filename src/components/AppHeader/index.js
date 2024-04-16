import { BellFilled, MailOutlined } from '@ant-design/icons'
import { Drawer, Image, List, Typography } from 'antd'
import React from 'react'
import "../../App.css"

function AppHeader() {


    const [comments, setComments] = useState([])
    const [orders, setOrders] = useState([])
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    useEffect(() => {
        getComments().then((res) => {
            setComments(res.comments);
        });
        getOrders().then((res) => {
            setOrders(res.products);
        });
    }, []);

  return (
    <div className="AppHeader">
      {/* <Image 
      width={40}
    //   src="https://www.freepnglogos.com/uploads/netflix-logo-0.png">
    
    src="https://yt3.ggpht.com/ytc/AMLnZu83ghQ28n1.png">
      </Image> */}
      <Typography.Title>Viki's Dashboard</Typography.Title>
      <Space>
        <Badge count={comments}>
        <MailOutlined style={{ fontSize: 24}}/>
        </Badge>
        <Badge count={orders}>
        <BellFilled style={{ fontSize: 24}} 
        onClick={() => setNotificationsOpen(true)}
        />
        </Badge>
      </Space>
      <Drawer
        title="Comments"
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        maskClosable>
          <List dataSource={comments}
        renderItem={(item) =>{
          return <List.Item>{item.body} </List.Item>
         }}></List>
        </Drawer>
        <Drawer
        title="Notification"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        maskClosable>
          <List dataSource={orders}
        renderItem={(item) =>{
          return (
          <List.Item><Typography.Text strong>
              {item.title} </Typography.Text> has been ordered!
          </List.Item>)
         }}></List>
        </Drawer>
       
    </div>
  )
}

export default AppHeader
