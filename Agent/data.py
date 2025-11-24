import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

def get_film_data(category: str = None, sort: str = "Newest", search: str = None, type_film: str = "All") -> str:
    """
    Retrieves movie list from the database. 
    MUST be called when user asks for movies, specific genres (Animation, Action), or recommendations.
    
    Args:
        category (str): Genre name (e.g., 'Animation', 'Action').
        sort (str): 'Newest' or 'Trending'.
    """
    
    # Lấy URL từ biến môi trường BACKEND_API_URL (Trỏ về Node.js)
    base_url = os.getenv("BACKEND_API_URL")
    api_endpoint = f"{base_url}/film/getAllFilm"
    
    params = {}
    if category: params['category'] = category
    if sort: params['sort'] = sort
    if search: params['search'] = search
    if type_film: params['typeFilm'] = type_film

    try:
        print(f"\n🔌 [Tool] Đang gọi API: {api_endpoint} | Params: {params}")
        response = requests.get(api_endpoint, params=params)
        response.raise_for_status()
        
        result = response.json()
        
        # Kiểm tra cấu trúc trả về từ Controller Node.js
        if result.get('data') and result['data'].get('success'):
            raw_films = result['data']['data']
            
            # 💡 Tối ưu hóa: Chỉ lấy các trường cần thiết để AI đọc nhanh hơn
            clean_films = []
            for f in raw_films:
                clean_films.append({
                    "Id": f.get("_id"),
                    "Title": f.get("name"),
                    "Genre": f.get("genre"),
                    "Rating": f.get("totalRating"),
                    "Views": f.get("views"),
                    "Type": f.get("type")
                })
            
            # Trả về chuỗi JSON để Agent đọc
            return json.dumps(clean_films, ensure_ascii=False)
        else:
            return "Không tìm thấy phim nào khớp với yêu cầu."

    except Exception as e:
        print(f"❌ Lỗi Tool: {e}")
        return f"Gặp lỗi khi lấy dữ liệu phim: {str(e)}"
    
