import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import os
from scipy.sparse import coo_matrix
import random
import pickle



# data cleaning and filling

# only take required columns 

# train_data = pd.read_csv('clean_data_with_actual_categories.json',sep='\tab')
train_data = pd.read_json('clean_data_with_actual_categories.json')
# train_data = train_data[['Uniq Id','Product Id', 'Product Rating', 'Product Reviews Count', 'Product Category', 'Product Brand', 'Product Name', 'Product Image Url', 'Product Description', 'Product Tags','Product Available Inventory']]

# # Fill missing values in 'Product Rating' with a default value (e.g., 0)
# train_data.fillna({'Product Rating': 0}, inplace=True)
# train_data['Product Rating'] = train_data['Product Rating'].fillna(0)
# # Fill missing values in 'Product Reviews Count' with a default value (e.g., 0)
# train_data.fillna({'Product Reviews Count':0},inplace=True)
# train_data['Product Reviews Count']=train_data['Product Reviews Count'].fillna(0)
# # Fill missing values in 'Product Category' with a default value (e.g., 'Unknown')
# train_data.fillna({'Product Category':''},inplace=True)
# train_data['Product Category']=train_data['Product Category'].fillna('')
# # Fill missing values in 'Product Brand' with a default value (e.g., 'Unknown')
# train_data.fillna({'Product Brand':''},inplace=True)
# train_data['Product Brand']=train_data['Product Brand'].fillna('')
# # Fill missing values in 'Product Description' with an empty string
# train_data.fillna({'Product Description':''},inplace=True)
# train_data['Product Description']=train_data['Product Description'].fillna('')

# make columns shorter
# Define the mapping of current column names to shorter names
# column_name_mapping = {
#     'Uniq Id': 'ID',
#     'Product Id': 'ProdID',
#     'Product Rating': 'ratings',
#     'Product Reviews Count': 'reviewsCount',
#     'Product Category': 'category',
#     'Product Brand': 'brand',
#     'Product Name': 'name',
#     'Product Image Url': 'imageUrl',
#     'Product Description': 'description',
#     'Product Tags': 'tags',
#     'Product Contents': 'contents',
#     'Product Available Inventory':'stock',
# }
# # Rename the columns using the mapping
# train_data.rename(columns=column_name_mapping, inplace=True)



# train_data['ID'] = train_data['ID'].str.extract(r'(\d+)').astype(float)
# train_data['ProdID'] = train_data['ProdID'].str.extract(r'(\d+)').astype(float)
# train_data['_id'] = train_data['ProdID'].str.extract(r'(\d+)').astype(float)
# train_data['_id'] = train_data['ProdID']



#fields to fill

#category
#originalPrice
#discountPrice
#stock
#images
#reviews
#shopId
#shop
#sold_out
#created_At


# fill the missing columns
import numpy as np

train_data['originalPrice'] = np.random.randint(80, 100, size=len(train_data))
train_data['discountPrice'] = np.random.randint(50, 80, size=len(train_data))
train_data['shopId'] = '666f13cf3fd0d601fec90f7a'
train_data['stock'] = np.random.randint(10, 100, size=len(train_data))


# Write the DataFrame to a JSON file
train_data.to_json('final_clean_data.json', orient='records')


# train_data['shop'] = [{"id":"666f13cf3fd0d601fec90f7a","name":"Seller shop"}] * len(train_data)
# train_data['reviews']= [[
#     {
#       "user": {
#         "id": "665f21c77e618e76e9d6e6a9",
#         "name": "Brad Braun",
#         "avatar": {
#           "url": "https://avatars.githubusercontent.com/u/25602579"
#         }
#       },
#       "rating": { "$numberInt": "1" },
#       "comment": "Cibo corrupti tristis aveho comedo cursus quos.",
#       "productId": "product4",
#       "createdAt": "2024-07-06T00:16:13.402Z"
#     },
#     {
#       "user": {
#         "id": "665f21c77e618e76e9d6e6a9",
#         "name": "Bradley Streich",
#         "avatar": {
#           "url": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/899.jpg"
#         }
#       },
#       "rating": { "$numberInt": "4" },
#       "comment": "Victus cattus ullam valeo aegrus color absconditus decipio angelus venustas.",
#       "productId": "product4",
#       "createdAt": "2024-07-05T02:43:07.156Z"
#     },
#     {
#       "user": {
#         "id": "665f21c77e618e76e9d6e6a9",
#         "name": "Theresa Labadie",
#         "avatar": {
#           "url": "https://avatars.githubusercontent.com/u/37587120"
#         }
#       },
#       "rating": { "$numberInt": "3" },
#       "comment": "Sumptus tam consequatur basium tantum adstringo deprecator arca certus.",
#       "productId": "product4",
#       "createdAt": "2024-07-05T04:47:45.163Z"
#     },
#     {
#       "user": {
#         "id": "665f21c77e618e76e9d6e6a9",
#         "name": "Ms. Leigh Welch-Breitenberg",
#         "avatar": {
#           "url": "https://avatars.githubusercontent.com/u/94446299"
#         }
#       },
#       "rating": { "$numberInt": "3" },
#       "comment": "Tolero antea utroque turba voluptatum suscipit adfectus vaco quasi libero.",
#       "productId": "product4",
#       "createdAt": "2024-07-05T22:43:00.935Z"
#     }
#   ]] * len(train_data)

# train_data['category']=random.choice([
#     "Computers and Laptops",
#     "cosmetics and body care",
#     "Accesories",
#     "Cloths",
#     "Shoes",
#     "Gifts",
#     "Pet Care",
#     "Mobile and Tablets",
#     "Music and Gaming",
#     "Others"
# ])

# train_data['images']= [[
#     {
#       "public_id": "fda2b0a0-5ae0-403c-8a81-b39485a36eb6",
#       "url": "https://via.placeholder.com/640x480/f2f2f2/0d0f12.png?text=Product%20Image"
#     },
#     {
#       "public_id": "cb08600b-98fb-41fd-be99-971a22b7cede",
#       "url": "https://via.placeholder.com/640x480/f2f2f2/0d0f12.png?text=Product%20Image"
#     },
#     {
#       "public_id": "59d319eb-bcfb-412c-9066-45601e0ef710",
#       "url": "https://via.placeholder.com/640x480/f2f2f2/0d0f12.png?text=Product%20Image"
#     },
#     {
#       "public_id": "0817d3ca-c350-4dd6-8f81-e582f96af93a",
#       "url": "https://via.placeholder.com/640x480/f2f2f2/0d0f12.png?text=Product%20Image"
#     }
#   ]] * len(train_data)
# train_data['sold_out']= random.randrange(0,10)





#store the clean data to json file
# train_data.to_json('clean_data.json',orient='records')
# train_data = pd.read_csv('marketing_sample_for_walmart_com-walmart_com_product_review__20200701_20201231__5k_data.tsv', sep='\t')



# Tags creation

# import spacy
# from spacy.lang.en.stop_words import STOP_WORDS
# import sys
# print(sys.executable)
# nlp = spacy.load('en_core_web_sm')

# def clean_and_extract_tags(text):
#     doc = nlp(text.lower())
#     tags = [token.text for token in doc if token.text.isalnum() and token.text not in STOP_WORDS]
#     return ', '.join(tags)

# columns_to_extract_tags_from = ['Category', 'Brand', 'Description']

# for column in columns_to_extract_tags_from:
#     train_data[column] = train_data[column].apply(clean_and_extract_tags)

# train_data = pd.read_json('clean_data.json')
# print(train_data,"train data")

train_data['_id'] = train_data['_id'].apply(lambda x: x['$oid'])


user_item_matrix = train_data.pivot_table(index='_id', columns='ProdID', values='ratings', aggfunc='mean').fillna(0)

  # Calculate the user similarity matrix using cosine similarity
user_similarity = cosine_similarity(user_item_matrix)

tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix_content = tfidf_vectorizer.fit_transform(train_data['tags'])
cosine_similarities_content = cosine_similarity(tfidf_matrix_content,tfidf_matrix_content)
cosine_similarities_content = cosine_similarity(tfidf_matrix_content, tfidf_matrix_content)


# save models

# Save user-item interaction matrix
with open('user_item_matrix.pkl', 'wb') as f:
    pickle.dump(user_item_matrix, f)

# Save user similarity matrix
with open('user_similarity.pkl', 'wb') as f:
    pickle.dump(user_similarity, f)

# Save item similarity matrix
with open('item_similarity.pkl', 'wb') as f:
    pickle.dump(cosine_similarities_content, f)

# Save vectorizer
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf_vectorizer, f)

# import pickle

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
