import config, { isDev } from '$lib/config';
import Rollbar, { type Configuration } from "rollbar";

const rollbar = new Rollbar({
    accessToken: config.rollbarAccessToken,
    enabled: !isDev,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: config.env
    }
} as Configuration);

export default rollbar;