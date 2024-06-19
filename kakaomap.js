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

    document.getElementById('locateButton').addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                currentPosition = new kakao.maps.LatLng(lat, lng);
                map.setCenter(currentPosition);
            });
        } else {
            alert('GPS를 지원하지 않습니다');
        }
    });

    document.getElementById('searchButton').addEventListener('click', function () {
        var keywords = [];
        if (document.getElementById('gym').checked) keywords.push('헬스장');
        if (document.getElementById('park').checked) keywords.push('공원');
        if (document.getElementById('playground').checked) keywords.push('운동장');

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
                }
            }, { location: locPosition, radius: 1000 });
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
        });
    }

    function clearMarkers() {
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
    }
});
