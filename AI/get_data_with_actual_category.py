import pandas as pd
# import json

cleaned_data = pd.read_json('clean_data.json')
original_data = pd.read_csv('marketing_sample_for_walmart_com-walmart_com_product_review__20200701_20201231__5k_data.tsv',sep='\t')


cleaned_data['category'] = original_data['Product Category']


json_file_path = 'clean_data_with_actual_categories.json'

# Write the DataFrame to a JSON file as an array of records
cleaned_data.to_json(json_file_path, orient='records', indent=4)

# with open(json_file_path, 'w') as json_file:
#     json.dump(json_data_with_actual_categories, json_file, indent=4)

