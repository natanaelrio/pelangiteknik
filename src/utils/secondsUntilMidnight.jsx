export const secondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();

    // Set ke jam 00:00 besok
    midnight.setHours(24, 0, 0, 0);

    return Math.floor((midnight - now) / 1000);
};