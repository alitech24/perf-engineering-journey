import http from 'k6/http';
import { sleep, check, group } from 'k6';

const BASEURL = 'https://quickpizza.grafana.com';
const USERNAME = 'testuser1';
const PASSWORD = 'testpassword1';



export const options = {

  vus : 1,
  duration : '3s'
}

export default function () {

  let userAuthenticated = false
  let authToken = null
  group('userRegistration', function () {
    const registerPayload = {
      username: USERNAME,
      password: PASSWORD
    }
    const res = http.post(`${BASEURL}/api/register`, JSON.stringify(registerPayload), {
      headers: { 'Content-Type': 'application/json' },
    });

   userAuthenticated = check(res, {
      "response code was 201": (res) => {
        res.status == 201
      }
    })
  
   

    sleep(1);


  })
 group('login', function () {
    const registerPayload = {
      username: USERNAME,
      password: PASSWORD
    }
    const loginResponse = http.post(`${BASEURL}/api/users/token/login`, JSON.stringify(registerPayload), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(loginResponse, {
      "response code was 200": (res) => {
        res.status == 200
      }

    })
  
   authToken = loginResponse.json('token')
   console.log (`User authenticated successfully : ${USERNAME}`)


    sleep(1);


  })


}