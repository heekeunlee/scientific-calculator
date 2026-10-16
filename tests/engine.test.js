const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const src = html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m = { exports: {} };
new Function('module', src)(m);
const C = m.exports;
const ev = (s, o) => C.format(C.evaluate(s, o));
const cases = [
  ['1+2×3', '7'], ['(1+2)×3', '9'], ['2^3^2', '512'], ['−2^2', '-4'], ['10÷4', '2.5'],
  ['sin(30)', '0.5'], ['cos(90)', '0'], ['tan(45)', '1'], ['sin(180)', '0'],
  ['asin(1)', '90'], ['log(1000)', '3'], ['ln(e)', '1'], ['√(16)', '4'], ['∛(27)', '3'],
  ['5!', '120'], ['0.5!', '0.886226925453'], ['2π', '6.28318530718'], ['3(4+1)', '15'],
  ['2sin(30)', '1'], ['50%', '0.5'], ['10 mod 3', '1'], ['−7 mod 3', '2'],
  ['5 nCr 2', '10'], ['5 nPr 2', '20'], ['1.5E3', '1500'], ['2E−3', '0.002'],
  ['(−8)^(1/3)', '-2'], ['4^(−1)', '0.25'], ['0.1+0.2', '0.3'], ['e^(1)', '2.71828182846'],
  ['10^(2)', '100'], ['log₂(8)', '3'], ['abs(−5)', '5'], ['sinh(0)', '0'], ['Ans+1', '11'],
  ['√9', '3'], ['esin(90)', '2.71828182846'], ['Anse', '27.1828182846'], ['2e', '5.43656365692'], ['Ansπ', '31.4159265359'], ['exp(0)', '1'], ['2^10', '1024'], ['171!', 'ERR'], ['1÷0', 'ERR'], ['tan(90)', 'ERR'],
  ['√(−1)', 'ERR'], ['ln(0)', 'ERR'], ['(1+2', 'ERR'], ['1+', 'ERR'], ['1..2', 'ERR'], ['foo(2)', 'ERR'],
];
let fail = 0;
for (const [e, want] of cases) {
  let got;
  try { got = ev(e, { deg: true, ans: 10 }); } catch (err) { got = 'ERR'; var msg = err.message; }
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${e} => ${got}${got === 'ERR' ? ' (' + msg + ')' : ''}${ok ? '' : '  (expected ' + want + ')'}`);
}
console.log('RAD sin(π/2) =', ev('sin(π/2)', { deg: false }));
console.log(`\n${cases.length - fail}/${cases.length} passed`);
process.exit(fail ? 1 : 0);
