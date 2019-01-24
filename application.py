from flask import Flask, render_template, url_for, jsonify, request
from pymongo import MongoClient

import datetime
from pprint import pprint

import re

app = Flask(__name__)
client = MongoClient()
db = client.gis0

@app.route('/')
def index():
    return render_template("leaflet2.html")

@app.route('/search', methods=['POST'])
def search():
    # get data
    nomer_pelanggan = request.form.get('nomer_pel')
    nama_pelanggan = request.form.get('nama_pel')
    jalan_pelanggan = request.form.get('jalan_pel')
    print(nomer_pelanggan)
    print(type(nomer_pelanggan))
    if not nomer_pelanggan:
        cari = list(db.pelangganlok.find({
            "properties.NAMA": re.compile(nama_pelanggan, re.IGNORECASE),
            "properties.ALAMAT_1": re.compile(jalan_pelanggan, re.IGNORECASE)}).sort("properties.NAMA",1))
    else:
        cari = list(db.pelangganlok.find({
            "properties.NO__SAMBUN": nomer_pelanggan,
            "properties.NAMA": re.compile(nama_pelanggan, re.IGNORECASE),
            "properties.ALAMAT_1": re.compile(jalan_pelanggan, re.IGNORECASE)}).sort("properties.NAMA",1))
    if len(cari) == 0:
        return jsonify([])
    hasil = []
    for c in cari:
        hasil.append({"nomer": c['properties']['NO__SAMBUN'], 
                    "nama": c['properties']['NAMA'],
                    "alamat": c['properties']['ALAMAT_1'] ,
                    "coordinates": c['geometry']['coordinates']})
    # print(hasil)
    # print(nama_pelanggan)
    return jsonify(hasil)
