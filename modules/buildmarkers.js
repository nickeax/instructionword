function buildMarkers(str) {
  let start = 0;
  let tmp = "";
  for (let i = 0; i < str.length; i++) {
    if (VVC.indexOf(str[i]) != -1) { // Is alpha numeric, hyphen or underscore?
      start = i;
      place = start;
      while (VVC.indexOf(str[i]) != -1) { // Keep adding characters until is alpha numeric, hyphen or underscore
        tmp += str[i]; // This builds a string until a none VVC is detected
        i++;
      }
      i -= 1; // Jump back a character 
      let marker = new Marker(start, "VVC", tmp.length, tmp);
      markers.push(marker);
      tmp = "";
    } else if (VVC.indexOf(str[i]) == -1) {
      start = i;
      if (str[i] == "'") {
        tmp += str[i];
        let marker = new Marker(start, "SQT", 1, "&#8217;");
        markers.push(marker);
      } else if (str[i] == '"') {
        tmp += str[i];
        let marker = new Marker(start, "DQT", 1, "&#8220;");
        markers.push(marker);
      } else if (str[i] == " ") {
        tmp += str[i];
        let marker = new Marker(start, "SPC", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "\n") {
        tmp += str[i];
        tmp += "\n";
        let marker = new Marker(start, "NWL", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "{") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "}") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "(") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == ")") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "<") {
        let marker = new Marker(start, "MTH", 1, "&lt;");
        markers.push(marker);
      } else if (str[i] == ">") {
        let marker = new Marker(start, "MTH", 1, "&gt;");
        markers.push(marker);
      } else if (str[i] == "=") {
        let marker = new Marker(start, "MTH", 1, "=");
        markers.push(marker);
      } else if (str[i] == "!") {
        let marker = new Marker(start, "MTH", 1, "!");
        markers.push(marker);
      } else if (str[i] == "*") {
        let marker = new Marker(start, "MTH", 1, "*");
        markers.push(marker);
      } else if (str[i] == "/") {
        let marker = new Marker(start, "MTH", 1, "/");
        markers.push(marker);
      } else {
        let marker = new Marker(start, str[i], str[i].length, str[i]);
        markers.push(marker);
      }
    }
    tmp = "";
  }
}