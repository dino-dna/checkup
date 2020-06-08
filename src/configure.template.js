module.exports.configure = ({ execa, fs, fetch }) => {
  return [
    {
      name: "my-api-status",
      fn: () => {
        return fetch("https://www.google.com").then((res) => res.ok);
      },
    },
    {
      name: "failure-with-message-example",
      fn: async () => {
        throw new Error("throw human friendly error messages, always!");
      },
    },
    {
      pollDurationMs: 10000,
      name: "long-running-tasks-show-pending",
      fn: async () => {
        return new Promise((res) => setTimeout(res, 5000));
      },
    },
    {
      pollDurationMs: 1000 * 60 * 10, // 10m
      name: "abq-air-quality",
      fn: async ({ log }) => {
        const [res] = await fetch(
          "https://airnowgovapi.com/reportingarea/get",
          {
            headers: {
              accept: "*/*",
              "content-type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
            referrer:
              "https://www.airnow.gov/?city=Albuquerque&state=NM&country=USA",
            referrerPolicy: "no-referrer-when-downgrade",
            body:
              "latitude=35.0844&longitude=-106.65114&stateCode=NM&maxDistance=50",
            method: "POST",
          }
        ).then((res) => res.json());
        if (res.aqi) log({ level: "info", message: `ABQ AQI: ${res.aqi}` });
        if (res && res.aqi <= 50) return `aqi: ${res.aqi}`;
        throw new Error(`aqi ${res.category} - ${res.aqi}`);
      },
    },
  ];
};
