import plotly.io as pio
import json

# Please change the path to the 
# location of the downloaded JSON file
JSON_FILE_PATH='./report.json'

with open(JSON_FILE_PATH, 'r') as file:
    json_data = json.load(file)
    for chart in json_data:
        pio.show(chart)