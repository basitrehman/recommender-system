#!/usr/bin/python3

import psycopg2
import psql_credentials as creds
import datetime

conn = ""

'''
calculate Jaccard Similarity
'''
def jaccard_similarity(unrated_article_categories, rated_article_categories, rated_article_rating):
    
    intersection = len(set.intersection(*[set(unrated_article_categories), set(rated_article_categories)]))
    union = len(set.union(*[set(unrated_article_categories), set(rated_article_categories)]))
    
    ''' Similarity = (A geschnitten B) / (A vereinigt B) '''
    similarity = intersection/float(union)
    
    ''' multiply by rating of current article '''
    score = similarity * rated_article_rating
    
    return score

'''
get connection
'''
def get_connection():
	try:
		conn_string = 	"host=" + creds.PGHOST + \
						" port=" + "5432" + \
						" dbname=" + creds.PGDATABASE + \
						" user=" + creds.PGUSER + \
						" password=" + creds.PGPASSWORD

		connection = psycopg2.connect(conn_string)

		return connection#.cursor()
	except(Exception, psycopg2.DatabaseError) as error:
		print(error)

'''
get IDs of all registered users
'''
def get_user_ids(cursor):
	#cursor = get_connection()
	cursor.execute("SELECT id FROM users")
	user_ids = [item[0] for item in cursor.fetchall()]
	#cursor.close()

	return user_ids

'''
get rated articles of a specific user
'''
def get_rated_articles(cursor, user_id):
	cursor.execute("SELECT articles.id, articles.article, rating \
					FROM ratings \
					JOIN articles ON (ratings.article_id = articles.id) \
					AND user_id = %s", [user_id])

	rated_articles = cursor.fetchall()

	return rated_articles

'''
get articles that share categories with an specific article
'''
def get_similiar_articles(cursor, article_id):
	cursor.execute("SELECT * FROM articles join article_categories on (articles.id = article_categories.article_id) \
						JOIN categories ON (article_categories.category_id = categories.id) \
						AND categories.category IN \
						(SELECT category FROM categories JOIN article_categories ON (categories.id = article_categories.category_id) \
						AND article_categories.article_id = %s)", [article_id])
		
	overall_articles = cursor.fetchall()

	return overall_articles

'''
get categories of an specific article
'''
def get_article_categories(cursor, article_id):
	cursor.execute("SELECT categories.category \
					FROM categories \
					JOIN article_categories ON (article_categories.category_id = categories.id) \
					AND article_categories.article_id = %s", [article_id])
			
	categories = [item[0] for item in cursor.fetchall()]

	return categories

def save_score(cursor, user_id, article_id, score):
	cursor.execute("INSERT INTO recommendations (user_id, article_id, score) VALUES (%s, %s, %s) \
								ON CONFLICT (article_id, user_id) DO \
								UPDATE SET score = %s", [user_id, article_id, score, score])

	conn.commit()

if __name__ == '__main__':

	start = datetime.datetime.now()

	'''global variables'''
	score_sum = 0
	loop_counter = 0

	conn = get_connection()
	cursor = conn.cursor()

	user_ids = get_user_ids(cursor)

	for current_user_id in user_ids:

		# get rated articles of current user
		rated_articles = get_rated_articles(cursor, current_user_id)

		#for rated_article_id in rated_ids:
		for rated_article in rated_articles:
			# get all articles that share categories
			# get all articles that are same, i.e. share categories
			overall_articles = get_similiar_articles(cursor, rated_article[0])

			for i in overall_articles:
				unrated_article_id = i[0]
				unrated_article = i[1]

				# get categories of current unrated article
				unrated_categories = get_article_categories(cursor, unrated_article_id)

				score_sum = 0
				for j in rated_articles:
					rated_article_id = j[0]
					rated_article = j[1]
					rating = int(j[2])

					# get categories of current rated article
					rated_categories = get_article_categories(cursor, rated_article_id)

					current_score = jaccard_similarity(unrated_categories, rated_categories, rating)
					score_sum += current_score

				# insert score into recommendations table
				# if duplicate key then only update the score
				save_score(cursor, current_user_id, unrated_article_id, score_sum)

				print("Article: " + unrated_article + " scored", score_sum)
				
				loop_counter += 1
				print(loop_counter)

	end = datetime.datetime.now()
	print("Start: " + start.strftime("%H:%M:%S"))
	print("End: " + end.strftime("%H:%M:%S"))

