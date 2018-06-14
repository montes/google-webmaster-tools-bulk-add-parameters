/*

EXTENSION

cup-action: ADD
security_token: K5wGupSqxDI0OhJE9L-uAeXiaAI:1528981195245
cup-param-name: parameter3
cup-auto-c: parameter3
cup-is-change-select: NO
cup-effect-select: NOT_SET
cup-crawl: LET_GOOGLEBOT_DECIDE
cup-spec-val:

ORIGINAL

security_token: Lri3_cBfLP-3Z13GRMAPBDq9_9Y:1528981240174
cup-param-name: paramete99
cup-action: ADD
cup-auto-c: paramete99
cup-is-change-select: NO
cup-effect-select: NOT_SET
cup-crawl: LET_GOOGLEBOT_DECIDE
cup-spec-val:

*/


window.onload = function() {
  const fileInput             = "<input id='fileinput' type='file' />";
  const removalMethodDropdown = "<select id='removalmethod'>" +
    '<option value="NOT_SET" selected="" id="cup-is-change-default">Select</option>' +
    '<option value="NO">No: Doesnt affect page content (ex: tracks usage)</option>' +
    '<option value="YES">Yes: Changes, reorders, or narrows page content</option>' +
    '</select>';
  const cupEffectDropdown     = '<select style="display:none" id="cupeffect">' +
    '<option value="NOT_SET" selected="" id="cup-effect-default">Select</option> <option value="SORTS">Sorts</option> <option value="NARROWS">Narrows</option> <option value="SPECIFIES">Specifies</option> <option value="TRANSLATES">Translates</option> <option value="PAGINATES">Paginates</option> <option value="OTHER">Other</option>' +
    '</select>';
  const cupCrawlDropdown      = '<select style="display:none" id="cupcrawl">' +
    '<option selected value="LET_GOOGLEBOT_DECIDE">Let googlebot decide</option>' +
    '<option value="EVERY_URL">Every URL</option>' +
    '<option value="ONLY_URLS_WITH_VALUE">Only URLs with value:</option>' +
    '<option value="NO_URLS">No URLs</option>' +
    '</select>';

  document.getElementById('cup-add-param-link').innerHTML += fileInput + removalMethodDropdown + cupEffectDropdown + cupCrawlDropdown;

  document.getElementById('removalmethod').addEventListener('input', function (evt) {
    if (this.value == 'YES') {
      document.getElementById('cupeffect').style.display = 'block';
      document.getElementById('cupcrawl').style.display  = 'block';
    } else {
      document.getElementById('cupeffect').style.display = 'none';
      document.getElementById('cupcrawl').style.display  = 'none';
    }
  });

  let port = chrome.runtime.connect({name: "backgroundConnection"});

  port.onMessage.addListener(function(msg) {
    if (msg.type === 'removeUrl') {
      const formHtml = '<form id="montesform" action="' + document.querySelector('#cup-edit-modal-dialog > form').getAttribute('action') + '" method="POST">' +
        '<input type="hidden" name="cup-action" value="ADD">' +
        '<input type="hidden" name="security_token" value="' + document.querySelector('#cup-edit-modal-dialog [name=security_token]').value + '">' +
        '<input type="hidden" name="cup-param-name" value="' + msg.parameter + '">' +
        '<input type="hidden" name="cup-auto-c" value="' + msg.parameter + '">' +
        '<input type="hidden" name="cup-is-change-select" value="' + msg.removalMethod + '">' +
        '<input type="hidden" name="cup-effect-select" value="' + msg.cupEffect + '">' +
        '<input type="hidden" name="cup-crawl" value="' + msg.cupCrawl + '">' +
        '<input type="hidden" name="cup-spec-val" value="">' +
        '<input type="submit" id="montessubmit">' +
        '</form>';

      document.body.innerHTML += formHtml;

      document.getElementById('montessubmit').click();
    }
  });

  document.getElementById('fileinput').addEventListener('input', function (evt) {
    Array.from(this.files).forEach(file => {
      let reader = new FileReader();

      reader.onload = (function(event) {
        port.postMessage({
          'type':          'initData',
          'removalMethod': document.getElementById('removalmethod').value,
          'cupEffect':     document.getElementById('cupeffect').value,
          'cupCrawl':      document.getElementById('cupcrawl').value,
          'rawTxt':        event.target.result
        });
      });

      reader.readAsText(file);
    });
  });

  setTimeout(() => {
    port.postMessage({
      'type': 'nextLine'
    });
  }, 1000);
};
