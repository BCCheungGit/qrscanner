/*
  app.js- the frontend portion of the automated check in system- get the results from the scanned webcam and
  use Axios to post to http://localhost:5000/scan and query the database called logindatabasev2.

*/

import React, { useState } from 'react';
import {Container, Card, CardContent, makeStyles, Grid} from '@material-ui/core';
import QrReader from 'react-qr-reader';
import Axios from 'axios';
import sleep from '@react-corekit/sleep';

function App() { 
  const [scanResultWebCam, setScanResultWebCam] =  useState('');
  const classes = useStyles();
  const [scanAuth, setScanAuth] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [userService, setUserService] = useState('');
  const [hidemessage, setHideMessage] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  //const [currentDate, setCurrentDate] = useState('');
  var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
  
async function resetdisplay() {
  setHideMessage(false);
    await sleep(3500);
   setHideMessage(true);
  
  }
async function resetScanner() {
  await sleep(2500);
  setScanResultWebCam(null);
}

async function resetName() {
  await sleep(2500);
  setUserInfo(null);
}

async function resetDate() {
  await sleep(2500);
  //setCurrentDate(null);
  setCurrentDate('');
}


  

  //handleauthorization querys the database
  const handleAuthorization = () => {
    if (scanResultWebCam != null) {
    let householdID = scanResultWebCam.substring(0, scanResultWebCam.indexOf(','));
    let peopleID = scanResultWebCam.substring(scanResultWebCam.indexOf(',') + 1);
    Axios.post('http://localhost:5000/scan', {
      people_id: peopleID,
      household_id: householdID
    }).then((response) => {
      if (!response.data.message)
      {
        setScanAuth("Check in successfull! (成功)");
        
          setUserInfo("Welcome: " + response.data[0].lname +", " + response.data[0].fname);
          //setUserService(prevState => response.data[i].event_cd + ", " + prevState);
          let numberOfServices = "";
          if (response.data.length > 1) {
              numberOfServices = " services";
          } else {
              numberOfServices = " service";
          }
          //setUserService("Checked in for: " + response.data.length + numberOfServices);
          response.data.forEach(element => setUserService(element.event_cd));
          //setCurrentDate("Checked in at: " + response.data[0].checkedIn);
          
          
        resetScanner();
        resetName();
        resetDate();
         
      } else {
        setScanAuth(response.data.message); 
        setUserInfo('');
        setUserService('');
        resetScanner();
        resetName();
        resetDate();
      }
  }); 
}
  if (scanResultWebCam == null) {
    setScanAuth("Processing...（進行中)");
    setUserService('');
  } 
  
  }

  //handleErrorWebCam- debug purposes
  const handleErrorWebCam = (error) => {
    console.log(error);
  }

  //handleScanWebCam- handles the authorization when a qr code is scanned, returns the result of the scan.
  const handleScanWebCam = (result) => {
    handleAuthorization();
    if (result){
      resetdisplay();
        setScanResultWebCam(result);
        audio.play();
    }
    
   }

   //the main frontend- visuals and labels
  return (
    
    <Container className={classes.conatiner}>
          <Card>
              <CardContent>
                      <Grid item xs={12} md={4} lg={7}>
                        <br></br>
                        <h1>Oversea Chinese Mission (中華海外宣道會)</h1>
                        <img src = "https://avatars.planningcenteronline.com/uploads/organization/217202-1482195203/avatar.1.png" style = {{width: '50px', height: '50px', position: 'absolute', top: '10px', left: '65px'}}></img>
                        <h3>Automated Check in System (簡易通自動報到)</h3>
                         <QrReader
                         // delay between scans
                         delay={500}
                         style={{width: 500, height: 500}}
                         onError={handleErrorWebCam}
                         onScan={handleScanWebCam}
                         />
                         
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div id='welcome' hidden={hidemessage} style = {{position: 'absolute', left: '730px', top: '60px'}}>
                         <h3>Result: {scanAuth} </h3> 
                         <h3>{userInfo} <br></br> {userService} <br></br></h3>
                         <h3>{currentDate}</h3>
                      
                         </div>
                         </Grid>
              </CardContent>
          </Card>
    </Container>
  );
}

//the styles for the qr code scanner
const useStyles = makeStyles((theme) => ({
    conatiner: {
      marginTop: 10,
    },
    title: {
      display: 'flex',
      justifyContent: 'center',
      alignItems:  'center',
      background: '#3f51b5',
      color: '#fff',
      padding: 20
    },
}));
export default App;
