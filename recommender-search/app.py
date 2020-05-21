#!/usr/bin/python3

# -*- coding: UTF-8 -*-
import psycopg2
import datetime
import json
import requests
import psql_credentials as creds

from flask import Flask, jsonify, abort, request, make_response, url_for

'''
get Connection
'''
def getConnection():     
    conn_string = "host="+ creds.PGHOST +" port="+ "5432" +" dbname=" \
    + creds.PGDATABASE +" user=" + creds.PGUSER +" password="+ creds.PGPASSWORD
    
    conn = psycopg2.connect(conn_string)   
    
    return conn.cursor()

def search_article(search_string, user_id):
    result= []   
    
    cursor = getConnection()
    
    search_string = search_string.replace(" ", "<->")
    print(search_string)
    
    '''
    cursor.execute("SELECT article_abstracts.article_id, article, score FROM article_abstracts \
                    JOIN articles ON (articles.id = article_abstracts.article_id) \
                    JOIN recommendations ON (article_abstracts.article_id = recommendations.article_id) \
                    AND ts_vector @@ to_tsquery(%s) \
                    ORDER BY score \
                    DESC \
                    limit 50", [search_string])
    '''

    cursor.execute("SELECT article_abstracts.article_id, article FROM article_abstracts \
                    JOIN articles ON (articles.id = article_abstracts.article_id) \
                    AND ts_vector @@ to_tsquery(%s) \
                    limit 100", [search_string])

    search_result = cursor.fetchall() 

    #cursor.execute("SELECT article_id, score FROM recommendations WHERE user_id = %s order by score DESC limit 100", [user_id])
    cursor.execute("SELECT article_id, article FROM recommendations join articles on (articles.id = recommendations.article_id) \
                    WHERE user_id = %s order by score DESC limit 100", [user_id])
    recommended = cursor.fetchall()

    for article in search_result:
        #for recommended_article in recommended:
        #    if article[0] == 668922 and recommended_article[0] == 668922:
        #        print("true")

        if article in recommended:
            object = { 'article_id': article[0], 'title': article[1], 'isRecommended': True } 
            result.append(object)
        else:
            object = { 'article_id': article[0], 'title': article[1], 'isRecommended': False }
            result.append(object)

        '''for recommended_article in recommended:
            print("inner loop: articleID {} recommended_articleID {}".format(article[0], recommended_article[0]))
            if (article[0] == recommended_article[0]):
                print("true")
                object = { 'article_id': article[0], 'title': article[1], 'score': recommended_article[1], 'isRecommended': True } 
                result.append(object)
                inserted_to_json = True
            #else:
        if (inserted_to_json == False):
            print("no recommendation")
            object = { 'article_id': article[0], 'title': article[1], 'score': 0, 'isRecommended': False }
            result.append(object) '''
           
    print(len(result))
    return sorted(result, key=lambda k: k.get('isRecommended', 0), reverse=True)
    # maybe later
    #return sorted(result, key=lambda k: k.get('score', 0), reverse=True)
    
app = Flask(__name__, static_url_path = "")

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)
   
@app.route('/v1/search/<int:userid>/<string:searchstring>', methods = ['GET'])
def search(userid,searchstring):
    return make_response(jsonify( { 'user': userid, 'search': searchstring, 'result' : search_article(searchstring, userid)} ))

if __name__ == '__main__':
    app.run(host=creds.PGHOST, port=creds.APPPORT, threaded=True)
