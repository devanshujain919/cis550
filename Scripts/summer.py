import MySQLdb
import csv

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

with open('summer_Athlete_won.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile)
	k = 0
	for row in reader:
		sql = "INSERT INTO Athlete_won (Year, Season, Sport, Event) VALUES ('" + row[0] + "','Summer','" + row[2] + "','" + row[3] + "');";
		print(sql)
		try:
			cursor.execute(sql)
			db.commit()
		except Exception as e:
			print e
			continue
		print(row[0] + "   " + row[1] + "   " + row[2] + "   " + row[3])
db.close()