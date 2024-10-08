import fetcher from "./Fetcher";

export const ConsignmentApi = {
    requestConsignment: async (data) => {
        try {
            const response = await fetcher.post(
                "http://localhost:8080/koifarm/login/signin",
                data
            );
            return response.data;
        } catch (error) {
            throw Error(error.response.data.message);
        }
    },
};