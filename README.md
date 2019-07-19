#### 1. Unzip the file.

#### 2. From your terminal type: `cd Desktop/employee-CRUD/boilerplate` to enter the app's main directory

#### 2. Start the application with the command `node app`.

#### 4. The application is now ready to receive requests.

#### LISTS Endpoints

- **<code>POST </code> http://localhost:3000/api/employees**
  - Required data params:
    - firstName
    - lastName
    - hireDate: must be in the format (YYYY-MM-DD) and prior to the current date
    - role: must be either VP, CEO, MANAGER, or LACKEY
- **<code>GET</code> http://localhost:3000/api/employees/:id**
  - Returns the record corresponding to :id
- **<code>GET</code> GET http://localhost:3000/api/employees**
  - Return all current records
- **<code>PUT</code> http://localhost:3000/api/employees/:id**
  - Replaces the record corresponding to :id with the contents of the PUT body
- **<code>DELETE</code> http://localhost:3000/api/employees/:id**
  -Deletes the record corresponding to the id parameter
