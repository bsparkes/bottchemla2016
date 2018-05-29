# Scripts to analyse a replication of Bott and Chemla 2016.
# created by bsparkes on 24 May, 2018
# modified by bsparkes on ??

library(tidyverse)
library(lme4)
library(languageR)
library(plyr) # for figuring out percentages

# For whatever reason, RStidio has troubles with figuring out where stuff is.
# The following commands set the current file path as the working directory.
currentDir = dirname(rstudioapi::getActiveDocumentContext()$path)
setwd(currentDir)
getwd()

#load up the example CSV
p = read.csv("../additionalScripts/randomParticipants.csv")
head(p)

# Modelling

# In the following we'll do a number of restrictions, and the following table will be useful to keep in mind as it shows that raw counts of prime
# and reponse types.
table(p$responseTypeText, rp$primeTypeText)


# Now, let's filter out the filler trials from the CSV
# First, see how many fillers we have
table(p$trial_type)
# Second, filter the CSV
rp = subset(p, trial_type=='response')
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

# Now, let's look at the data as a whole
# We're getting a logit mixed-effect model, so 'gmler' does the trick.
rp.random = glmer(responseChoice ~ primeStrength*WithBet + (1 + primeStrength*WithBet | uniqueID), data=rp, family="binomial")
summary(rp.random)


# # Within detail
# First, exclude the results for which the prime cat differs from the response cat
wrp = subset(rp, WithBet=='within')
# We can look at the refined dataset if we wish
# wrp
# We can also check that we've got the right restrictions, we're aiming for the diagonal (ignoring fillers categories)
table(wrp$responseTypeText, wrp$primeTypeText)

# All of this looks good, so we can run our model
wrp.random = glmer(responseChoice ~ primeStrength * WithCat +  (1 + primeStrength * WithCat | uniqueID), data=wrp, family = binomial(link = "logit"))
summary(wrp.random)

summary(wrp)

# #  Between detail
brp = subset(rp, WithBet=='between')

# We can now check that we've got the right restrictions again
table(brp$responseTypeText, brp$primeTypeText)

brp.random = glmer(responseChoice ~ primeStrength * BetCat  +  (1 + primeStrength * BetCat | uniqueID), data=brp, family = binomial(link = "logit"))
summary(brp.random)

# Visualising the data

# Set the theme
theme_set(theme_bw())

summary(p)

# So, general problem here is that I need to get a percentage, which means adding, I guess

ggplot(p, aes(x=factor(BetCat), y=sum(responseChoice)/length(responseChoice), label=paste(round(sum(responseChoice)/length(responseChoice)*100)), "%" ))  +
  geom_bar(stat="identity") +
  geom_text(position="stack", aes(ymax=1),vjust=5) +
  scale_y_continuous(labels = percent)

# + stat_bin(geom ="text", aes(label = paste(round((sum(responseChoice)/length(responseChoice))*100), "%")),  vjust = 5)
          # + scale_y_continuous(labels = percent)
ggplot(p, aes(x=responseChoice)) + geom_bar()



p.perc <- ddply(p,.(BetCat, primeStrengthText),summarise,prop = sum(responseChoice)/length(responseChoice))
p.perc

# responseChoice returns 0 for a weak selection, and 1 for a selection of 'better card', which B&C take to be strong
ggplot(p.perc,aes(x=factor(BetCat),y=prop, fill=primeStrengthText, label=paste(round(prop*100), "%"))) +
  geom_bar(stat="identity", colour="black", position=position_dodge()) +
  ylab("Proportion Strong responses") +
  xlab("Prime Type") +
  scale_fill_manual(values=c("black", "lightgray"))
  # We could try doing something a little more fancy, but it gets messy quite quickly.
  # annotate("rect", xmin = .5, xmax = 1.5, ymin = .6, ymax = .7,
  #          alpha = 1, fill="grey") +
  # annotate("text", x = "ADHADH", y = .675, label = "Within priming") +
  # annotate("text", x = "ADHADH", y = .625, label = "ADHOC\nADHOC")



# The best approach seems to be to generate plots for each category indepndently.
# Here's some example code to do this.
psswp = subset(p, trial_type=='response' & BetCat=="SOMESOME")
summary(psswp)
psswp.perc <- ddply(psswp,.(primeStrengthText),summarise,prop = sum(responseChoice)/length(responseChoice))

ggplot(psswp.perc,aes(x=factor(primeStrengthText),y=prop,label=paste(round(prop*100), "%")),fill=primeStrength) +
  geom_bar(colour="black", stat="identity", position=position_dodge()) +
  ylab("Proportion Strong responses") +
  xlab("Prime Type") +
  scale_fill_manual(values=c("black", "lightgray"))


# Bott and Chemla combine each direction of cross category trials when illustrating their results.
# Here's an easy way to do it.
# The idea, basically, is to make a new dataframe with only the results from the relevant trials, then one
# simply, uses this ddply to combine the results of applying the proportion function to each trial type.
cc = subset(p, trial_type=='response' & (BetCat=="ADHSOME" | BetCat=="SOMEADH"))
summary(cc)
cc.perc <- ddply(cc,.(primeStrengthText),summarise,prop = sum(responseChoice)/length(responseChoice))
cc.perc

# Here I can't figure out how to make the bars different colours.
ggplot(cc.perc,aes(x=factor(primeStrengthText),y=prop,label=paste(round(prop*100), "%"))) +
  geom_bar(colour="black", stat="identity", position=position_dodge()) +
  ylab("Proportion Strong responses") +
  xlab("Prime Type") +
  scale_fill_manual(values=c("black", "lightgrey"))

