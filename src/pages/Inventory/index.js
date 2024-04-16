import { Typography } from 'antd';
import React from 'react'

function Inventory() {
const [loading, setLoading] = useState(false);
const [dataSource, setDataSource] = useState([]);

useEffect(() => {
  setLoading(true)
  getInventory().then(res=>{
    setDataSource(res.products)
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
              title: 'Thumbnail',
              dataIndex: 'thumbnail',
              render: (link) => {
                return <Avatar src={link} size={64} />
              }
            },
          {
            title: 'Title',
            dataIndex: 'title',
          },
          {
            title: 'Price',
            dataIndex: 'price',
            render: (value => <span>${value}</span>)
          },
          {
            title: 'Rating',
            dataIndex: 'rating',
            render: (rating) => {
              return <Rate value={rating} allowHalf disabled />;
            }
          },
          {
            title: 'Stock',
            dataIndex: 'name',
          },
        
          {
            title: 'Brand',
            dataIndex: 'name',
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

export default Inventory
