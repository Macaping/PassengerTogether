import { LatLng } from "react-native-maps";
import { atom, selector } from "recoil";

interface Coordinates {
  [key: string]: LatLng;
}

// 주요 장소의 좌표 데이터
export const coordinatesState = atom<Coordinates>({
  key: "coordinates",
  default: {
    천안역: { latitude: 36.8089885, longitude: 127.148933 },
    천안아산역: { latitude: 36.7946071, longitude: 127.1045608 },
    선문대: { latitude: 36.7989764, longitude: 127.0750025 },
    탕정역: { latitude: 36.78827, longitude: 127.084638 },
    "두정동 롯데": { latitude: 36.8261834, longitude: 127.1399744 },
  },
});

// 장소 목록
export const locationsState = atom<string[]>({
  key: "locations",
  default: ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"],
});

// 출발지
export const departureState = atom<string>({
  key: "departure",
  default: "천안역",
});

// 출발지의 좌표
export const departureLocationState = selector<LatLng>({
  key: "departureLocation",
  get: ({ get }) => {
    const departure = get(departureState);
    const coordinates = get(coordinatesState);
    return coordinates[departure];
  },
});

// 도착지
export const destinationState = atom<string>({
  key: "destination",
  default: "천안아산역",
});

// 도착지의 좌표
export const destinationLocationState = selector<LatLng>({
  key: "destinationLocation",
  get: ({ get }) => {
    const destination = get(destinationState);
    const coordinates = get(coordinatesState);
    return coordinates[destination];
  },
});

// 출발 날짜
export const fromDateState = atom<Date>({
  key: "fromDate",
  default: new Date(),
});

// 도착 날짜
export const toDateState = atom<Date>({
  key: "toDate",
  default: new Date(),
});

// 거리
export const distanceState = atom<number | null>({
  key: "distance",
  default: null,
});

// 소요 시간
export const durationState = atom<number | null>({
  key: "duration",
  default: null,
});
