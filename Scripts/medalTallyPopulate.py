# -*- coding: utf-8 -*-

import json
import MySQLdb

with open('winter_raw.json') as data_file:
	winter_data = json.load(data_file)
with open('summer_raw.json') as data_file:
	summer_data = json.load(data_file)

db = MySQLdb.connect(host='cis550.cautcaubut2r.us-east-1.rds.amazonaws.com', user='cis550_group14', passwd='vrgp14&vra', db='olympics')

cursor = db.cursor()

def populate(data, season):
	for year in data:
		for cty in data[year]:
			sql = "INSERT INTO Medal_Tally (Year, Season, Country, Gold, Silver, Bronze) VALUES (%s, %s, %s, %s, %s, %s);";
			# sql = "INSERT INTO Events (Year, Season, Sport, Event) VALUES ('" + year + "','Winter','" + p['Sport'] + "','" + p['Event'] + "');"
			# if 'dob' in p:
			# 	sql = "INSERT INTO Athlete (Name, Country, DOB) VALUES ('" + p['Athlete'] + "', '" + cty + "', '" + p['dob'].split('/')[2] + '-' + p['dob'].split('/')[0] + '-' + p['dob'].split('/')[1] + "');"
			# else:
			# 	sql = "INSERT INTO Athlete (Name, Country) VALUES ('" + p['Athlete'] + "', '" + cty + "');"
			print(sql)
			try:
				cursor.execute(sql, (int(year), season, cty, data[year][cty]['gold'], data[year][cty]['silver'], data[year][cty]['bronze']))
				db.commit()
			except Exception as e:
				print e
				continue

	# for row in cursor.fetchall():
	# 	print row[0] + "  " + row[1]

populate(winter_data, 'Winter')
populate(summer_data, 'Summer')