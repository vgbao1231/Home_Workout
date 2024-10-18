
export default class ReducerdHelpers {
    static tableHelpers = {
        toggleSelectRow(state, action) {
            const { page, rowData } = action.payload;
            const rowExisting = state.selectedRows[page] && state.selectedRows[page][rowData["subscriptionId"]];
            if (rowExisting) {
                delete state.selectedRows[page][rowData["subscriptionId"]];  //--Remove row
                if (Object.keys(state.selectedRows[page]).length === 0)
                    delete state.selectedRows[page];  //--Remove page if it's empty
            } else {
                if (!state.selectedRows[page]) state.selectedRows[page] = {};  //--Create empty page if it's not existing.
                state.selectedRows[page][rowData["subscriptionId"]] = rowData;  //--Add rowData to the selectedRows page.
            }
        },
        toggleSelectingAllRows(state, action) {
            const { page } = action.payload;
            const fullPageExisting = state.selectedRows[page] && Object.keys(state.selectedRows[page]).length === state.data.length;
            if (fullPageExisting)
                delete state.selectedRows[page];
            else {
                if (!state.selectedRows[page]) state.selectedRows[page] = {};  //--Create empty page if it's not existing.
                state.selectedRows[page] = state.data.reduce((acc, row) => {
                    acc[row.subscriptionId] = row;
                    return acc;
                }, {});
            }
        },
    }
}