import {Text, View, PermissionsAndroid, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {SafeAreaView} from 'react-native-safe-area-context';
import Spinner from '../components/Spinner';
import {GOOGLE_MAP_API_KEY} from '../../secret';
/**********End of Imports *********/
const HomeScreen = () => {
  useEffect(() => {
    requestGeolocationPermission();
  }, []);
  useEffect(() => {
    getCurrentLocation();
  }, [isPermissionGranted, currentPosition]);

  const [isPermissionGranted, setIsPermisionGranted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const requestGeolocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'NearBy Hospital App Geolocation Permission',
          message:
            'App Needs Your Current Location ' +
            'In order to find nearby hospials.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
        setIsPermisionGranted(true);
      } else {
        console.log('Location permission denied');
        Alert.alert(
          'Please Allow Location Permission First',
          'Location Permission need in order for application to function properly',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log(position);
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchData();
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const fetchData = async () => {
    console.log('fetchData has been called');
    const data = await fetchNearbyHospitals(
      currentPosition?.latitude,
      currentPosition?.longitude,
    );
    const parsedData = data.map(parseHospitalData);
    setNearbyHospitals(parsedData);
    console.log(parsedData);
  };
  const fetchNearbyHospitals = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&key=${GOOGLE_MAP_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results; // Array of hospital objects
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      return []; // Handle error appropriately
    }
  };
  /* if permission is granted call and get the current location */
  if (isPermissionGranted) {
    // getCurrentLocation();
  } else {
    return <Spinner />;
  }

  return (
    <SafeAreaView>
      <View className="flex ">
        <Text className="text-2xl text-gray-600">
          HomeScreen {currentPosition.latitude}
        </Text>
        {}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

// helper functions
const parseHospitalData = hospital => {
  return {
    name: hospital.name,
    address: hospital.vicinity,
    distance: hospital.geometry.location_distance, // In meters
    // Add other desired properties
  };
};
