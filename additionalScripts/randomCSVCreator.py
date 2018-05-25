import os
import sys
import time
import csv
import json
import pandas as pd
from selenium import webdriver

# On a mac, install 'geckodriver' via homebrew to get selenium working

# Set the browser to Safari
browser = webdriver.Firefox()

def participate():
  with open('../experiment/js/randomParticipant.js', 'r') as randomParticipant:
      participantScript = randomParticipant.read()
      browser.execute_script(participantScript)
      browser.execute_script('randomParticipant()')

# This function runs an instance
def generateRandomCSV(participants):

  uniqueID = 0

  frames = []

  # relative path to experiment file
  fileDir = os.path.dirname(os.path.abspath(__file__))
  parentDir = os.path.dirname(fileDir)
  localURL = 'file:///' + os.path.join(parentDir, 'experiment/html/bottchemla2016random.html')

  browser.get(localURL)
  time.sleep(1)
  participate()
  time.sleep(1)
  # print(browser.title)
  csv = browser.find_element_by_id("csv")
  csvjson = json.loads(csv.text)

  # print(csvjson['trials'])
  toCSV = csvjson['trials']
  df0 = pd.DataFrame.from_records(toCSV)
  df0['uniqueID'] = pd.Series(uniqueID, index=df0.index)

  frames.append(df0)

  for i in range(1, participants + 1):

    dfName = 'df' + str(i)

    uniqueID = i

    browser.get(localURL)
    time.sleep(1)
    participate()
    time.sleep(1)
    # print(browser.title)
    csv = browser.find_element_by_id("csv")
    csvjson = json.loads(csv.text)
    # print(csvjson['trials'])
    toCSV = csvjson['trials']
    dfName = pd.DataFrame.from_records(toCSV)
    dfName['uniqueID'] = pd.Series(uniqueID, index=dfName.index)

    frames.append(dfName)

  result = pd.concat(frames)
  write = result.to_csv('./randomParticipants.csv', encoding='utf-8', index=False)

  browser.quit()

generateRandomCSV(100)



