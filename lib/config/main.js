function setup(options, imports, register) {
    var config = {
        /* Debug mode */
        "debug": process.env.HOST != "www.gitbook.io",
        "logs": ["log", "error"],

        /* Server configuration */
        "web": {
            /* (string) Hostname for the application */
            "host": process.env.HOST || "www.gitbook.io",

            /* (boolean) Secure https mode */
            "secure": process.env.HTTPS != null,

            /* (int) TCP server port */
            "port": process.env.PORT || 5000,

            /* (string) Session secret */
            "sessionSecret": process.env.SESSION_SECRET || "sessionSecret"
        },

        /* GitHub */
        "github": {
            "id": process.env.GITHUB_CLIENTID,
            "secret": process.env.GITHUB_CLIENTSECRET
        },

        /* Mixpanel */
        "mixpanel": {
            "token": process.env.MIXPANEL_TOKEN
        },
    };

    config.web.url = config.web.secure ? "https://"+config.web.host : "http://"+config.web.host;
    if (!config.debug) {
        config.logs = ["error"];
    }

    register(null, {
        'config': config
    });
};

// Exports
module.exports = setup;
