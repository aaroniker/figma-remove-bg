import './scss/ui.scss'

var $ = require('jQuery')

$('#setApiKey').on('submit', e => {
    e.preventDefault()
    parent.postMessage({
        pluginMessage: $('#apiKey').val()
    }, '*')
});

window.onmessage = async (event) => {
    if(event.data.pluginMessage.type == 'key') {
        $('#apiKey').val(event.data.pluginMessage.apikey || '')
    }
    if(event.data.pluginMessage.type == 'run') {

        let data = new FormData(),
            base64 = btoa(new Uint8Array(event.data.pluginMessage.bytes).reduce((data, byte) => {
                return data + String.fromCharCode(byte)
            }, ''));

        data.append('image_file_b64', base64)

        fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': event.data.pluginMessage.apikey,
                'Accept': 'application/json'
            },
            body: data
        }).then(response => {
            if(!response.ok) {
                throw response
            }
            return response
        }).then(response => {
            response.json().then(res => {
                parent.postMessage({
                    pluginMessage: Uint8Array.from(atob(res.data.result_b64), c => c.charCodeAt(0))
                }, '*')
            })
        }).catch(response => {
            response.json().then(res => {
                parent.postMessage({
                    pluginMessage: res
                }, '*')
            })
        })
    }
}
