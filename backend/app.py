from flask import Flask, request
from pydantic import BaseModel, ValidationError


app = Flask(__name__)

class CodeModel(BaseModel):
    data: str
    name: str

    class Config:
      extra = "forbid"

@app.route('/code', methods=['POST'])
def code():
    try:
        # Get JSON data from request
        json_data = request.json
        print(json_data)
        code_model = CodeModel(**json_data)
        print(code_model)
        # Return response
        return "Hello from team project backend!"
    except ValidationError as e:
        return str(e), 400


if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app in debug mode