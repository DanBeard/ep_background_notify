exports.expressCreateServer = function (hook_name, args, cb) {
  args.app.get('/media/notify', function(req, res) {
    res.sendfile('static/media/notify.wav');
  });
}