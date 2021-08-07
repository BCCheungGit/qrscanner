
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const pool = require('./databases')
function getdate() {
    var date =new Date();
    date.toLocaleString('en-US', { timeZone: 'America/New_York' });
    var dateStr =
    ("00" + (date.getMonth()+1)).slice(-2)
    + "/" + ("00" + date.getDate()).slice(-2)
    + "/" + date.getFullYear() + " "
    + ("00" + date.getHours()).slice(-2) + ":"
    + ("00" + date.getMinutes()).slice(-2)
    + ":" + ("00" + date.getSeconds()).slice(-2);
    return dateStr.trim();
    }

//post method- will use the username and time from app.js to route to /scan and queries the database.
app.post('/scan', (req, res) => {
    const people_id = req.body.people_id;
    const household_id = req.body.household_id;
  //  const checkedIn = req.body.checkedIn;
    if (people_id != null) {
    pool.query("SELECT * from v_registrants WHERE people_id = $1",
    [people_id],
    (err, result) => {
        //console.log(result);
        if (err) {
            res.send({err: err});
        }
        if (result.rowCount > 0) {  
            res.send(result.rows);
            pool.query("UPDATE v_registrants SET checkedIn = '" + getdate() + "' WHERE people_id = $1 OR household_id = $2", [people_id, household_id]);
        } else {
            res.send({message: "Unregistered - not checked in"});
        }
        
    });
    }
    else {
        res.send({message: "Please scan your QR Code"});
    }
});

app.listen(port, () =>{
    console.log('server running');
}
)