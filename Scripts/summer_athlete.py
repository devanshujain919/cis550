import MySQLdb
import csv

from collections import defaultdict

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')
# db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

player=[]

unrecog_country = set()

country=defaultdict(lambda: 'NULL')

csvfile = open('country.csv')
reader = csv.reader(csvfile)
for row in reader:
    country[row[1]] = row[0]

csvfile = open('summer_Athlete_won.csv')
reader = csv.reader(csvfile,dialect=csv.excel)
i = 0
for row in reader:
    i += 1
    # print(row[4])
    # print(country[row[5]])
    # sql = "INSERT INTO Athlete (Name, Country) VALUES (%s, %s);"
    sql = "INSERT INTO Athlete_won (Year, Season, Sport, Event, Name, Country, Medal) VALUES (%s, %s, %s, %s, %s, %s, %s);";
    try:
        print('>>>>' + row[4].decode('ISO-8859-2'))
        # cursor.execute(sql, (row[4].decode('ISO-8859-2'),country[row[5]]))
        cursor.execute(sql, (row[0], 'Summer', row[2], row[3].decode('ISO-8859-1'), row[4].decode('ISO-8859-2'), country[row[5]], row[6]))
        db.commit()
    except MySQLdb.IntegrityError as err:
        print("Error: {}".format(err))
    except Exception as e:
        print(i)
        print(e)
        exit()
print(unrecog_country)
