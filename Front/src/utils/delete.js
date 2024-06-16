import axiosClient from "../axios-client.js";

export const deleteElementUtil = async (url, id) => {
    try { 
        const deleteUrl = url + id; 
        console.log("delete url: ", deleteUrl);
        const response = await axiosClient.delete(deleteUrl); 
        return {
            status: "ok",
            message: response.data.message
        };
    } catch (error) {
        const errorMessageString = JSON.stringify(error.response.data.error);
        return {
            status: "error",
            message: errorMessageString
        };
    }

}