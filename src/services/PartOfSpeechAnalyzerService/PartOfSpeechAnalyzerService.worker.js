import nlp from "compromise";

// TODO: Implement accordingly
let doc = nlp("she sells seashells by the seashore.");
doc.verbs().toPastTense();
console.log(doc.text());

global.postMessage("ready");
