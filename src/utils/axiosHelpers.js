
export default class AxiosHelpers {
    static paramsSerializerForGet(params) {
        let filterFields = {};

        if ("filterFields" in params && params.filterFields !== null & params.filterFields !== undefined) {
            filterFields = params["filterFields"];
            delete params["filterFields"];
        }
        //--Parsing Regular Params
        const result = Object.entries(params).reduce((acc, [key, value]) =>
            (value !== null && value !== undefined) ? [...acc, `${encodeURIComponent(key)}=${encodeURIComponent(value)}`] : acc
            , []);

        //--Parsing Nested Object Params
        if (Object.keys(filterFields).length !== 0) {
            result.push(Object.entries(filterFields).reduce((acc, [key, value]) =>
                (value !== null && value !== undefined)
                    ? [...acc, Array.isArray(value)
                        ? `filterFields[${encodeURIComponent(key)}]=[${value.join(',')}]`
                        : `filterFields[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`]
                    : acc
                , []).join("&"));
        }
        return result.join('&');
    }
    static checkAndReadBase64Token(token) {
        if (!token)
            return {};
        return JSON.parse(atob(token.split(".")[1]));
    }
}