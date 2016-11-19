import json
import MySQLdb

with open('raw_backup.json') as data_file:
	data = json.load(data_file)

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

for year in data:
	for cty in data[year]:
		players = data[year][cty]["players"]
		for p in players:
			sql = "INSERT INTO Athlete_won (Year, Season, Sport, Event, Name, Country, Medal) VALUES (" + year + ", 'Winter', '" + p['Sport'] + "', '" + p['Event'] + "', '" + p['Athlete'] + "', '" + cty + "'";
			if "GOLD" == p['Medal']:
				sql += ", 'GOLD');"
			elif "SILVER" == p['Medal']:
				sql += ", 'SILVER');"
			elif "BRONZE" == p['Medal']:
				sql += ", 'BRONZE');"
			else:
				continue
			# sql = "INSERT INTO Events (Year, Season, Sport, Event) VALUES ('" + year + "','Winter','" + p['Sport'] + "','" + p['Event'] + "');"
			# if 'dob' in p:
			# 	sql = "INSERT INTO Athlete (Name, Country, DOB) VALUES ('" + p['Athlete'] + "', '" + cty + "', '" + p['dob'].split('/')[2] + '-' + p['dob'].split('/')[0] + '-' + p['dob'].split('/')[1] + "');"
			# else:
			# 	sql = "INSERT INTO Athlete (Name, Country) VALUES ('" + p['Athlete'] + "', '" + cty + "');"
			print(sql)
			try:
				cursor.execute(sql)
				db.commit()
			except Exception as e:
				print e
				continue

# for row in cursor.fetchall():
# 	print row[0] + "  " + row[1]

db.close()