document.addEventListener('DOMContentLoaded', function () {
    var mapContainer = document.getElementById('map');
    var mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 5
    };
    var map = new kakao.maps.Map(mapContainer, mapOption);
    var placesService = new kakao.maps.services.Places();
    var markers = [];
    var currentPosition = null;
    var circle = null;

    document.getElementById('locateButton').addEventListener('click', function () {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                currentPosition = new kakao.maps.LatLng(lat, lng);
                map.setCenter(currentPosition);
    
                // 현재 위치에 마커 추가
                var currentMarker = new kakao.maps.Marker({
                    position: currentPosition,
                    map: map
                });
    
                // 현재 위치에 원 추가
                if (circle) {
                    circle.setMap(null);
                }
                circle = new kakao.maps.Circle({
                    center: currentPosition,
                    radius: 500,
                    strokeWeight: 2,
                    strokeColor: '#75B8FA',
                    strokeOpacity: 1,
                    strokeStyle: 'solid',
                    fillColor: '#CFE7FF',
                    fillOpacity: 0.5
                });
                circle.setMap(map);
            },
            function (error) {
                console.error("Error Code = " + error.code + " - " + error.message);
                alert('위치 정보를 가져오는 데 실패했습니다.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
    

    document.getElementById('searchButton').addEventListener('click', function () {
        var keywords = [];
        if (document.getElementById('gym').checked) keywords.push('헬스장');
        if (document.getElementById('park').checked) keywords.push('공원');
        if (document.getElementById('playground').checked) keywords.push('운동장');
        if (document.getElementById('pilates').checked) keywords.push('필라테스');
        if (document.getElementById('yoga').checked) keywords.push('요가');
        if (document.getElementById('gymnasium').checked) keywords.push('체육관');

        if (currentPosition) {
            searchPlaces(currentPosition, keywords);
        } else {
            alert('먼저 내 위치 찾기 버튼을 눌러 위치를 설정하세요.');
        }
    });

    function searchPlaces(locPosition, keywords) {
        clearMarkers();
        document.getElementById('placesList').innerHTML = '';
        
        keywords.forEach(function (keyword) {
            placesService.keywordSearch(keyword, function (data, status, pagination) {
                if (status === kakao.maps.services.Status.OK) {
                    displayPlaces(data);
                    displayMarkers(data);
                } else {
                    console.error('검색 중 오류 발생:', status);
                }
            }, { location: locPosition, radius: 500 });
        });
    }

    function displayPlaces(places) {
        var listEl = document.getElementById('placesList');
        
        places.forEach(function (place) {
            var itemEl = document.createElement('li');
            itemEl.textContent = place.place_name;
            listEl.appendChild(itemEl);
        });
    }

    function displayMarkers(places) {
        places.forEach(function (place) {
            var markerPosition = new kakao.maps.LatLng(place.y, place.x);
            var marker = new kakao.maps.Marker({
                position: markerPosition,
                map: map
            });
            markers.push(marker);

            // 마커에 클릭 이벤트를 등록하여 장소 이름 표시
            // 인포윈도우 상태를 추적하는 변수
    var infowindowVisible = false;
    
    // 인포윈도우 객체 생성
    var infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;color:black;">${place.place_name}</div>`
    });
    
    kakao.maps.event.addListener(marker, 'click', function () {
        if (infowindowVisible) {
            // 인포윈도우가 열려있으면 닫기
            infowindow.close();
        } else {
            // 인포윈도우가 닫혀있으면 열기
            infowindow.open(map, marker);
        }
        // 인포윈도우 상태 반전
        infowindowVisible = !infowindowVisible;
    });

        });
    }

    function clearMarkers() {
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
    }
});
