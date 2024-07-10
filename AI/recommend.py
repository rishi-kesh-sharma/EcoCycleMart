
import pandas as pd


# train_data = pd.read_csv('marketing_sample_for_walmart_com-walmart_com_product_review__20200701_20201231__5k_data.tsv', sep='\t')
train_data = pd.read_json('clean_data.json')
print(train_data,"train data")


# load models

import pickle

# Load user-item interaction matrix
with open('user_item_matrix.pkl', 'rb') as f:
    user_item_matrix = pickle.load(f)

# Load user similarity matrix
with open('user_similarity.pkl', 'rb') as f:
    user_similarity = pickle.load(f)

# Load item similarity matrix
with open('item_similarity.pkl', 'rb') as f:
    item_similarity = pickle.load(f)

# Load vectorizer
with open('vectorizer.pkl', 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

#rating based recommendation

def rating_based_recommendation(top_n=10):
    # average_ratings = train_data.groupby(['name','ReviewCount','brand','imageUrl','shop','images','_id','originalPrice','discountPrice'])['ratings'].mean().reset_index()
    average_ratings = train_data.groupby(['name','ReviewCount','brand','imageUrl'])['ratings'].mean().reset_index()

    # Merge the grouped DataFrame with the original DataFrame to retain additional fields
    merged_data = pd.merge(
        average_ratings,
        train_data[['name', 'ReviewCount', 'brand', 'imageUrl', 'shop', 'images', '_id', 'originalPrice', 'discountPrice',]],
        on=['name', 'ReviewCount', 'brand', 'imageUrl'],
        how='left'
    ).drop_duplicates(subset=['name', 'ReviewCount', 'brand', 'imageUrl'])


    top_rated_items = merged_data.sort_values(by='ratings', ascending=False)

    rating_base_recommendation = top_rated_items.head(top_n)
    rating_base_recommendation['ratings'] = rating_base_recommendation['ratings'].astype(int)
    rating_base_recommendation['ReviewCount'] = rating_base_recommendation['ReviewCount'].astype(int)
    rating_base_recommendation['shop'] = rating_base_recommendation['shop']
    rating_base_recommendation['images'] = rating_base_recommendation['images']
    rating_base_recommendation['_id'] = rating_base_recommendation['_id'].apply(lambda x: x['$oid'])
    rating_base_recommendation['originalPrice'] = rating_base_recommendation['originalPrice']
    rating_base_recommendation['discountPrice'] = rating_base_recommendation['discountPrice']
    rating_base_recommendation['shop'] = train_data['shop']
    rating_base_recommendation['images'] = train_data['images']
    rating_base_recommendation['_id'] = train_data['_id'].apply(lambda x: x['$oid'])
    rating_base_recommendation['originalPrice'] = train_data['originalPrice']
    rating_base_recommendation['discountPrice'] = train_data['discountPrice']


    print("Rating Base Recommendation System: (Trending Products)")
    print(rating_base_recommendation.columns,"ratings based recomm")
    # rating_base_recommendation[['name','ratings','ReviewCount','brand','imageUrl','shop']] = rating_base_recommendation[['name','ratings','ReviewCount','brand','imageUrl','shop']]
    return rating_base_recommendation
    


def content_based_recommendations(item_name, top_n=10):
    # Check if the item name exists in the training data
    if item_name not in train_data['name'].values:
        print(f"Item '{item_name}' not found in the training data.")
        return pd.DataFrame()

    # Apply TF-IDF vectorization to item descriptions
    # tfidf_matrix_content = tfidf_vectorizer.fit_transform(train_data['Tags'])

    # # Calculate cosine similarity between items based on descriptions
    # cosine_similarities_content = cosine_similarity(tfidf_matrix_content, tfidf_matrix_content)

    # Find the index of the item
    item_index = train_data[train_data['name'] == item_name].index[0]

    # Get the cosine similarity scores for the item
    similar_items = list(enumerate(item_similarity[item_index]))

    # Sort similar items by similarity score in descending order
    similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

    # Get the top N most similar items (excluding the item itself)
    top_similar_items = similar_items[1:top_n+1]

    # Get the indices of the top similar items
    recommended_item_indices = [x[0] for x in top_similar_items]

    # Get the details of the top similar items
    recommended_items_details = train_data.iloc[recommended_item_indices][['name', 'ReviewCount', 'brand', 'imageUrl', 'ratings']]

    recommended_items_details['ratings'] = recommended_items_details['ratings'].astype(int)
    recommended_items_details['ReviewCount'] = recommended_items_details['ReviewCount'].astype(int)
    recommended_items_details['shop'] = train_data['shop']
    recommended_items_details['images'] = train_data['images']
    recommended_items_details['_id'] = train_data['_id'].apply(lambda x: x['$oid'])
    recommended_items_details['originalPrice'] = train_data['originalPrice']
    recommended_items_details['discountPrice'] = train_data['discountPrice']

    return recommended_items_details





def collaborative_filtering_recommendations(train_data, user_item_matrix, user_similarity, target_user_id, top_n=10):
    # Create the user-item matrix
    # user_item_matrix = train_data.pivot_table(index='ID', columns='ProdID', values='Rating', aggfunc='mean').fillna(0)

    # Calculate the user similarity matrix using cosine similarity
    # user_similarity = cosine_similarity(user_item_matrix)

    # Find the index of the target user in the matrix
    target_user_index = user_item_matrix.index.get_loc(target_user_id)

    # Get the similarity scores for the target user
    user_similarities = user_similarity[target_user_index]

    # Sort the users by similarity in descending order (excluding the target user)
    similar_users_indices = user_similarities.argsort()[::-1][1:]

    # Generate recommendations based on similar users
    recommended_items = []

    for user_index in similar_users_indices:
        # Get items rated by the similar user but not by the target user
        rated_by_similar_user = user_item_matrix.iloc[user_index]
        not_rated_by_target_user = (rated_by_similar_user == 0) & (user_item_matrix.iloc[target_user_index] == 0)

        # Extract the item IDs of recommended items
        recommended_items.extend(user_item_matrix.columns[not_rated_by_target_user][:top_n])

    # Get the details of recommended items
    recommended_items_details = train_data[train_data['_id'].isin(recommended_items)][['name', 'ReviewCount', 'brand', 'imageUrl', 'ratings']]

    return recommended_items_details.head(10)

# Example usage
# target_user_id = 4
# top_n = 5
# collaborative_filtering_rec = collaborative_filtering_recommendations(train_data, target_user_id)
# print(f"Top {top_n} recommendations for User {target_user_id}:")
# collaborative_filtering_rec













def hybrid_recommendations(target_user_id, item_name, top_n=10):
      # Get content-based recommendations
    content_based_rec = content_based_recommendations(train_data,  item_similarity, target_user_id, item_name, top_n)

    # Get collaborative filtering recommendations
    collaborative_filtering_rec = collaborative_filtering_recommendations(train_data, user_item_matrix, user_similarity, target_user_id, top_n=10)
    
    # Merge and deduplicate the recommendations
    hybrid_rec = pd.concat([content_based_rec, collaborative_filtering_rec]).drop_duplicates()
    return hybrid_rec.head(10)









# Example usage:
# target_user_id = 10  # Change this to the user_id you want recommendations for
# item_name = 'Black Radiance Perfect Tone Matte Lip Crème, Succulent Plum'

# Assuming user_item_matrix, user_similarity, and item_similarity are numpy arrays loaded from memory
# user_item_matrix = ...
# user_similarity = ...
# item_similarity = ...

# Generate recommendations
# hybrid_rec = hybrid_recommendations(target_user_id, item_name, top_n=10)

# print(f"Top 10 Hybrid Recommendations for User {target_user_id} and Item '{item_name}':")
# print(hybrid_rec)

print('rating_based_recommendation')
print(rating_based_recommendation())


__all__= ['hybrid_recommendations','content_based_recommendations','collaborative_filtering_recommendations','rating_based_recommendation']