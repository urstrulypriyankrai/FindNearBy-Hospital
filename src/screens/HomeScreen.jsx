import {Text, View, PermissionsAndroid, Alert, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {SafeAreaView} from 'react-native-safe-area-context';
import Spinner from '../components/Spinner';
import {GOOGLE_MAP_API_KEY} from '../../secret';
import MapView, {Marker} from 'react-native-maps';
/**********End of Imports *********/
const HomeScreen = () => {
  const [isPermissionGranted, setIsPermisionGranted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    requestGeolocationPermission();
  }, []);

  useEffect(() => {
    if (isPermissionGranted) {
      getCurrentLocation();
    }
  }, [isPermissionGranted]);

  useEffect(() => {
    if (currentPosition.latitude) {
      fetchData();
    }
  }, [currentPosition]);
  const getCurrentLocation = () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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
      currentPosition.latitude,
      currentPosition.longitude,
    );
    console.log(data[0].geometry.location);
    const parsedData = await data.map(parseHospitalData);
    setNearbyHospitals(parsedData);
    console.log(parsedData);
    setIsLoading(false);
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
  // if (!isPermissionGranted && currentPosition.latitude) {
  //   return (
  //     <View className="flex justify-center items-center h-full">
  //       <Spinner />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView>
      <View className="flex ">
        <Text className="text-xl text-center text-gray-600">
          NearBy Hospitlas
        </Text>
        {isLoading ? (
          <View className="flex justify-center items-center h-full">
            <Spinner />
          </View>
        ) : (
          <View className="flex w-full h-full">
            <View className="flex w-full h-full">
              <MapView
                className="border-2 border-red-400"
                style={{width: '100%', height: '60%'}}
                initialRegion={{
                  latitude: currentPosition.latitude - 0.09,
                  longitude: currentPosition.longitude - 0.02,
                  latitudeDelta: 0.19,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                followsUserLocation={true}>
                {nearbyHospitals?.map(item => {
                  return (
                    <Marker
                      key={item._id}
                      coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                      }}
                    />
                  );
                })}
              </MapView>
            </View>
            <View>
              {nearbyHospitals && (
                <FlatList
                  data={nearbyHospitals}
                  renderItem={({item}) => <ListItem name={item.name} />}
                  keyExtractor={item => item._id}
                />
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

// helper functions
const parseHospitalData = hospital => {
  return {
    _id: hospital.place_id,
    name: hospital.name,
    address: hospital.vicinity,
    latitude: hospital.geometry.location.lat,
    longitude: hospital.geometry.location.lng,
  };
};

const ListItem = ({name}) => {
  return (
    <View className=" bg-gray-400 py-2 px-6 m-2 ">
      <Text className="text-gray-600">{name}</Text>
    </View>
  );
};
