import React from 'react'
import Card from '../card/Card'

const List = ({posts}) => {
  console.log(posts)
  return (
    <div className='list'>
      {posts.map(item=>(
        <Card key={item.id} item={item}/>
      ))}
    </div>
  )
}

export default List