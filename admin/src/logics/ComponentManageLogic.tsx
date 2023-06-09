import axios from "axios";

export const ComponentManageLogic = {
  getMainPageComponentList: async () => {
    const response = await axios.get(`http://43.200.171.174/test/api/mainPage/list`);
    return response.data.data;
  },

  getMainPageComponentDetail: async (id: any) => {
    const response = await axios.get(`http://43.200.171.174/test/api/mainPage/${id}`);
    return response.data.data;
  },

  postComponent: async (data: any) => {
    const response = await axios.post(`http://43.200.171.174/test/api/mainPage/create`, data);
    return response;
  },
};
