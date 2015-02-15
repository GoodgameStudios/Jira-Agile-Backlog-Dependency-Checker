(function() {
  var version = "0.1.0";
  console.log("Version: " + version);
  
  var isDev = typeof isDev !== 'undefined' && isDev ;
  var isTest = typeof isTest !== 'undefined' && isTest ;
  
  var hostOrigin = "https://qoomon.github.io/Jira-Agile-Backlog-Dependency-Checker/";
  if(isDev){
    console.log("DEVELOPMENT");
    hostOrigin = "https://rawgit.com/qoomon/Jira-Agile-Backlog-Dependency-Checker/develop/";
  }
  if(isTest){
    console.log("TEST");
  }
  
  // <GoogleAnalytics>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-50840116-3', {'alwaysSendReferrer': true});
  if(isTest || isDev){
    ga('set', 'page', '/dev/backlogchecker');
  } else {
    ga('set', 'page', '/backlogchecker');
  }
  
  ga('send', 'pageview');
 
  jQuery.fn.isAfter = function(sel){
    return this.prevAll().filter(sel).length !== 0;
  };

  jQuery.fn.isBefore= function(sel){
    return this.nextAll().filter(sel).length !== 0;
  };

  function loadDataJSON(issueKey, callback) {

    //https://docs.atlassian.com/jira/REST/latest/
    var url = '/rest/api/2/issue/' + issueKey + '?fields=summary,issuelinks';
    //console.log("IssueUrl: " + window.location.hostname + url);
    //console.log("Issue: " + issueKey + " Loading...");
    return  jQuery.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: function(responseData){
        //console.log("Issue: " + issueKey + " Loaded!");
        callback(responseData);
      },
      data: {},
    });
  }

  function checkDependencies(){
    // reomve old warnings first
    jQuery('.blocked-warning').remove();
    // check for dependencies
    jQuery('[data-issue-key]').each(function() {
      var issueElement = jQuery(this);
      var issueKey = issueElement.attr('data-issue-key');
      loadDataJSON(issueKey, function(responseData){
        var issueLinks = responseData.fields.issuelinks;
        jQuery.each(issueLinks,function(position, issue) {
          if(issue.type.name == "Blocker" && issue.inwardIssue){
            var dependencyIssueKey = issue.inwardIssue.key;
            if (issueElement.isBefore('[data-issue-key='+dependencyIssueKey+']')) {

              var warning = jQuery('<a href="/browse/'+dependencyIssueKey+'" title="'+dependencyIssueKey+'">↯ '+dependencyIssueKey+'</a>');
              warning.addClass('blocked-warning aui-label ghx-label-2 ghx-label ghx-label-double');
              warning.attr('title', issue.type.inward + ' ' + dependencyIssueKey);
              warning.css('color', 'FIREBRICK');
              warning.css('background-color', 'white');
              warning.css('border-color', 'FIREBRICK');
              warning.css('border-width', '2px');
              warning.css('font-weight', 'bold');
              
              warning.click(function(){
                jQuery('html, #ghx-backlog').animate({
                  scrollTop: jQuery('[data-issue-key=TST-62493]').offset().top - jQuery(".ghx-backlog-container").offset().top - 50 
                }, 500);
                return false;
              })

              issueElement.find('.ghx-end.ghx-row').prepend(warning);
            }
          }
        })
      })
    });
  }

  checkDependencies();
})();

