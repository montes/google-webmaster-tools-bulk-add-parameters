let executionInProgress = false;
let removalMethod       = null;
let cupEffect           = null;
let cupCrawl            = null;
let fileLinesArray      = null;

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.type === 'initData') {
      executionInProgress = true;
      fileLinesArray      = msg.rawTxt.replace(/^\s+|\s+$/g, '').split('\n');
      removalMethod       = msg.removalMethod;
      cupEffect           = msg.cupEffect;
      cupCrawl            = msg.cupCrawl;

      var parameter = fileLinesArray.pop();
      port.postMessage({
        'type' :         'removeUrl',
        'parameter':     parameter,
        'removalMethod': removalMethod,
        'cupEffect':     cupEffect,
        'cupCrawl':      cupCrawl
      });

    } else if (msg.type === 'nextLine') {
      if (executionInProgress) {
        var parameter = fileLinesArray.pop();

        if (parameter !== undefined) {
          port.postMessage({
            'type' :         'removeUrl',
            'parameter':     parameter,
            'removalMethod': removalMethod,
            'cupEffect':     cupEffect,
            'cupCrawl':      cupCrawl
          });
        } else {
          executionInProgress = false; //done
          removalMethod       = null;
          fileLinesArray      = null;
          cupEffect           = null;
          cupCrawl            = null;
        }
      }

    } else if (msg.type == 'askState') {
      port.postMessage({
        'type' :                'state',
        'executionInProgress' : executionInProgress,
        'removalMethod' :       removalMethod,
        'cupEffect':            cupEffect,
        'cupCrawl':             cupCrawl
      });
   }
  });
});

