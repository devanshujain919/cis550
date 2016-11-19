import MySQLdb
import csv

from collections import defaultdict

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

player=[]

country=defaultdict(lambda: 'NULL')

with open('country.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        country[row[1]] = row[0]

# print(country)

with open('summer_Athlete_won.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        # sql = "INSERT INTO Athlete (Name, Country) VALUES (%s, %s);"
        sql = "INSERT INTO Athlete_won (Year, Season, Sport, Event, Name, Country, Medal) VALUES (%s, %s, %s, %s, %s, %s, %s);";
        print(sql)
        try:
            cursor.execute(sql, (row[0], 'Summer', row[2], row[3], unicode(row[4], 'utf-8', errors='replace'), country[row[5]], row[6]))
            db.commit()
        except Exception as e:
            print e