# Scrapper

Hey Codepath Staff! Glad you see this section. So, for the Capstone we also have been working on a webscrapper that could collect data from various websites like Edmunds an KBB and push this into the team's database in Railway to ensure we have actual real car data. 

We had some difficulty doing this tho. For starters, Edmunds have anti-bot scripts that made webscrapping and webcrawling a challenge, and KBB had a lot of information on cars that we needed to filter out so we can focus on the stuff we want to use to show on our frontend side.

So, if we can get extra credit for making a scrapper that be cool. Anyway, unto the functionality of the scripts.

## Running the script

At the time of writting this you need to navigate to this folder and on the terminal you need to create a python virtual enviroment

```bash
python -m venv .venv
```

> NOTE: If you're in a Mac you may need to type `python3` instead

Then activate the enviroment in case Vscode doesn't recognize it

```bash
source .venv/bin/activate
```

> NOTE: If you use fish, use `activate.fish` instead. If you're on a windows machine use the powershell script instead which is under `.venv/bin`

Install the dependencies

```bash
pip install -r requirements.txt
```

And finally run the runner script

```bash
python run.py scrape
```

The script has 3 modes:
- scrape
- push
- reset

Scrape will run the scrapper scripts and put all the data into a json called `car_data.json`

Push will override the database

Reset will clean the database

