
export default class AxiosHelpers {
    static paramsSerializerForGet(params) {
        let filterFields = {};
        if ("filterFields" in params) {
            filterFields = params["filterFields"];
            delete params["filterFields"];
        }
        //--Parsing Regular Params
        const result = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

        //--Parsing Nested Object Params
        if (Object.keys(filterFields).length !== 0) {
            result.push("filterFields", Object.entries(filterFields).map(([key, value]) => Array.isArray(value)
                ? `${encodeURIComponent(key)}[${value}]=[${value.join(',')}]`
                : `${encodeURIComponent(key)}[${value}]=${encodeURIComponent(value)}`
            ).join("&"));
        }
        return result.join('&');
    }
}