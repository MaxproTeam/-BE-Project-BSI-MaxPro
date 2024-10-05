const getWIBTime = (hoursToAdd = 0) => {
    const currentUTC = new Date();

    const jakartaTime = new Date(
        currentUTC.getUTCFullYear(),
        currentUTC.getUTCMonth(),
        currentUTC.getUTCDate(),
        currentUTC.getUTCHours() + 7 + hoursToAdd,
        currentUTC.getUTCMinutes(),
        currentUTC.getUTCSeconds()
    );

    const formattedTime = jakartaTime.getFullYear() + '-' +
        String(jakartaTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(jakartaTime.getDate()).padStart(2, '0') + ' ' +
        String(jakartaTime.getHours()).padStart(2, '0') + ':' +
        String(jakartaTime.getMinutes()).padStart(2, '0') + ':' +
        String(jakartaTime.getSeconds()).padStart(2, '0');

    return formattedTime;
};

const getHoursWIBTime = (hoursToAdd = 0) => {
    const currentUTC = new Date();

    const jakartaTime = new Date(
        currentUTC.getUTCFullYear(),
        currentUTC.getUTCMonth(),
        currentUTC.getUTCDate(),
        currentUTC.getUTCHours() + 7 + hoursToAdd,
        currentUTC.getUTCMinutes(),
        currentUTC.getUTCSeconds()
    );

    // Format the Jakarta time
    const formattedTime = String(jakartaTime.getHours()).padStart(2, '0') + ':' +
        String(jakartaTime.getMinutes()).padStart(2, '0') + ':' +
        String(jakartaTime.getSeconds()).padStart(2, '0');

    return formattedTime;
};

export { getWIBTime, getHoursWIBTime};