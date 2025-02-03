# Application for ranking alternatives using AHP and TOPSIS

## Set Up
### Using docker
1. Download the .zip release file
2. Unpack it and go inside project folder.
3. Load the images using:
   - `docker load -i 411022_backend.tar`
   - `docker load -i 411022_frontend.tar`
4. Run `docker-compose up`
5. If the docker-compose is not working run containers manualy with:
   - `docker run -p 5000:5000 -d easy-ranking-backend-image`
   - `docker run -p 5173:5173 -d easy-ranking-frontend-image`


### From source
1. Clone the repository using `git clone https://github.com/MikolajLH/easy-ranking`
2. Go /server and run `python -m venv env; pip install -r requirements.txt`
3. Go to /client and run `npm i`
4. In order to start the application run `fastapi dev .\src\main.py --port 5000` in the /server folder and `npm run dev` in client folder

## Usage
Aftet starting the application it should be available at http://localhost:5173/.  
The application API's documentation is available at http://localhost:5000/docs/.

---
In order to start using the application user needs to sign in with their chosen nickname.  
After doing that they can join a ranking as an expert or create a new ranking as a faciliator.

![Sign in](./images/login.png)
![Expert](./images/expert.png)
![Creation](./images/creation.png)


Experts join ranking using ranking ID that is shared to them by the facilitator.  
When they do they can assess alternatives for each pair for each criterion.
![Assessment](./images/assessment.png)



After creating the ranking facilitator can monitor the experts' assessments in the Ranking Overview page.  
When all experts made their assessments, facilitator can conclude the ranking and go to ranking overview page where they can chose aggregation method and prioritization method for calculating the weights of alternatives and critaria.  
The final result can be saved as a json file.
![Management](./images/management.png)
![Overview](./images/overview.png)


---
## API usage
Application can be used without the GUI and only with API.  
The API documentation should be available on http://localhost:5000/docs/.  
The database CRUD endpoints can be ignored and only aggregation/prioritization methods can be used.
![Aggregation methods](./images/aggreg.png)
![Prioritization methods](./images/priori.png)
![TOPSIS](./images/topsis.png)
## Database model

![DbSchema](./images/dbschema.png)