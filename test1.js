import http from 'k6/http';
import { sleep } from 'k6';

export const options = 
{
vus: 5,
duration : '10s',
thresholds :{
    'http_req_duration' : ['p(95)<100']
    
}
}

export default function()
{
    http.get('https://quickpizza.grafana.com');
sleep(1);
}