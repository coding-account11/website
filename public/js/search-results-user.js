window.addEventListener("DOMContentLoaded", e => {
    let btns = document.getElementsByClassName('page-nav');
    let forwardBtn = document.getElementById("page-nav-forward")
    let backwardBtn = document.getElementById("page-nav-backward")
    let searchCard = document.getElementById("search-cards")

    for (i = 0; i < btns.length; i++) {
        let button = btns.item(i)
        button.addEventListener('click', e => {
            if (button.classList.contains('active')) {
                return
            }
            else {
                let flag1 = true;
                let flag2 = true;
                let notedJ;
                for (j = 0; j < btns.length; j++) {
                    let btn = btns.item(j)
                    if (btn.classList.contains('active') && flag1) {
                        btn.classList.remove('active')
                        if (j === 0) {
                            backwardBtn.classList.remove('disabled')
                        }
                        if (j === btns.length - 1) {
                            forwardBtn.classList.remove('disabled')
                        }
                        flag1 = false;
                    }
                    if (button === btn && flag2) {
                        notedJ = j;
                        btn.classList.add('active')
                        if (notedJ === 0) {
                            backwardBtn.classList.add('disabled')
                        }
                        if (notedJ === btns.length - 1) {
                            forwardBtn.classList.add('disabled')
                        }
                        let searchWord = document.getElementById('search-word').textContent
                        axios({
                            method: 'get',
                            url: `/search/users/${searchWord}/${notedJ + 1}`,
                            responseType: 'json'
                        })
                            .then(res => {
                                searchCard.innerHTML = ``;
                                if (res.data.status === "failure") {
                                    let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${res.data.data.error}</h2>
                                        </div>
                                    </div>
                                `;
                                    searchCard.innerHTML = html;
                                } else {
                                    let { searches } = res.data.data;
                                    let html = '';
                                    searches.forEach(searchItem => {
                                        html += `
                                            <div class="col-lg-3 col-md-4 col-sm-6 col-9 mb-4 search-card">
                                                <div class="card">
                                                    <a href="/profiles/${searchItem.username}">
                                                        <img src="/images/black-background-image.jpg" class="px-4 pt-4 card-img-top" alt="...">
                                                        <div class="card-body p-4" style="min-height: 250px; max-height: 250px;">
                                                            <h5 class="card-title">${searchItem.username}</h5>
                                                            <p class="card-text text-secondary" style="height: 110px;">${searchItem.bio}
                                                            </p>
                                                            <div class="d-flex flex-row justify-content-start">
                                                                <button class="btn btn-outline-primary d-inline-block rounded mt-3"
                                                                    style="width: 80px;">Friend+
                                                                </button>
                                                                <button class="btn btn-outline-danger d-inline-block rounded mx-auto mt-3"
                                                                    style="width: 80px;">Block
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        `;
                                    });
                                    searchCard.innerHTML = html;
                                    let start, end;
                                    end = notedJ + 3;
                                    if (end >= btns.length) {
                                        end = btns.length - 1;
                                        start = end - 8;
                                    } else if (end < 8) {
                                        end = 8;
                                        start = 0;
                                    } else {
                                        start = notedJ - 5;
                                    }
                                    for (k = 0; k < btns.length; k++) {
                                        let btn1 = btns.item(k);
                                        if (k >= start && k <= end) {
                                            btn1.classList.remove('d-none');
                                        } else {
                                            btn1.classList.add('d-none');
                                        }
                                    }
                                }
                            })
                            .catch(err => {
                                let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${err.msg}</h2>
                                        </div>
                                    </div>
                                `;
                                searchCard.innerHTML = html;
                            });
                        flag2 = false
                    }
                    if (!flag1 && !flag2) return
                }
            }
        })
    }

    forwardBtn.addEventListener('click', e => {
        for (i = 0; i < btns.length; i++) {
            let btn = btns.item(i)
            if (btn.classList.contains('active')) {
                if (i < btns.length - 1) {
                    btn.classList.remove('active')
                    btns.item(i + 1).classList.add('active')
                    if (i === 0) {
                        backwardBtn.classList.remove('disabled')
                    }
                    if (i === btns.length - 2) {
                        forwardBtn.classList.add('disabled')
                    }
                    let notedJ = i + 1;
                    let searchWord = document.getElementById('search-word').textContent
                    console.log("searchWordsearchWordsearchWordsearchWord")
                    console.log("searchWordsearchWordsearchWordsearchWord")
                    console.log("searchWordsearchWordsearchWordsearchWord")
                    console.log(searchWord)
                    axios({
                        method: 'get',
                        url: `/search/${searchWord}/${notedJ + 1}`,
                        responseType: 'json'
                    })
                        .then(res => {
                            searchCard.innerHTML = ``;
                            if (res.data.status === "failure") {
                                let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${res.data.data.error}</h2>
                                        </div>
                                    </div>
                                `;
                                searchCard.innerHTML = html;
                            } else {
                                let { searches } = res.data.data;
                                let html = '';
                                searches.forEach(searchItem => {
                                    html += `
                                            <div class="col-lg-3 col-md-4 col-sm-6 col-9 mb-4 search-card">
                                                <div class="card">
                                                    <a href="/profiles/${searchItem.username}">
                                                        <img src="/images/black-background-image.jpg" class="px-4 pt-4 card-img-top" alt="...">
                                                        <div class="card-body p-4" style="min-height: 250px; max-height: 250px;">
                                                            <h5 class="card-title">${searchItem.username}</h5>
                                                            <p class="card-text text-secondary" style="height: 110px;">${searchItem.bio}
                                                            </p>
                                                            <div class="d-flex flex-row justify-content-start">
                                                                <button class="btn btn-outline-primary d-inline-block rounded mt-3"
                                                                    style="width: 80px;">Friend+
                                                                </button>
                                                                <button class="btn btn-outline-danger d-inline-block rounded mx-auto mt-3"
                                                                    style="width: 80px;">Block
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        `;
                                });
                                searchCard.innerHTML = html;
                                let start, end;
                                end = notedJ + 3;
                                if (end >= btns.length) {
                                    end = btns.length - 1;
                                    start = end - 8;
                                } else if (end < 8) {
                                    end = 8;
                                    start = 0;
                                } else {
                                    start = notedJ - 5;
                                }
                                for (k = 0; k < btns.length; k++) {
                                    let btn1 = btns.item(k);
                                    if (k >= start && k <= end) {
                                        btn1.classList.remove('d-none');
                                    } else {
                                        btn1.classList.add('d-none');
                                    }
                                }
                            }
                        })
                        .catch(err => {
                            let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${err.msg}</h2>
                                        </div>
                                    </div>
                                `;
                            searchCard.innerHTML = html;
                        });
                }
                break;
            }
        }
    })
    backwardBtn.addEventListener('click', e => {
        for (i = 0; i < btns.length; i++) {
            let btn = btns.item(i)
            if (btn.classList.contains('active')) {
                if (i > 0) {
                    btn.classList.remove('active')
                    btns.item(i - 1).classList.add('active')
                    if (i === btns.length - 1) {
                        forwardBtn.classList.remove('disabled')
                    }
                    if (i === 1) {
                        backwardBtn.classList.add('disabled')
                    }
                    let notedJ = i - 1;
                    let searchWord = document.getElementById('search-word').textContent
                    axios({
                        method: 'get',
                        url: `/search/users/${searchWord}/${notedJ + 1}`,
                        responseType: 'json'
                    })
                        .then(res => {
                            searchCard.innerHTML = ``;
                            if (res.data.status === "failure") {
                                let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${res.data.data.error}</h2>
                                        </div>
                                    </div>
                                `;
                                searchCard.innerHTML = html;
                            } else {
                                let { searches } = res.data.data;
                                let html = '';
                                searches.forEach(searchItem => {
                                    html += `
                                            <div class="col-lg-3 col-md-4 col-sm-6 col-9 mb-4 search-card">
                                                <div class="card">
                                                    <a href="/profiles/${searchItem.username}">
                                                        <img src="/images/black-background-image.jpg" class="px-4 pt-4 card-img-top" alt="...">
                                                        <div class="card-body p-4" style="min-height: 250px; max-height: 250px;">
                                                            <h5 class="card-title">${searchItem.username}</h5>
                                                            <p class="card-text text-secondary" style="height: 110px;">${searchItem.bio}
                                                            </p>
                                                            <div class="d-flex flex-row justify-content-start">
                                                                <button class="btn btn-outline-primary d-inline-block rounded mt-3"
                                                                    style="width: 80px;">Friend+
                                                                </button>
                                                                <button class="btn btn-outline-danger d-inline-block rounded mx-auto mt-3"
                                                                    style="width: 80px;">Block
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        `;
                                });
                                searchCard.innerHTML = html;
                                let start, end;
                                end = notedJ + 3;
                                if (end >= btns.length) {
                                    end = btns.length - 1;
                                    start = end - 8;
                                } else if (end < 8) {
                                    end = 8;
                                    start = 0;
                                } else {
                                    start = notedJ - 5;
                                }
                                for (k = 0; k < btns.length; k++) {
                                    let btn1 = btns.item(k);
                                    if (k >= start && k <= end) {
                                        btn1.classList.remove('d-none');
                                    } else {
                                        btn1.classList.add('d-none');
                                    }
                                }
                            }
                        })
                        .catch(err => {
                            let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${err.msg}</h2>
                                        </div>
                                    </div>
                                `;
                            searchCard.innerHTML = html;
                        });
                }
                break;
            }
        }
    })
})