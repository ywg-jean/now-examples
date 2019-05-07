# -*- coding: utf-8 -*-

from scripts import tabledef
from scripts import forms
from scripts import helpers
from flask import Flask, redirect, url_for, render_template, request, session
import json
import sys
import os


app = Flask(__name__)
app.secret_key = os.environ['SECRET_KEY']


@app.route("/logout")
def logout():
    session['logged_in'] = False
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
