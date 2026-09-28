/* CJK 分词：中日文按「单字 + 二元(bigram)」切分，拉丁/数字按词切分。
   用于让 mdbook 默认搜索（英文分词）支持中文与日语。自包含，无外部依赖。 */
(function (root) {
  var CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u309f\u30a0-\u30ff\u31f0-\u31ff\u3400-\u4dbf]/;

  function tokenize(text) {
    if (text == null) { return []; }
    var str = String(text).toLowerCase();
    var tokens = [];
    // 拉丁字母与数字：按非字母数字切分
    var latin = str.match(/[a-z]+[a-z0-9]*|[0-9]+/g);
    if (latin) { tokens = tokens.concat(latin); }
    // CJK：连续 CJK 串内部做 单字 + bigram
    var buf = '';
    var flush = function () {
      if (!buf) { return; }
      for (var i = 0; i < buf.length; i++) {
        tokens.push(buf[i]);                       // 单字，提高召回
        if (i + 1 < buf.length) {
          tokens.push(buf.substr(i, 2));           // 二元，提高精度
        }
      }
      buf = '';
    };
    for (var j = 0; j < str.length; j++) {
      var ch = str[j];
      if (CJK.test(ch)) { buf += ch; } else { flush(); }
    }
    flush();
    return tokens;
  }

  root.cjkTokenizer = tokenize;
})(typeof window !== 'undefined' ? window : this);
