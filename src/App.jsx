import Map, { Marker, Popup } from 'react-map-gl';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import RoomIcon from '@mui/icons-material/Room';
import axios from 'axios';
import './App.css'
import Register from './components/Register/Register';
import Login from './components/Login/Login';

function App() {  
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [viewport, setViewport] = React.useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [star, setStar] = React.useState(0);
  const [currentUsername, setCurrentUsername] = React.useState('');
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    const getPins = async () => {
      try {
        console.log()
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/pins');
        const pins = res.data;
        setPins(pins);
        console.log(pins)
      } catch (err) {
        console.log(err)
      }
    }
    getPins();
  }, []);

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat,
      long: lng,
    });
  };
  
  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(currentUsername)

  return (
    <Map
      initialViewState={{...viewport}}
      style={{ width: '80vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken='pk.eyJ1IjoicmFmYWVsZWdoIiwiYSI6ImNsYXZzcmxncjA4dHMzbmx5YW9qbzJkMGQifQ.zfLWZ_n6RYLWBwdsghTmwg'
      onDblClick={handleAddClick}
      onViewportChange={(viewport) => setViewport(viewport)}              
    >
      {pins && pins.map((pin, index) => (
        <>
          <Marker 
            key={pin._id + index} 
            longitude={pin.long} 
            latitude={pin.lat} 
            color="red"
            offsetLeft={-3.5 * viewport.zoom}
            offsetTop={-7 * viewport.zoom} 
          >
            <RoomIcon
              style={{
                fontSize: 7 * viewport.zoom,
                color: currentPlaceId === pin._id ? "greenyellow" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(pin._id)}
            />
          </Marker>
          {
            (pin._id === currentPlaceId) && (
              <Popup key={pin._id} longitude={pin.long} latitude={pin.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{pin.title}</h4>
                  <label>Review</label>
                  <p>{pin.desc}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(pin.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{pin.username}</b></span>
                  <span className='date'>1 hour ago</span>
                </div>
              </Popup>
            )
          }
        </>)
      )}
      {newPlace && (
        <>
          <Marker
            latitude={newPlace.lat}
            longitude={newPlace.long}
            offsetLeft={-3.5 * viewport.zoom}
            offsetTop={-7 * viewport.zoom}
          >
            <RoomIcon
              style={{
                fontSize: 7 * viewport.zoom,
                color: "tomato",
                cursor: "pointer",
              }}
            />
          </Marker>
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setStar(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        </>
      )}
      {currentUsername !== '' ? 
        <div className='user'>
          <p>User: {currentUsername}</p>
          <button className='button logout' onClick={() => setCurrentUsername('')}>Log Out</button> 
        </div> :
        <div className='buttons'>
          <button className='button login' onClick={() => setShowLogin(true)}>Login</button>
          <button className='button register' onClick={() => setShowRegister(true)}>Register</button>
        </div>
      }
      {showRegister && <Register setCurrentUsername={setCurrentUsername} setShowRegister={setShowRegister} />}
      {showLogin && <Login setCurrentUsername={setCurrentUsername} setShowLogin={setShowLogin} />}
    </Map>
  )
}

export default App
