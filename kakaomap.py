import requests
import json

def search_places(query):
    url = 'https://dapi.kakao.com/v2/local/search/keyword.json?query={}'.format(query)
    headers = {
        "Authorization": "KakaoAK 1e35adc52e5b87b46dbba3035b63110b"
    }
    response = requests.get(url, headers=headers)
    return response.json()['documents']

searching = '합정 스타벅스'
places = search_places(searching)

# JSON 파일로 저장하여 JavaScript에서 읽을 수 있도록 합니다.
with open('places.json', 'w', encoding='utf-8') as f:
    json.dump(places, f, ensure_ascii=False, indent=4)
