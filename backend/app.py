from flask import Flask, jsonify
from flask_cors import CORS

# Инициализация приложения Flask
app = Flask(__name__)
# Разрешаем запросы с разных доменов (например, с фронтенда на Vercel)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    # Базовый маршрут для проверки работы бекенда
    return jsonify({
        "message": "Добро пожаловать в бекенд Telegram Mini App"
    })

# Пример дополнительного маршрута, который может возвращать данные профиля
@app.route('/api/profile', methods=['GET'])
def get_profile():
    profile_data = {
        "username": "test_user",
        "level": 5,
        "rewards": ["reward1", "reward2"]
    }
    return jsonify(profile_data)

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Ресурс не найден"}), 404

if __name__ == '__main__':
    # Запуск приложения в режиме отладки на порту 5000
    app.run(host='0.0.0.0', port=5000, debug=True) 