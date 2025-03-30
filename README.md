
## Run Locally - Frontend

Clone the project

```bash
  git clone https://github.com/CSCE331-Spring2025/project03_team02.git
```

Go to the frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Create .env file in frontend directory root
```
VITE_API_URL=http://127.0.0.1:5000
```

Start the server

```bash
  npm run dev
```


## Run Locally - Backend

Clone the project

```bash
  git clone https://github.com/CSCE331-Spring2025/project03_team02.git
```

Go to the backend directory

```bash
  cd backend
```

Create a virtual environment

```bash
  python -m venv venv
```

Activate virtual environment - Mac/Linux

```bash
  source venv/bin/activate
```

Activate virtual environment - Windows

```bash
  venv\Scripts\activate
```

Install dependencies into virtual environment

```bash
  pip install -r requirements.txt
```

Create .env file in backend directory root
```
DATABASE_URL=postgresql://team_02:bulbasaur35@csce-315-db.engr.tamu.edu:5432/team_02_db
```

Start the server

```bash
  python3 app.py
```
