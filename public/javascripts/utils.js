const code = require('./status');
class Utils {
      //格式化输出
      outPut(res,status,data,msg) {
          return res.send({status,data,msg: msg || code[status]||""});
      }
}
const common = new Utils();
module.exports = common;