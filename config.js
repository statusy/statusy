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
  }
};

config = {
  statuses: statuses,
  sites: [
    {
      name: 'example site 1',
      status: statuses.active.message,
      last_deploy_date: "N/A"
    },
    {
      name: 'example site 2',
      status: statuses.active.message,
      last_deploy_date: "N/A"
    },
    {
      name: 'example site 3',
      status: statuses.active.message,
      last_deploy_date: "N/A"
    },
  ]
};

module.exports = config;
