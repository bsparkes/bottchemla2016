import csv
import re


with open('../data/bottchemla2016.csv', encoding='utf-8') as f:
  reader = list(csv.DictReader(f))

  currentWorkerID = reader[0]['workerid']
  trialNumber = 1

  for q in reader:

    if q['workerid'] == currentWorkerID:
      pass
    else:
      currentWorkerID = q['workerid']
      trialNumber = 1

    if q['trial_type'] == '"response"':
      q['trialNumber'] = trialNumber
      trialNumber += 1
      if trialNumber <= 17:
        q['half'] = 1
      else:
        q['half'] = 2
    else:
      q['trialNumber'] = 0
      q['half'] = 0

keys = reader[0].keys()
with open('../data/bottchemla2016Numbered.csv', 'w', newline='',encoding='utf-8') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(reader)

    # print(q['workerid'])
  # for q in reader:
    # q['Question'] = re.sub(r'Prime(\s+Minister){0,1}', r'$person', q['Question'])
    # q['Question'] = re.sub(r'(right\s+){0,1}hon\.(\s+(?:Friend|Member|Gentleman|Lady)){0,1}', r'$person', q['Question'])
    # q['Question'] = re.sub(r'(right\s+){0,1}[Hh]on\.\s+(?:(?:Opposition\s+){0,1}Members)', r'$people', q['Question'])
    # q['Question'] = re.sub(r'\s(?:[Hh]e|[Ss]he|[Hh]is|[Hh]er)\s', r' $pronoun ', q['Question'])
    # print(q)