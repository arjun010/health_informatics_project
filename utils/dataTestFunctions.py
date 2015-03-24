import csv
import json

data_file = open("../data/encounterHistory.json","r")
data = json.load(data_file)

memberList = []
for obj in data:
	memberList.append(obj['memberId'])

print len(memberList)
print len(set(memberList))