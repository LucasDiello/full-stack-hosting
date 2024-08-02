import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { Icon } from 'leaflet'
import './pin.scss'
import icon from "../../../public/pinMap.png"

const myIcon = new Icon({
  iconUrl: icon,
  iconSize: [32,32]
 })


const Pin = ({ item }) => {
  return (
    <Marker icon={myIcon} position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default Pin