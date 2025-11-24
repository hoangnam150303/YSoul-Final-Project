import requests
import os
import json
from dotenv import load_dotenv
base_url = os.getenv("BACKEND_API_URL")
load_dotenv()


def get_film_data(category: str = None, sort: str = "Newest", search: str = None, type_film: str = "All") -> str:
    """
    Retrieves movie list from the database. 
    MUST be called when user asks for movies, specific genres (Animation, Action), or recommendations.
    
    Args:
        category (str): Genre name (e.g., 'Animation', 'Action').
        sort (str): 'Newest' or 'Trending'.
        search (str): Keywords to search for a movie.
    """
    
    
    # Endpoint cho phim
    api_endpoint = f"{base_url}/film/getAllFilm"
    
    params = {}
    if category: params['category'] = category
    if sort: params['sort'] = sort
    if search: params['search'] = search
    if type_film: params['typeFilm'] = type_film

    try:
        print(f"\n🔌 [Tool] Calling Movie API: {api_endpoint} | Params: {params}")
        response = requests.get(api_endpoint, params=params)
        response.raise_for_status()
        
        result = response.json()
        
        if result.get('data') and result['data'].get('success'):
            raw_films = result['data']['data']
            
            clean_films = []
            for f in raw_films:
                clean_films.append({
                    "Id": f.get("_id"),
                    "Title": f.get("name"),
                    "Genre": f.get("genre"),
                    "Rating": f.get("totalRating"),
                    "Type": "Movie"
                })
            
            return json.dumps(clean_films, ensure_ascii=False)
        else:
            return "Không tìm thấy phim nào khớp với yêu cầu."

    except Exception as e:
        print(f"❌ Error Tool Film: {e}")
        return f"Gặp lỗi khi lấy dữ liệu phim: {str(e)}"


def get_music_data(filter: str = "newest", search: str = None) -> str:
    """
    Retrieves music/song (single) list from the database.
    MUST be called when user asks for songs, music, top hits, or wants to listen to something.

    Args:
        filter (str): Options: 'popular' (most likes), 'favourite' (most listens), 'newest'. Default is 'newest'.
        search (str): Song title keyword to search.
    """
    
    # Endpoint cho nhạc (Dựa trên route Node.js bạn cung cấp)
    api_endpoint = f"{base_url}/single/getAllSingle"
    
    # Mapping tham số cho đúng với backend Node.js
    params = {
        "typeUser": "user", # Mặc định là user để lấy nhạc active
        "filter": filter,
        "search": search
    }

    try:
        print(f"\n🎵 [Tool] Calling Music API: {api_endpoint} | Params: {params}")
        response = requests.get(api_endpoint, params=params)
        response.raise_for_status()
        
        result = response.json()
        
        # Backend trả về { success: true, singles: [...] }
        if result.get('success') and result.get('singles'):
            raw_singles = result['singles']
            
            clean_music = []
            for s in raw_singles:
                # Map các trường từ Postgres (thường là chữ thường)
                clean_music.append({
                    "Id": s.get("id"),
                    "Title": s.get("title"),
                    "Image": s.get("image"),
                    "Likes": s.get("likes"),
                    "Listens": s.get("count_listen"),
                    "Type": "Song" 
                })
            
            return json.dumps(clean_music, ensure_ascii=False)
        else:
            return "Không tìm thấy bài hát nào phù hợp."

    except Exception as e:
        print(f"❌ Error Tool Music: {e}")
        return f"Gặp lỗi khi lấy dữ liệu nhạc: {str(e)}"