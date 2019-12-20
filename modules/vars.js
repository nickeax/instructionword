const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const VVC = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const JSkeyWordsA = ['abstract', 'arguments', 'await'];
const JSkeyWordsB = ['boolean', 'break', 'byte'];
const JSkeyWordsC = ['case', 'catch', 'char', 'class', 'const', 'continue', 'console'];
const JSkeyWordsD = ['debugger', 'default', 'delete', 'do', 'double', 'document'];
const JSkeyWordsE = ['else', 'enum', 'evalexport', 'extends'];
const JSkeyWordsF = ['false', 'final', 'finally', 'float', 'for', 'function'];
const JSkeyWordsG = ['goto'];
const JSkeyWordsH = [''];
const JSkeyWordsI = ['if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface'];
const JSkeyWordsJ = [''];
const JSkeyWordsK = [''];
const JSkeyWordsL = ['let', 'long', 'length', 'log'];
const JSkeyWordsM = [''];
const JSkeyWordsN = ['native', 'new', 'null'];
const JSkeyWordsO = [''];
const JSkeyWordsP = ['package', 'private', 'protected', 'public'];
const JSkeyWordsQ = ['querySelector'];
const JSkeyWordsR = ['return'];
const JSkeyWordsS = ['short', 'static', 'super', 'switch', 'synchronized'];
const JSkeyWordsT = ['this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof'];
const JSkeyWordsU = [''];
const JSkeyWordsV = ['var', 'void', 'volatile'];
const JSkeyWordsW = ['while', 'with'];
const JSkeyWordsX = [''];
const JSkeyWordsY = ['yield'];
const JSkeyWordsZ = [''];

const JavaScriptArray = [JSkeyWordsA, JSkeyWordsB, JSkeyWordsC, JSkeyWordsD, JSkeyWordsE, JSkeyWordsF, JSkeyWordsG, JSkeyWordsI, JSkeyWordsL, JSkeyWordsN, JSkeyWordsP, JSkeyWordsQ,
  JSkeyWordsR, JSkeyWordsS, JSkeyWordsT, JSkeyWordsV, JSkeyWordsW, JSkeyWordsY];

const PHPkeyWordsA = ['abstract', 'and', 'array', 'as'];
const PHPkeyWordsB = ['break'];
const PHPkeyWordsC = ['case', 'catch','cfunction','class','__CLASS__','clone','const', 'continue'];
const PHPkeyWordsD = ['declare','default','die','do'];
const PHPkeyWordsE = ['echo','else','elseif','empty','end','endfor','endforeach','endif','endswitch','endwhile','eval','exception','exit','extends'];
const PHPkeyWordsF = ['final','__FILE__','for','foreach','function','__FUNCTION__'];
const PHPkeyWordsG = ['global'];
const PHPkeyWordsH = [''];
const PHPkeyWordsI = ['if','implements','include','include_once','interface','isset'];
const PHPkeyWordsJ = [''];
const PHPkeyWordsK = [''];
const PHPkeyWordsL = ['__LINE__',  'list'];
const PHPkeyWordsM = ['__METHOD__'];
const PHPkeyWordsN = ['new'];
const PHPkeyWordsO = ['old_function', 'or'];
const PHPkeyWordsP = ['php_user_filter','print','private','protected','public'];
const PHPkeyWordsQ = [''];
const PHPkeyWordsR = ['require','require_once','return'];
const PHPkeyWordsS = ['static', 'switch'];
const PHPkeyWordsT = ['this', 'throw', 'try']
const PHPkeyWordsU = ['unset', 'use'];
const PHPkeyWordsV = ['var'];
const PHPkeyWordsW = ['while'];
const PHPkeyWordsX = ['xor'];
const PHPkeyWordsY = [''];
const PHPkeyWordsZ = [''];

const PHPArray = [PHPkeyWordsA, PHPkeyWordsB, PHPkeyWordsC, PHPkeyWordsD, PHPkeyWordsE, PHPkeyWordsF, PHPkeyWordsG, PHPkeyWordsI, PHPkeyWordsL, PHPkeyWordsM,
  PHPkeyWordsN, PHPkeyWordsO, PHPkeyWordsP, PHPkeyWordsR, PHPkeyWordsS, PHPkeyWordsT, PHPkeyWordsU, PHPkeyWordsV, PHPkeyWordsX];

const languagesArray = [JavaScriptArray, PHPArray]; 

class Marker {
  constructor(start, type, len, word) {
    this.start = start;
    this.type = type;
    this.len = len;
    this.word = word;
  }
}