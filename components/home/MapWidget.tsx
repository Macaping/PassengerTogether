import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";

interface MapWidgetProps {
  departure: LatLng | null;
  destination: LatLng | null;
}

export function fetchRouteData() {}

export function MapWidget({
  departure,
  destination,
  setDistance,
  setDuration,
}: MapWidgetProps & {
  setDistance: React.Dispatch<React.SetStateAction<number | null>>;
  setDuration: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  // 위치 정보
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  // 위치 정보를 불러옵니다. 오류가 발생하면 에러 메시지를 설정합니다.
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then((value) => {
        if (!value.status) throw new Error("위치 권한이 거부되었습니다.");
      })
      .then(() => {
        Location.getCurrentPositionAsync({})
          .then((value) => {
            setLocation(value.coords);
          })
          .catch((error: Error) => {
            throw error;
          });
      })
      .catch((error: Error) => {
        setErrorMsg(error.message);
      });
  }, []);

  // 초기 지도 위치
  const initialRegion: Region = {
    latitude: location?.latitude || 36.79932,
    longitude: location?.longitude || 127.074874,
    latitudeDelta: location ? 0.025 : 0.1,
    longitudeDelta: location ? 0.025 : 0.1,
  };

  // 길찾기
  const MAP_KEY = process.env.EXPO_PUBLIC_MAP_KEY || ""; //길찾기 api 키 가져옴
  const [route, setRoute] = useState<LatLng[]>([]);

  useEffect(() => {
    if (departure && destination) {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${MAP_KEY}&start=${departure?.longitude},${departure.latitude}&end=${destination.longitude},${destination.latitude}`;
      fetch(url)
        // json으로 변환
        .then((value) => value.json())
        // geometry를 coordinates로 변환
        .then((value) => {
          const geometry = value.features[0].geometry.coordinates;
          const polylineCoords = geometry.map((coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          // route에 저장
          setRoute(polylineCoords);

          const summary = value.features[0].properties.summary;
          setDistance(summary.distance / 1000); // distance in km
          setDuration(summary.duration / 60); // duration in minutes
        })
        .catch((error) => console.error("Error fetching route data:", error));
    }
    fetchRouteData();
  }, [departure, destination]);

  const mapRef = useRef<MapView | null>(null);

  // 출발지가 변경될 때마다 지도를 이동합니다.
  useEffect(() => {
    if (departure) {
      mapRef.current?.animateToRegion({
        latitude: departure.latitude,
        longitude: departure.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      });
    }
  }, [departure]);

  // 도착지가 변경될 때마다 지도를 이동합니다.
  useEffect(() => {
    if (destination) {
      mapRef.current?.animateToRegion({
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      });
    }
  }, [destination]);

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text>위치를 불러오는 중...</Text>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
    >
      {departure && <Marker coordinate={departure} title="출발지" />}
      {destination && <Marker coordinate={destination} title="도착지" />}
      {route && (
        <Polyline coordinates={route} strokeColor="#6B59CC" strokeWidth={4} />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
