from flask import Flask, json, jsonify, request
app = Flask(__name__)
from recommend import hybrid_recommendations,content_based_recommendations,collaborative_filtering_recommendations,rating_based_recommendation


@app.route('/health-check',methods=['GET'])
def health_check():
    msg = 'Flask server is up and running !!!'
    response = jsonify({"msg":msg})
    response.status_code=200
    return response


@app.route('/top-rated-products', methods=['POST']) 
def top_rated_products():

    # target_user_id = 10  # Change this to the user_id you want recommendations for
    # item_name = 'Black Radiance Perfect Tone Matte Lip Crème, Succulent Plum'
    data = request.get_json()
    print(data,'data')
    top_n = data['top_n']

    top_rated_rec = rating_based_recommendation(top_n)
    top_rated_rec = top_rated_rec.to_dict(orient = "records")
    response = jsonify(top_rated_rec)
    response.status_code = 200
    return response


@app.route('/recommended-products', methods=['POST']) 
def recommend_products():

    # target_user_id = 10  # Change this to the user_id you want recommendations for
    # item_name = 'Black Radiance Perfect Tone Matte Lip Crème, Succulent Plum'

    target_user_id = request.data.target_user_id
    item_name = request.data.item_name
    top_n = request.data.top_n
    hybrid_rec = hybrid_recommendations(target_user_id, item_name, top_n)
    hybrid_rec= hybrid_rec.to_dict(orient = "records")
    response = jsonify(hybrid_rec)
    response.status_code = 200
    return response


@app.route('/related-products', methods=['POST']) 
def related_products():

    data = request.get_json()
    print(data,'data')
    top_n = data['top_n']
    item_name = data['item_name']

    print(item_name,'item_name')

    related_rec = content_based_recommendations(item_name, top_n)
    print(related_rec,"related records")
    related_rec = related_rec.to_dict(orient = "records")
    response = jsonify(related_rec)
    response.status_code = 200
    return response

if __name__ == "__main__":
    app.run(debug=True)