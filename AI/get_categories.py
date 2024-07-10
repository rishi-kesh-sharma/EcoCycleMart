import pandas as pd
import json


train_data = pd.read_csv('marketing_sample_for_walmart_com-walmart_com_product_review__20200701_20201231__5k_data.tsv',sep='\t')

most_frequent_categories = train_data['Product Category'].value_counts()


most_frequent_categories_list = [{'value': index, 'count': count} for index, count in most_frequent_categories.items()]
json_file_path = 'most_frequent_categories.json'

with open(json_file_path, 'w') as json_file:
    json.dump(most_frequent_categories_list, json_file, indent=4)



top_n = 10

most_frequent_categories_top_n = most_frequent_categories_list[:top_n]

json_file_path = 'most_frequent_categories_top_10.json'

with open(json_file_path, 'w') as json_file:
    json.dump(most_frequent_categories_top_n, json_file, indent=4)





