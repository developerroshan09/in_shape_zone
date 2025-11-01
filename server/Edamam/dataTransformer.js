const transformAutocomplete = (rawData) => {
    console.log(rawData);
    console.log(Array.isArray(rawData));
    if (!rawData) {
        return [];
    }

    return rawData.map(suggestion => ({
        suggestion
    }));
}

module.exports = {
    transformAutocomplete,
};