export const isTuError = (er: any): string | undefined => {
    const msg = er?.response?.data?.message;
    return msg?.startsWith?.("tu:") ? msg.replace("tu:", "") : undefined;
};

/**
 *
 * @param interval interval in minutes
 * @returns Cron-job specs
 */
export const jobSpecs = (interval: number) => {
    if (interval < 1) {
        throw new Error("Interval must be at least 1 minute.");
    }

    const minutesInHour = 60;
    const minutesInDay = minutesInHour * 24;
    const minutesInWeek = minutesInDay * 7;

    // If interval is less than an hour
    if (interval < minutesInHour) {
        return `*/${interval} * * * *`;
    }

    // If interval is in hours but less than a day
    if (interval < minutesInDay) {
        const hours = Math.floor(interval / minutesInHour);
        const remainingMinutes = interval % minutesInHour;

        if (remainingMinutes === 0) {
            return `0 */${hours} * * *`;
        } else {
            throw new Error(
                "Non-whole-hour intervals are not supported for intervals >= 1 hour."
            );
        }
    }

    // If interval is in days but less than a week
    if (interval < minutesInWeek) {
        const days = Math.floor(interval / minutesInDay);

        return `0 0 */${days} * *`;
    }

    // If interval is in weeks
    const weeks = Math.floor(interval / minutesInWeek);

    return `0 0 * * ${weeks}`;
};

export // Dynamically create the object
const createModelFields = <T>() => {
    return Object.fromEntries(
        (Object.keys({}) as (keyof T)[]).map((key) => [key, {}])
      ) as { [K in keyof T]: {} };
};
