window.addEventListener('DOMContentLoaded', e => {
    let links = document.getElementsByClassName('video-links');
    let videoFrame = document.getElementById('youtube-frame');
    for (let index = 0; index < links.length; index++) {
        let element = links.item(index);
        console.log(`Added link to: ${index}`);
        // element.addEventListener('click', e => {
        //     e.preventDefault();
        //     let src = element.getAttribute('data-label')
        //     videoFrame.setAttribute('src', videoFrame.getAttribute('src').replace(videoFrame.getAttribute('src').split("?")[0], src));
        //     document.getElementsByClassName('active-video').item(0).classList.remove('active-video');
        //     element.classList.add('active-video');
        // })
    }
});