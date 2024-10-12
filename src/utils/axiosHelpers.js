
export default class AxiosHelpers {
    static paramsSerializerForGet(params) {
        let filterFields = {};

        if ("filterFields" in params && params[filterFields]) {
            filterFields = params["filterFields"];
            delete params["filterFields"];
        }
        //--Parsing Regular Params
        const result = Object.entries(params).reduce((acc, [key, value]) =>
            (value !== null && value !== undefined) ? [...acc, `${encodeURIComponent(key)}=${encodeURIComponent(value)}`] : acc
            , []);

        //--Parsing Nested Object Params
        if (Object.keys(filterFields).length !== 0) {
            result.push("filterFields", Object.entries(filterFields).reduce((acc, [key, value]) =>
                (value !== null && value !== undefined)
                    ? [...acc, Array.isArray(value)
                        ? `${encodeURIComponent(key)}[${value}]=[${value.join(',')}]`
                        : `${encodeURIComponent(key)}[${value}]=${encodeURIComponent(value)}`]
                    : acc
                , []).join("&"));
        }
        return result.join('&');
    }
}