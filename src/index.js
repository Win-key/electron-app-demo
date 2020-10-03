let $ = jQuery = require('jquery');
const datepicker = require('js-datepicker')
const {ipcRenderer} = require('electron')

let date = datepicker("#mydate",{
    formatter: (input, date, instance) => {
      input.value = getFormattedDate(date)
    }
})

$("form").submit(e=>{
    e.preventDefault();
    let date = $("#mydate").val();
    console.log("picked date", date)
    ipcRenderer.send("object-date", date);
})

function getFormattedDate(date) {
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) 
            + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) 
            + '-' + date.getFullYear()
  }