// tested for Chrome, IE
javascript:(function(){
        var head = document.getElementsByTagName("head")[0];
        var scriptElement = document.createElement("script");
        scriptElement.src = 'https://qoomon.github.io/Jira-Agile-Backlog-Dependency-Checker/bookmarklet.js';	
        head.appendChild(scriptElement);
        head.removeChild(scriptElement);
})();
