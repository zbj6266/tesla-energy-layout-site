# Tesla Energy Layout Application

## Project Structure

```
tesla-energy-layout-app/
├── docker-compose.yml          # Run with one command
├── README.md
└── backend/
    ├── Dockerfile
    ├── .env                  #Configure database url
    ├── package.json
    └── src/
        ├── index.js          #Entry point to set up the environment variables and mount routes  
        ├── db/
        │   ├── migrate.js    # setup index, and schema and create table for postgres
        │   ├── pool.js       # Setup an database connection
        └── models/
        │   └── session.js    # Implement api function to run sql query to create and get                             variables
        └── routes/
        │   └── sessions.js   # Define API endpoints that frontend calls
└── frontend/
    ├── Dockerfile.prod
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Starting layout for frontend
        ├── App.css             # Global styles
        ├── main.jsx            # Entry point
        ├── data/
        │   └── devices.js      # Setup battery device specs & constants
        ├── hooks/
        │   └── useSession.js   # Update the state of session data if user triggers any create                         session, update session and load session logic 
        ├── components/
        │   ├── DevicePanel.jsx # List devices and choose the quantity in left panel
        │   ├── StatsBar.jsx    # Summary of total battery chosen, energy output, total cost and total land                           size required
        │   └── SiteLayout.jsx  # Visual layout to show the overall land size needed and do                            calculation to wrap into new row if exceed maxWidth
        └── api/
        │   └── sessions.js      # Call API endpoints to the backend
        
```

Run in local Command:
Full stack:
```bash
docker-compose up --build
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:8000

Please read .env file to switch the database url to localhost when test on local
