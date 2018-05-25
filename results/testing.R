# Scripts to analyse a replication of Bott and Chemla 2016.
# created by bsparkes on 24 May, 2018
# modified by bsparkes on ??

library(tidyverse)
library(lme4)
library(languageR)

# For whatever reason, RStidio has troubles with figuring out where stuff is.
# The following commands set the current file path as the working directory.
currentDir = dirname(rstudioapi::getActiveDocumentContext()$path)
setwd(currentDir)
getwd()

#load up the CSV
rp = read.csv("../additionalScripts/randomParticipants.csv")
head(rp)



# Now, let's filter out the filler trials from the CSV
# First, see how many fillers we have
table(rp$trial_type)
# Second, filter the CSV
rp = subset(rp, trial_type=='response')
# Then, check we've done the right thing
table(rp$trial_type)

# Next, we can now filter the CSV so that we only have entries for correct prime responses.
# First, see how many correct/incorrect prime responses there were.
table(rp$correctPChoices)
prop.table(table(rp$correctPChoices))
# Second, filter
rp = subset(rp, correctPChoices=='True')
# Then, check we've done the right thing
table(rp$correctPChoices)


head(rp)

table(rp$primeStrengthText, rp$responseChoiceText)

# Now, it looks as though this is what I want for the initial part of the overview.
# We're getting a logit mixed-effect model, so 'gmler' does the trick.
rp.random = glmer(responseChoice ~ primeStrength*WithBet + (1 + primeStrength*WithBet | uniqueID), data=rp, family="binomial")
summary(rp.random)

# Within detail
# First, exclude the results for which the prime cat differs from the response cat
wrp = subset(rp, WithBet==1)
# Check
wrp
length(wrp)
table(wrp$WithCat)
table(wrp$WithCat, wrp$primeType)
table(wrp$primeType)
table(wrp$uniqueID)
table(wrp$responseChoice)
table(wrp$uniqueID)
wrp$primeStrength <- factor(wrp$primeStrength)
wrp$WithCat <- factor(wrp$WithCat)
wrp.random = glm(responseChoice ~ primeStrength * WithCat +  (1 + primeStrength * WithCat | uniqueID), data=wrp, family = binomial(link = "logit"))
wrp.random = glmer(responseChoice ~ primeStrength * WithCat +  (1 + primeStrength * WithCat | uniqueID), data=wrp, family = binomial(link = "logit"))
summary(wrp.random)

summary(wrp)
cor(wrp)

# Between detail


