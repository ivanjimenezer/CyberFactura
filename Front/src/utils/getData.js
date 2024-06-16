import axiosClient from "../axios-client.js";

export const getDataWithLength = (link, page, limit) => {
    return axiosClient.get(link)
        .then(response => {
            // if (page === 0){
            //     page = 1;
            // }
            const data = response.data;
            console.log("response data: ", data);
            console.log(" page ", page, "limit: ",limit)
            // Calculate pagination
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedData = data.slice(startIndex, endIndex);
            
            // Get the length of the entire dataset
            const dataLength = data.length;

            return { data: paginatedData, dataLength };
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error; // Throw the error to handle it in the component
        });
};
