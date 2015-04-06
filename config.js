var config, statuses;



statuses = {
  active : {
    message: "Active"
  },
  deploy: {
    message: "Deploy"
  },
  error: {
    message: "Error"
  },
  worker: {
    waiting: "Waiting for deploy end"
  }
};

config = {
  DELAY_CHECK_SITES: 5 * 1000,
  statuses: statuses,
  sites: [
    {
      host: 'http://example.com',
      name: 'example.com',
      status: statuses.active.message,
      last_deploy_date: "N/A"
    },
    {
      host: 'http://example2.com',
      name: 'example2.com',
      status: statuses.active.message,
      last_deploy_date: "N/A"
    },
    {
      host: 'http://example3.com',
      name: 'example3.com',
      status: statuses.active.message,
      last_deploy_date: "N/A"
    },
  ]
};

module.exports = config;
