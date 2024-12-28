import Handlebars from "handlebars";

let _html_precompiled: any = {};
// this tag function provides inline handlebars processing
// usage: html`<some>{{ handlebars_var }}</some>${data}`
// will become `<some>{{ handlesbars_var }}</some>` to handlebars renderer with data
export function html(strings: TemplateStringsArray, ...values: any[]) {
  if (!strings) return "";
  if (!values) return strings.join("");
  if (strings[strings.length - 1] == "") {
    // 这意味着模板的末尾有变量，因此把传入的字符当 Handlebars 模板
    let input = strings.reduce((acc, str, i) => {
      acc += str;
      if (i < values.length - 1) {
        acc += values[i];
      }
      return acc;
    }, "");
    _html_precompiled[input] = Handlebars.compile(input);
    return _html_precompiled[input](values[values.length - 1]);
  }
  return strings.reduce((acc, str, i) => {
    acc += str;
    if (i < values.length) {
      acc += values[i];
    }
    return acc;
  }, "");
}
