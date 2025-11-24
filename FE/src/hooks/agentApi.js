import { agentAxiosClient } from "../ApiConfig/apiConfig"; 

const AGENT_API_ENDPOINT = "/api";

const agentApi = {
  postMessage: (data) => {
    return agentAxiosClient.post(`${AGENT_API_ENDPOINT}/chat`, data);
  },
};

export default agentApi;
