var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const VVC = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const keyWordsA = ['abstract', 'arguments', 'await'];
const keyWordsB = ['boolean', 'break', 'byte'];
const keyWordsC = ['case', 'catch', 'char', 'class', 'const', 'continue', 'console'];
const keyWordsD = ['debugger', 'default', 'delete', 'do', 'double', 'document'];
const keyWordsE = ['else', 'enum', 'evalexport', 'extends'];
const keyWordsF = ['false', 'final', 'finally', 'float', 'for', 'function'];
const keyWordsG = ['goto'];
const keyWordsI = ['if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface'];
const keyWordsL = ['let', 'long', 'length', 'log'];
const keyWordsN = ['native', 'new', 'null'];
const keyWordsP = ['package', 'private', 'protected', 'public'];
const keyWordsQ = ['querySelector'];
const keyWordsR = ['return'];
const keyWordsS = ['short', 'static', 'super', 'switch', 'synchronized'];
const keyWordsT = ['this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof'];
const keyWordsV = ['var', 'void', 'volatile'];
const keyWordsW = ['while', 'with'];
const keyWordsY = ['yield'];

class Marker {
  constructor(start, type, len, word) {
    this.start = start;
    this.type = type;
    this.len = len;
    this.word = word;
  }
}