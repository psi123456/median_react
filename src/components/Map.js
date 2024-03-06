import React, { useEffect, useState } from 'react';

function App(props) {
  const [map, setMap] = useState(null);
  const [markerLocations, setMarkerLocations] = useState([
    { latitude: 36.355516761167735, longitude: 127.38378423389848 }, // 서구청
    { latitude: 36.31609136817001, longitude: 127.38132759834072 }, // 도마 1
    { latitude: 36.31280849520262, longitude: 127.37358113166535 }, // 복수동 첫 번째 위치
    { latitude: 36.312844394002866, longitude: 127.373628626747 }, // 도마2// 첫 번째 위치
    { latitude: 36.30449609006955, longitude: 127.36671087776988 }, // 정림
    { latitude: 36.32580668830034, longitude: 127.38674846033618 }, // 변동
    { latitude: 36.3390064273096, longitude: 127.39167019508757 }, // 용문
    { latitude: 36.34667457580192, longitude: 127.39535131703718 }, // 탄방
    { latitude: 36.35249935891751, longitude: 127.38610617477215 }, // 둔1
    { latitude: 36.35382047952037, longitude: 127.38372855861029 }, // 둔2
    { latitude: 36.353458399060834, longitude: 127.4000201840922 }, // 첫 번째 위치
    { latitude: 36.33713830775464, longitude: 127.38205948493962 }, // 괴정
    { latitude: 36.331734540993274, longitude: 127.38524353963133 }, // 가장
    { latitude: 36.332205720810634, longitude: 127.37737702822157 }, // 첫 번째 위치
    { latitude: 36.35083352463914, longitude: 127.36782766033562 }, // 갈마1
    { latitude: 36.34677440510911, longitude: 127.37486008889283 }, // 갈마2
    { latitude: 36.35467653595308, longitude: 127.35760161537696 }, // 월평1
    { latitude: 36.36357087206187, longitude: 127.37387654954917 }, // 월평2
    { latitude: 36.36030987143153, longitude: 127.3669335539107 }, // 월평3
    { latitude: 36.36751210883334, longitude: 127.37504032753318 }, // 만년
    { latitude: 36.30353174744349, longitude: 127.34943521805532 }, // 가수원
    { latitude: 36.30385705603053, longitude: 127.33736212082609 }, // 관저1
    { latitude: 36.299287348224325, longitude: 127.33521045254342 }, // 관저2
    { latitude: 36.255861221222936, longitude: 127.34163980067476 }, // 기성동
    { latitude: 36.36706495698776, longitude: 127.38107475718631 }, // 서구보건소
    { latitude: 36.30110012369086, longitude: 127.34501556289536 }, // 관저보건
    { latitude: 36.254609026870945, longitude: 127.34147857424789 }, // 기성
    { latitude: 36.254609026870945, longitude: 127.34147857424789 }, // 기성
    { latitude: 36.22316931810321, longitude: 127.29460870302273 }, // 기성
    // 추가적인 위치를 여기에 추가할 수 있습니다.
  ]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=l190g2vt6v`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const initialLatitude = 36.3504119; // 초기 지도 중심의 위도
      const initialLongitude = 127.3845475; // 초기 지도 중심의 경도

      const location = new window.naver.maps.LatLng(initialLatitude, initialLongitude);
      const mapInstance = new window.naver.maps.Map('map', {
        center: location,
        zoom: 17,
      });

      setMap(mapInstance); // 지도 인스턴스 상태에 저장
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const addMarkers = () => {
    if (map) {
      markerLocations.forEach((location) => {
        const targetLocation = new window.naver.maps.LatLng(location.latitude, location.longitude);

        // 각 위치에 마커 추가
        new window.naver.maps.Marker({
          position: targetLocation,
          map: map,
        });
      });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h1 style={{ textAlign: 'center', fontSize: '36px', letterSpacing: '3px' }}>🚩폐의약품 수거함 위치 확인🚩</h1>
          <div id="map" style={{ 
            width: '1200px', 
            height: '700px',
            border: '5px solid #f7e600', // 테두리 색상: 오렌지
            borderRadius: '10px', // 모서리 둥글게
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' // 그림자 추가
          }}></div>
          <button onClick={addMarkers} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '18px', backgroundColor: '#f7e600', color: 'black', border: 'none', cursor: 'pointer' }}>마커 찍기</button>
        </div>
        <div className="col-md-4">
          {/* 추가 정보 또는 사이드바 내용을 여기에 추가 */}
        </div>
      </div>
    </div>
  );
}

export default App;