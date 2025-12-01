import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const robotIcon = new L.Icon({
  iconUrl: "serve-bot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function RobotMap() {
  const [robots, setRobots] = useState([]);

  //Store robot positions to avoid re-renders on every fetch
  const robotMapRef = useRef(new Map());

  async function fetchRobots() {
    try {
      const res = await fetch("http://localhost:4000/robots");
      const { robots: incoming } = await res.json();

      let hasChanges = false;

      // Check for changes of robot positions
      for (let i = 0; i < incoming.length; i++) {
        const [lat, lng] = incoming[i];

        const prev = robotMapRef.current.get(i);

        if (!prev || prev.lat !== lat || prev.lng !== lng) {
          robotMapRef.current.set(i, { lat, lng });
          hasChanges = true;
        }
      }

      // if lengths changed
      if (incoming.length !== robotMapRef.current.size) {
        hasChanges = true;
      }

      // If robots positions have changed, update state
      if (hasChanges) {
        const arr = Array.from(robotMapRef.current.values()).map(r => [r.lat, r.lng]);
        setRobots(arr);
      }

    } catch (err) {
      console.error("robots unavailable, they've unionized, again", err);
    }
  }

  async function startAuto() {
    await fetch("http://localhost:4000/start-auto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meters: 10, intervalMs: 1000 }),
    })
  }

  useEffect(() => {
    startAuto();
    fetchRobots();

    const interval = setInterval(fetchRobots, 1000);
    return () => clearInterval(interval);
  }, []);

  const center = [34.04, -118.249];
  return (
    <MapContainer center={center} zoom={14} style={{ width: "100vw", height: "100vh" }}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {robots.map((pos, i) => {
            const { lat, lng } = { lat: pos[0], lng: pos[1] };
            return (
                <Marker
                    key={i}
                    position={pos}
                    icon={robotIcon}
                    eventHandlers={{
                        mouseover: (e) => {
                            e.target.openPopup();
                        },
                        mouseout: (e) => {
                            e.target.closePopup();
                        },
                    }}
                >
                    <Popup>
                        <h4>Robot #{i}</h4>
                        <p><strong>Lat</strong>: {lat}</p>
                        <p><strong>Long</strong>: {lng}</p>
                    </Popup>
                </Marker>
            );
        })}
    </MapContainer>
  );
}
