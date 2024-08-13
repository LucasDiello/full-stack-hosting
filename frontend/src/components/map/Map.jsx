import React, { useState, useEffect, useContext, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import icon from "../../../public/pinMap.png";
import "leaflet-routing-machine";

const Map = ({ items }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const mapRef = useRef(null);

  const hostIcon = new Icon({
    iconUrl: icon,
    iconSize: [32, 32],
  });
  const { avatar } = currentUser || {}; 
  const verifyUser = !currentUser ? "/noavatar.jpg" : (currentUser && avatar != null && avatar !== undefined && avatar) ? avatar : "/noavatar.jpg";

  const iconUser = new Icon({
    iconUrl: verifyUser,
    iconSize: [32, 32],
    className: "user-icon",
  });

  useEffect(() => {
    const geolocation = navigator.geolocation;
    if (geolocation) {
      geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (route) {
        mapRef.current.removeControl(route);
      }

      if (userLocation && selectedItem) {
        const newRoute = L.Routing.control({
          waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(selectedItem.latitude, selectedItem.longitude),
          ],
          router: L.Routing.osrmv1(),
          createMarker: () => null,
          addWaypoints: false,
          showAlternatives: true,
          altLineOptions: {
            styles: [
              { color: 'blue', opacity: 1, weight: 2, dashArray: '5,10' },
            ],
          },
        }).addTo(mapRef.current);

        newRoute.on('routesfound', (e) => {
          const route = e.routes[0];
          const totalDistance = route.summary.totalDistance / 1000; 
          setDistance(totalDistance);
        });

        setRoute(newRoute);
      }
    }
  }, [userLocation, selectedItem]);
  const MapEvent = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };
  
  return (
    <MapContainer
    center={
      items.length === 1
      ? [items[0].latitude, items[0].longitude]
      : userLocation
      ? [userLocation.lat, userLocation.lng]
      : [-29.91778, -51.18361]
    }
    zoom={11}
    scrollWheelZoom={false}
    className="map"
    >
      <MapEvent />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={hostIcon}
          eventHandlers={{
            click: () => {
              setSelectedItem(item);
            },
          }}
        >
          <Popup>
            <div className="popupContainer">
              <img src={item.images[0]} alt="" />
              <div className="textContainer">
                <Link to={`/${item.id}`}>{item.title}</Link>
                <span>{item.bedroom} bedroom</span>
                <b>$ {item.price}</b>
                {distance && <div>Distância do trajeto: {distance.toFixed(2)} km</div>}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={iconUser}
        >
          <Popup>Você está aqui!</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
