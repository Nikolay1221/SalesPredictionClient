from flask import Flask, request, jsonify
import pandas as pd
import json
import prophet_model

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.content_type != 'application/json':
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        processed_data = prophet_model.main_process(json_data)
        processed_data['month'] = processed_data['month'].dt.strftime('%Y-%m-%d')
        print(processed_data)

        processed_json = processed_data.to_dict(orient='records')
        
        with open('processed_data.json', 'w') as json_file:
            json.dump(processed_json, json_file, indent=4)
        
        return jsonify(processed_json), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
