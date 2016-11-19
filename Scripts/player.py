# -*- coding: utf-8 -*-

import csv
import wikipedia
import pywikibot
import pymongo

from collections import defaultdict
from pymongo import MongoClient

site = pywikibot.Site("en", "wikipedia")
repo = site.data_repository()

# finds the top page in the list of suggestions
def getTopPage(list_matches, search_term, country):
#    print(list_matches)

    if len(list_matches) == 0:
        return None

    qualifiedPages = []

    for page in list_matches:
        wikidatapage = pywikibot.Page(site, page)
        try:
            item = pywikibot.ItemPage.fromPage(wikidatapage)
            item.get()
            if item.claims:
                if 'P31' not in item.claims:
                    continue
                claims = item.claims['P31']
                isHuman = False
                for c in claims:
                    if not c.getTarget():
                        continue
                    if c.getTarget().title() == "Q5":
                        isHuman = True
                        break
                if not isHuman:
                    continue
                qualifiedPages.append(page)
                if 'P27' not in item.claims:
                    continue
                claims = item.claims['P27']
                for c in claims:
                    if not c.getTarget():
                        continue
                    entitypage = pywikibot.ItemPage(repo, c.getTarget().title())
                    entitypage.get()
                    if 'en' in entitypage.labels:
                        if entitypage.labels['en'].lower() == country.lower():
                            return page
            else:
                qualifiedPages.append(page)
        
        except pywikibot.exceptions.NoPage:
            qualifiedPages.append(page)
            continue

#    print("Qualifying")
#    print(qualifiedPages)
    
    pageMax = None
    pageMaxCount = 0
    nGram = [2,3,4]
    terms = []
    for t in search_term.split():
        for n in nGram:
            terms.extend([t[i:i+n].lower() for i in range(len(t)-n+1)])
    
    for p in qualifiedPages:
        if len(p) > len(search_term) + 5:
            continue
        count = 0
        for t in terms:
            if t in p.lower():
                count += 1
        if count > pageMaxCount:
            pageMaxCount = count
            pageMax = p

    return pageMax

# print(getTopPage(wikipedia.search('PEREZ DE LA HERAS, Joaquin'), unicode('PEREZ DE LA HERAS, Joaquin', 'utf-8'), "Mexico"))
# exit()

# returns json 
def parse(page):
    return {'summary':page.summary}

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.test

player=[]

country=defaultdict(lambda: 'NULL')

with open('country.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        country[row[1]] = row[0]

# print(country)

with open('medalist.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        try:
            player.append({'name':unicode(row[0], 'utf-8', errors='replace'), 'country':country[row[1]]})
            
        except UnicodeDecodeError:
            print("Unicode Decoding Error Thrown" + str(row[0]))
            continue

# print(player)

# player=[]
# player.append({'name':'PEREZ DE LA HERAS, Joaquin','country':'Mexico'})

for p in player:
    if db.players.find({'_id':{'name':p['name'], 'country':p['country']}}).count() >= 1:
        continue
    print("Adding: " + p['name'] + "  " + p['country'])
    listMatches = wikipedia.search(p['name'])
    page = getTopPage(listMatches, p['name'], p['country'])
    if(page):
        try:
            wikipage = wikipedia.page(page)
        except wikipedia.exceptions.DisambiguationError:
            print("Disambiguation: Error thrown")
            continue
        except wikipedia.exceptions.PageError:
            print("No wikipedia page exists")
            continue
        wikidatapage = pywikibot.Page(site, page)
        
        pdata = {}
        pdata['info'] = parse(wikipage)
        pdata['_id'] = {}
        pdata['_id']['name'] = p['name']
        pdata['_id']['country'] = p['country']
        
        try:
            item = pywikibot.ItemPage.fromPage(wikidatapage)   
            item.get()

            if item.claims:
                if 'P106' in item.claims:
                    # Occupations
                    claims = item.claims['P106']
                    occupation = []
                    for c in claims:
                        if not c.getTarget():
                            continue
                        entitypage = pywikibot.ItemPage(repo, c.getTarget().title())
                        entitypage.get()
                        if 'en' in entitypage.labels:
                            occupation.append(entitypage.labels['en'])
                    if len(occupation) > 0:
                        pdata['Occupation'] = occupation

                if 'P569' in item.claims:
                    # Date of Birth
                    dob = item.claims['P569'][0].getTarget()
                    if dob:
                        pdata['Date of Birth (dd-mm-yyyy)'] = str(dob.day) + '-' + str(dob.month) + '-' + str(dob.year)

                if 'P1344' in item.claims:
                    # Participant Of
                    claims = item.claims['P1344']
                    participations = []
                    for c in claims:
                        if not c.getTarget():
                            continue
                        entitypage = pywikibot.ItemPage(repo, c.getTarget().title())
                        entitypage.get()
                        if 'en' in entitypage.labels:
                            participations.append(entitypage.labels['en'])
                    if len(participations) > 0:
                        pdata['Participations'] = participations
               
                if 'P18' in item.claims: 
                    # Images
                    claims = item.claims['P18']
                    images = []
                    for c in claims:
                        if not c.getTarget():
                            continue
                        images.append(c.getTarget().fileUrl()) 
                    if len(images) > 0:
                        pdata['Images'] = images
        except pywikibot.exceptions.NoPage:
            print("WikiData page didn't exist.")     
        try:
            print(pdata)
            db.players.insert_one(pdata)
        except pymongo.errors.DuplicateKeyError:
            print("Duplicate Key: Error Thrown")
            continue

client.close()
