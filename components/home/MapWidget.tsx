import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export function MapWidget({
  coordinates,
  selectedDeparture,
  selectedDestination,
  route,
  mapRef,
}: {
  coordinates: { [key: string]: { latitude: number; longitude: number } };
  selectedDeparture: string;
  selectedDestination: string;
  route: { latitude: number; longitude: number }[] | null;
  mapRef: React.RefObject<MapView>;
}) {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치 권한이 거부되었습니다.");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation && currentLocation.coords) {
        setLocation(currentLocation.coords);
      } else {
        setErrorMsg("위치를 가져오는 데 실패했습니다.");
      }
    })();
  }, []);

  return (
    <View style={styles.mapInfoBox}>
      {location ? (
        <MapView
          ref={mapRef} // 지도 참조 추가
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: coordinates[selectedDeparture].latitude,
              longitude: coordinates[selectedDeparture].longitude,
            }}
            title="출발지"
          />
          <Marker
            coordinate={{
              latitude: coordinates[selectedDestination].latitude,
              longitude: coordinates[selectedDestination].longitude,
            }}
            title="도착지"
          />
          {route && (
            <Polyline
              coordinates={route}
              strokeColor="#6B59CC"
              strokeWidth={4}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>위치를 불러오는 중...</Text>
          {errorMsg ? <Text>{errorMsg}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapInfoBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "75%",
    zIndex: 0,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
