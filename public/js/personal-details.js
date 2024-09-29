window.addEventListener('DOMContentLoaded', e => {
    let btns = document.getElementsByClassName('input-toggle-btn');
    let inputs = document.getElementsByClassName('toggled-input');
    let currentValues = document.getElementsByClassName('toggled-para');
    let saveBtn = document.getElementById('save-btn');
    for (let index = 0; index < btns.length; index++) {
        const btn = btns.item(index);
        const input = inputs.item(index);
        const currentValue = currentValues.item(index);
        btn.addEventListener('click', e => {
            e.preventDefault()
            if(input.classList.contains('d-none')){
                input.classList.remove("d-none");
                input.focus()
                input.select()
                currentValue.classList.add("d-none");
            }
            else{
                return
            }
        })
        input.addEventListener('input', e => {
            if(input.value !== input.defaultValue){
                saveBtn.classList.remove('disabled');
            } else {
                if(!saveBtn.classList.contains('disabled'))
                saveBtn.classList.add('disabled');
            }
        })
        input.addEventListener('blur', e => {
            if(input.value === input.defaultValue){
                input.classList.add("d-none");
                currentValue.classList.remove("d-none");
            }
        })
    }
})