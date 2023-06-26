import axios from "axios";

const buildClient = ({req}) => {
    let baseUrl = '';
    let headers = {};
    if (typeof window === 'undefined') {
        baseUrl = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
        headers = {
            ...req.headers
        }
    }
    return axios.create({
        baseURL: baseUrl,
        headers: headers
    });
}

export { buildClient };