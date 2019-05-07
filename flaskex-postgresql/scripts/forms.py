# -*- coding: utf-8 -*-

from wtforms import Form, StringField, validators


class LoginForm(Form):
    username = StringField('Username:', validators=[validators.required(), validators.Length(min=1, max=50)])
    password = StringField('Password:', validators=[validators.required(), validators.Length(min=1, max=512)])
    email = StringField('Email:', validators=[validators.optional(), validators.Length(min=0, max=50)])
