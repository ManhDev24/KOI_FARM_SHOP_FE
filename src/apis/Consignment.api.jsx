import fetcher from "./Fetcher";

export const ConsignmentApi = {
    requestConsignment: async (data) => {
        try {
            const response = await fetcher.post(
                "http://localhost:8080/koifarm/consignment/createConsignment",
                data, // data is the FormData object
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Optional, Axios usually sets this automatically
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error during consignment request');
        }
    },
    statusConsignment: async (id) => {
        try {
            const response = await fetcher.get(
                `http://localhost:8080/koifarm/consignment/consignmentDetail/${id}`,
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error during consignment request');
        }
    },
    

};