import pandas as pd

train_data = pd.read_json('clean_data.json')

print(train_data.shape)

grouped_data = train_data.groupby('name').agg({
    'ReviewCount': 'sum',
    'ratings': 'mean',
    'brand': 'first',
    'imageUrl': 'first',
    'shop': 'first',
    'images': 'first',
    '_id': 'first',
    'discountPrice': 'mean',
    'originalPrice': 'mean'
}).reset_index()

print(grouped_data.shape)
print(grouped_data)

