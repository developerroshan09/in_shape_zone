const transformAutocomplete = (rawData) => {
    console.log(rawData);
    console.log(Array.isArray(rawData));
    if (!rawData) {
        return [];
    }

    return rawData.map(suggestion => ({
        text: suggestion,
        value: suggestion
    }));
}

module.exports = {
    transformAutocomplete,
};