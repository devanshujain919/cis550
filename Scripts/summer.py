import MySQLdb
import csv

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

with open('summer_Athlete_won.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile)
	k = 0
	for row in reader:
		sql = "INSERT INTO Events (Year, Season, Sport, Event) VALUES (%s,%s,%s,%s);"
		print(sql)
		try:
			cursor.execute(sql, (row[0], 'Summer', row[2], row[3].decode('ISO-8859-1')))
			db.commit()
		except MySQLdb.IntegrityError as err:
			print("Error: {}".format(err))
		except Exception as e:
			print(e)
			exit()
db.close()