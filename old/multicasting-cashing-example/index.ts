import {Form} from "./form";

const form1: HTMLFormElement = document.querySelector('#first') as HTMLFormElement;
const form2: HTMLFormElement = document.querySelector('#second') as HTMLFormElement;
form2.hidden = true;
new Form(form1);

setTimeout(() => {
   form2.hidden = false;
    new Form(form2);
}, 5000);
