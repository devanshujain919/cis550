import MySQLdb
import csv

from collections import defaultdict

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

with open('health.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    k = 0;
    for row in reader:
        # sql = "INSERT INTO Athlete (Name, Country) VALUES (%s, %s);"
        for i in range(1,len(row)):
            sql = "INSERT INTO Statistics (Country, Year, Health) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE Health=%s;";
            print(sql)
            try:
                if row[i] == "":
                    print row[0] + str(i+1959) + row[i]
                else:
                    cursor.execute(sql, (row[0], i+1959, row[i], row[i]))
                    db.commit()
            except Exception as e:
                print e
