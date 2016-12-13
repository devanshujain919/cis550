
/*
 * GET home page, which is specified in Jade.
 */

exports.home = function(req, res){
  res.render('index', {});
};

exports.login_index = function(req, res){
  res.render('login_index', {});
};

exports.bing_search = function(req, res){
  console.log(req);
};