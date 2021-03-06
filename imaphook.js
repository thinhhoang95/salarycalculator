var Imap = require('imap'),
    inspect = require('util').inspect;
    
var fs = require('fs'), fileStream;

var imap = new Imap({
  user: 'uavdesignandtesting@gmail.com',
  password: 'Elsa Alstrom',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

console.log("Script ready!");

imap.once('ready', function() {
openInbox(function(err, box) {
    if (err) throw err;
    // imap.search([ ['SINCE', 'May 20, 2010'] ], function(err, results) {
    //imap.sort([ '-ARRIVAL' ], [ 'NEW' ], function(err, results) {
    //  if (err || !results.length) return imap.end();
    imap.search([ 'UNSEEN' ], function(err, results) {
        if (err || !results.length) return imap.end();

      var f = imap.fetch(results[0], { bodies: 'TEXT' });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          console.log(prefix + 'Body');
          stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
});

imap.connect();