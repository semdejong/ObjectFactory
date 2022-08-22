import axios from "axios";

const Objects = {
  create: async (objectTypeId, data) => {
    const preparedData = {
      objectTypeId,
      data: data,
    };
    const response = await axios
      .post(`/api/object`, preparedData)
      .catch((err) => {
        return err.response;
      });

    return response;
  },
  amount: async (objectTypeId) => {
    const response = await axios
      .get(`/api/object/amount/${objectTypeId}`)
      .catch((err) => {
        return err.response;
      });

    return response;
  },
  get: async (objectTypeId, page, limit) => {
    const response = await axios
      .get(`/api/object?objectType=${objectTypeId}&page=${page}&limit=${limit}`)
      .catch((err) => {
        return err.response;
      });

    return response;
  },
};

export default Objects;