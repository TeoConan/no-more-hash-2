module.exports = {
    apps : [{
      name : "no-more-hash-2",
      script : "npm run prod",
      watch : true,
      env : {
        NODE_ENV : "production"
      }
    }]
  };
  