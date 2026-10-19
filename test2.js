import http from 'k6/http';
import { sleep,check } from 'k6';

export const options = {

        stages : [
            { duration : '4s', target : 2}, // Ramp up to 2 users over 4 seconds
            { duration : '5s', target : 5}, // Stay at 5 users for 5 seconds
            { duration : '3s', target : 0} // Ramp down to 0 users over 3 seconds
        ],

        thresholds :{
             'http_req_duration' : ['p(95)<500'],
             'http_req_failed' : ['rate<0.01'] ,// Fail the test if more than 1% of requests fail
             'checks' : ['rate>0.9'] // Fail the test if more than 5% of checks fail
    
}
}

export default function()
{
    const response=http.get('https://quickpizza.grafana.com');

check(response, {
    'is status 200': (r) => r.status === 200,
    'page contains "Pizza"': (r) => r.body.includes('Pizza'),
    'body length is greater than 1000': (r) => r.body.length > 1000
}); 

 http.get('https://quickpizza.grafana.com/api/menu',{
    tags: { name: 'Menu API' } // Add a custom tag to the request
});

sleep(1);


}