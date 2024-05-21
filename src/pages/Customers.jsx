import { Typography } from 'antd';
import React from 'react'

function Customers () {
const [loading, setLoading] = useState(false);
const [dataSource, setDataSource] = useState([]);

useEffect(() => {
  setLoading(true)
  getInventory().then(res=>{
    setDataSource(res.products)
    setLoading(false);
  })
}
)


  return (
 
    <Space size={20} direction= "vertical">
      <Typography.Title level={4}>
            Inventory
      </Typography.Title>
      <Table
        loading={loading}
        columns={[
            {
              title: 'Photo',
              dataIndex: 'image',
              render: (link) => {
                return <Avatar src={link} size={64} />
              }
            },
          {
            title: 'first Name',
            dataIndex: 'firstname',
          },
          {
            title: 'Last Name',
            dataIndex: 'lastname',
            render: (value => <span>${value}</span>)
          },
          {
            title: 'Email',
            dataIndex: 'email',
            render: (rating) => {
              return <Rate value={rating} allowHalf disabled />;
            }
          },
          {
            title: 'Phone',
            dataIndex: 'phone',
          },
        
          {
            title: 'Address',
            dataIndex: 'address',
            render: (address)=> {
              <span>{address.address}</span>
            }
          },
          {
            title: 'Category',
            dataIndex: 'name',
          }
        ]}
        dataSource={dataSource}
          pagination ={{
            pageSize: 5 ,
          }}>
      </Table>
    </Space>
  )
  }

export default Customers
