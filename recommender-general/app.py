#!/usr/bin/python3

# -*- coding: UTF-8 -*-
import psycopg2
import psql_credentials as creds

from flask import Flask, jsonify, abort, request, make_response, url_for

RESULT_SIZE = 50

'''
get Connection
'''
def getConnection():    
    conn_string = "host="+ creds.PGHOST +" port="+ "5432" +" dbname=" \
    + creds.PGDATABASE +" user=" + creds.PGUSER +" password="+ creds.PGPASSWORD
    
    conn = psycopg2.connect(conn_string)   
    
    return conn.cursor()

'''
fill up list of recommendations so that every user sees same amount of recommendations
'''
def fillRecommendations(recommendations, user_id):
    difference = RESULT_SIZE - len(recommendations)

    cursor = getConnection()
    cursor.execute("SELECT recommendations.article_id, articles.article, substring(article_abstracts.abstract, 0, 250) \
                    FROM recommendations JOIN articles ON (recommendations.article_id = articles.id) \
                    JOIN article_abstracts ON (recommendations.article_id = article_abstracts.article_id) \
                    AND recommendations.user_id != %s \
                    ORDER BY score \
                    DESC \
                    limit %s", [user_id, difference])

    remaining_recommendations = cursor.fetchall()

    for article in remaining_recommendations:
        object = { 'article_id': article[0] , 'title': article[1] , 'abstract': article[2] , 'own_recommendations': False} 
        recommendations.append(object)

    return recommendations

'''
Selects recommended articles for a specific user
'''
def getRecommendationsForUser(id):
    
    recommendations = []    
    
    cursor = getConnection()
    cursor.execute("SELECT recommendations.article_id, articles.article, substring(article_abstracts.abstract, 0, 250) \
                    FROM recommendations \
                    JOIN articles ON (recommendations.article_id = articles.id) \
                    JOIN article_abstracts ON (recommendations.article_id = article_abstracts.article_id) \
                    AND user_id = %s \
                    AND recommendations.article_id NOT IN (SELECT article_id FROM ratings WHERE user_id = %s) \
                    ORDER BY score \
                    DESC \
                    limit %s", [id, id, RESULT_SIZE])

    results = cursor.fetchall() 
    
    result_length = len(results)
    
    counter = 0
    for article in results:
        object = { 'article_id': article[0] , 'title': article[1] , 'abstract': article[2] , 'own_recommendations': True} 
        recommendations.append(object)

    if(len(recommendations) < RESULT_SIZE):
        recommendations = fillRecommendations(recommendations, id)

    print(len(recommendations))

    return recommendations    
    
app = Flask(__name__, static_url_path = "")

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)
   
@app.route('/v1/recommender/<int:userID>', methods = ['GET'])
def recommendForUser(userID):
    recommendations = getRecommendationsForUser(userID)
    return jsonify( { 'user': userID },{'List_Recommendations' : recommendations} )

if __name__ == '__main__':
    app.run(host=creds.PGHOST, port=creds.APPPORT, threaded=True)
