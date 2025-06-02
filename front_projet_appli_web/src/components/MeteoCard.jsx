import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FiMapPin } from "react-icons/fi";
import { WiThermometer, WiStrongWind } from "react-icons/wi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MeteoCard({ weather, position }) {
  return (
    <Card className="accueil-weather-card">
      <Card.Body>
        <Row>
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <p><FiMapPin /> <b>Météo à Toulouse</b></p>
            <p><WiThermometer /> Température : <strong>{weather.temperature}°C</strong></p>
            <p><WiStrongWind /> Vent : <strong>{weather.windspeed} km/h</strong></p>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ height: "200px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
              <MapContainer center={position} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>Toulouse</Popup>
                </Marker>
              </MapContainer>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default MeteoCard;