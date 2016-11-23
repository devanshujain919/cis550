import urllib
import json
from lxml import html,etree

base_url = "http://www.databaseolympics.com"

winter_editions = {
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

summer_editions = {
	1:'1896',
	2:'1900',
	3:'1904',
	4:'1908',
	5:'1912',
	6:'1916',
	7:'1920',
	8:'1924',
	9:'1928',
	10:'1932',
	11:'1936',
	12:'1948',
	13:'1952',
	14:'1956',
	15:'1960',
	16:'1964',
	17:'1968',
	18:'1972',
	19:'1976',
	20:'1980',
	21:'1984',
	22:'1988',
	23:'1992',
	24:'1996',
	25:'2000',
	26:'2004',
	47:'2008',
}

def do_work(editions, outfileName):
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
		k = -1
		for i in range(len(country)):
			gold = int(medalNodes[i*5 + 1].text)
			silver = int(medalNodes[i*5 + 2].text)
			bronze = int(medalNodes[i*5 + 3].text)
			total = int(medalNodes[i*5 + 4].text)
			info[editions[ed]][country[i]] = {'gold': gold, 'silver': silver, 'bronze': bronze, 'total': total}
	with open(outfileName + '_raw.json', 'w') as outfile:
	    json.dump(info, outfile)
	with open(outfileName + '_pretty.json', 'w') as outfile:
	    json.dump(info, outfile, sort_keys=True, indent=4)

do_work(winter_editions, 'winter');
do_work(summer_editions, 'summer');