# discordBotGaming
bot for my project

### RegexNotify
Originally when i first thought about making the bot i assumed it would be using regex to find the desired entries in the list but overtime i found out this option was ineffective as it was using more than 1 regex to really fetch the results( i tried as much as i could to optimize just one but couldn't do it)

### Basics
This bot is very simple, it reacts to embedded messages of another bot that has a list that consists of the following items that you'll hear a lot in this project:
- gen- can think of this as a number from 1-2000 that can be repeated X times
- date- this really is how long as passed since the item was added to the list
- user- users id that owns the item in the list
It's basically a leaderboards for a specific entity where everyone wants to have the gen 1 on the list to really show themselves off.

### Why exactly did i make this?
To put it simply sometimes i can miss a more recent record in the list which i might be interested in but with this bot i'll never miss it again.

### Commands
There are multiple commands that can limit what the bot shows and what it does not show:
- restricting the gen: some dont have high requirements and might want to be on the leaderboards only while others want to be in the first 10 only so for this there is a command `-setGen` or `-sg` where user can put any number(default is 100).
- restricting date (will be implemented in future) at this moment it only shows new entries that were added within 24 hours to the leaderboards.
- setting channel within the server where the bot posts `-setChannel` or `-sc` followed with the desired channel will ensure that the bot posts messages only in there (this needs to be set otherwise the bot wont send anything
-  fetching the server config can be done with `-getServer` or `-get`
- for phone users i added `-toggleSeperateUserId` or `-toggle` that will send the user id in the following message seperately for easier access
- to delete server config `-deleteServer` or `-ds`
- finally command to get the list of commands is `-help` or `-h`

### Future plans
while plans for this part of the bot is pretty much only restricting the date which seems rather tricky atm (spawn date is in formats such as '1s', '5m', '20h' or '5d', ...) i want to make this viable in future one way or another.


### Why not just pay more attention
Truth be told another reason why i made this bot is simply because i wanted to improve myself in programming and this was the first idea that came to my mind since there is still a lot of things i dont know how to do.
Up until now i haven't really used design patterns in my previous jobs so this was a bit of challange to use one and i went with DAO for my json database where i store the data for each server.
Even now there is still a lot for me to learn but i think this is a good stepping stone.
