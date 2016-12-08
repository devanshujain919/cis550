# -*- coding: utf-8 -*-

import urllib
import json
from lxml import html,etree

base_url = "http://www.databaseolympics.com"
editions = {
	27:'1924',
	28:'1928',
	29:'1932',
	30:'1936',
	31:'1948',
	32:'1952',
	33:'1956',
	34:'1960',
	35:'1964',
	36:'1968',
	37:'1972',
	38:'1976',
	39:'1980',
	40:'1984',
	41:'1988',
	42:'1992',
	43:'1994',
	44:'1998',
	45:'2002',
	46:'2006',
}

info = {}

for ed in editions.keys():
	info[editions[ed]] = {}
	web = urllib.urlopen(base_url + "/games/gamesyear.htm?g=" + str(ed))
	cty = web.read()
	web.close()
	html_cty = etree.HTML(cty)
	aTagNodes = html_cty.xpath('//tr[@class="cl2"]/td/a')
	medalNodes = html_cty.xpath('//tr[@class="cl2"]/td')
	country = [i.text for i in aTagNodes]
	country_hyper = [i.attrib['href'] for i in aTagNodes]
	k = -1
	for i in range(len(country)):
		gold = medalNodes[i*5 + 1].text
		silver = medalNodes[i*5 + 2].text
		bronze = medalNodes[i*5 + 3].text
		total = medalNodes[i*5 + 4].text
		info[editions[ed]][country[i]] = {'gold': gold, 'silver': silver, 'bronze': bronze, 'total': total, 'hyper': base_url + country_hyper[i]}
		player_info=[]
		player_url = base_url + country_hyper[i]
		ctyweb = urllib.urlopen(player_url)
		html_cty = etree.HTML(ctyweb.read())
		ctyweb.close()
		nodes = []
		nodes.extend(html_cty.xpath('//tr[@class="cl2"]'))
		nodes.extend(html_cty.xpath('//tr[@class="cl1"]'))
		for n in nodes:
			links = n.xpath('td')
			player = {}
			player['Sport'] = links[1].xpath('a')[0].text
			player['Event'] = links[2].xpath('a')[0].text
			player['Athlete'] = links[3].xpath('a')[0].text
			p_url = base_url + links[3].xpath('a')[0].attrib['href']
			try:
				pweb = urllib.urlopen(p_url)
				html_p = etree.HTML(pweb.read())
				dob = html_p.xpath('//font[@class="bio"]/a')[2].text
				player['dob'] = dob;
				print(dob)
				pweb.close()
			except Exception as e:
				print(p_url)
				p_url = urllib.quote(p_url.encode('utf8'), ':/')
				print(p_url)
				# print(str(base_url + links[3].xpath('a')[0].attrib['href']))
				print(editions[ed] + "  " + country[i])
				print(player['Athlete'] + "  " + player['Sport'] + "   " + player['Event'])
				print(e)
			player['Medal'] = links[5].text
			player_info.append(player)
		info[editions[ed]][country[i]]['players'] = player_info

with open('raw.json', 'w') as outfile:
    json.dump(info, outfile)
with open('pretty.json', 'w') as outfile:
    json.dump(info, outfile, sort_keys=True, indent=4)