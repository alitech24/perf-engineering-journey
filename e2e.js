import http from 'k6/http';
import { sleep, check, group } from 'k6';

const BASEURL = 'https://quickpizza.grafana.com';
const PASSWORD = 'testpassword1';

export const options = {
  vus: 1,
  duration: '3s',
};

export default function () {
  // Har run ke liye naya username, taaki register dobara chalane par "already exists" error na aaye
  const username = `alibhai_${Date.now()}`;
  let authToken = null;

  group('userRegistration', function () {
    const registerPayload = {
      username: username,
      password: PASSWORD,
    };
    const res = http.post(`${BASEURL}/api/users`, JSON.stringify(registerPayload), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'response code was 201': (r) => r.status === 201,
    });

    sleep(1);
  });

  group('login', function () {
    const loginPayload = {
      username: username,
      password: PASSWORD,
    };
    const loginResponse = http.post(`${BASEURL}/api/users/token/login`, JSON.stringify(loginPayload), {
      headers: { 'Content-Type': 'application/json' },
    });

    const loginOk = check(loginResponse, {
      'response code was 200': (r) => r.status === 200,
    });

    if (loginOk) {
      authToken = loginResponse.json('token');
      console.log(`User authenticated successfully: ${username}`);
    }

    sleep(1);
  });
}