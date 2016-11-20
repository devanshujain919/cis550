
/*
 * GET home page, which is specified in Jade.
 */

exports.do_work = function(req, res){
  res.render('index', {});
};
exports.do_ref = function(req, res){
  res.render('reference.jade', {});
};
