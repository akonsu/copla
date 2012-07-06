# -*- mode:python; coding:utf-8; -*- Time-stamp: <application.py - root>

from flask import Flask

import flask

app = Flask(__name__)

@app.route("/")
def index():
    return flask.render_template("index.html")

@app.route("/save/", methods=["OPTIONS", "POST"])
def save():
    ALLOWED_ORIGINS = ["http://localhost.com:5000"]

    origin = flask.request.headers.get("Origin", "")
    response = flask.make_response(flask.jsonify(result="saved"))

    if origin in ALLOWED_ORIGINS:
        #response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Origin"] = origin

    return response

if __name__ == '__main__':
    app.run()
