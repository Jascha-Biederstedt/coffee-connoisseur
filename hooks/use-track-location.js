import { useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../pages/_app';

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  // const [latitude, setLatitude] = useState('');
  // const [longitude, setLongitude] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatitude(latitude);
    // setLongitude(longitude);
    dispatch({
      type: ACTION_TYPES.SET_LATITUDE,
      payload: { latitude },
    });
    dispatch({
      type: ACTION_TYPES.SET_LONGITUDE,
      payload: { longitude },
    });
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMsg('Unable to retrieve your location');
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      // status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latitude,
    // longitude,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
