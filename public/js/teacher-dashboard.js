window.addEventListener("DOMContentLoaded", (e) => {
  let btns = document.getElementsByClassName("page-nav");
  let forwardBtn = document.getElementById("page-nav-forward");
  let backwardBtn = document.getElementById("page-nav-backward");
  let searchCard = document.getElementById("search-cards");
  console.log(searchCard);
  for (i = 0; i < btns.length; i++) {
    let button = btns.item(i);
    button.addEventListener("click", (e) => {
      document.body.style.cursor = "wait";
      if (button.classList.contains("active")) {
        return;
      } else {
        let flag1 = true;
        let flag2 = true;
        let notedJ;
        for (j = 0; j < btns.length; j++) {
          let btn = btns.item(j);
          if (btn.classList.contains("active") && flag1) {
            btn.classList.remove("active");
            if (j === 0) {
              backwardBtn.classList.remove("disabled");
            }
            if (j === btns.length - 1) {
              forwardBtn.classList.remove("disabled");
            }
            flag1 = false;
          }
          if (button === btn && flag2) {
            notedJ = j;
            btn.classList.add("active");
            if (notedJ === 0) {
              backwardBtn.classList.add("disabled");
            }
            if (notedJ === btns.length - 1) {
              forwardBtn.classList.add("disabled");
            }
            let searchWord = document.getElementById("search-word").textContent;
            console.log(`My Search word : ${searchWord}`);
            axios({
              method: "get",
              url: `/profiles/dashboard/views?searchWord=${searchWord}&page=${
                notedJ + 1
              }`,
              responseType: "json",
            })
              .then((res) => {
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
                  if (res.data.data.courses) {
                    let searches = res.data.data.courses;
                    let html = "";
                    searches.forEach((course) => {
                      console.log(course, "-----");
                      html += `
                      <div class="row w-100" style="border-bottom: 2px solid grey;">
                      <div
                      class="col-12 d-flex flex-xl-row flex-lg-row flex-column justify-content-center align-items-center">
                      <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 pl-auto course-card">
                          <div class="card-item card-preview tooltipstered">
                              <div class="preview-course-video">
                                  <a href="/courses/view/${course._id}">
                                      <div class="mx-auto" style="width: 170px; height: 170px;">
                                      //     <img src="${
                                        course.picture
                                          ? course.picture
                                          : "picture"
                                      }"
                                               style="width: 100%; height: 100%;" alt="course-img">
                                      </div>
                                      <div class="mx-auto" style="width: 170px;">
                                          <h5 class="card-text text-center mt-2"
                                              style="height: 3.2rem; -webkit-line-clamp: 2 !important;">
                                              ${course.title}
                                              </h5>
                                          </div>
                                      </a>
                                  </div><!-- end card-content -->
                              </div>
                          </div>
                              <div class="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12 pr-auto course-card d-flex flex-column align-items-center  justify-content-center">
                                  <p class="h5">All time views --> ${
                                    course.views
                                  }</p>
                                  <div class="row">
                                      <div class="col d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-row flex-column">
                                          <p class="h5">Last 30 days views :&nbsp;</p>
                                          <p class="h5"> (from  ${
                                            course.time
                                          }) --> ${course.thirtyViews.views}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
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
                        btn1.classList.remove("d-none");
                      } else {
                        btn1.classList.add("d-none");
                      }
                    }
                  }
                }
                document.body.style.cursor = "context-menu";
              })
              .catch((err) => {
                let html = `
                                    <div class="row">
                                        <div class="col">
                                            <h2 class="my-4 border-bottom text-secondary">${err.msg}</h2>
                                        </div>
                                    </div>
                                `;
                searchCard.innerHTML = html;
              });
            flag2 = false;
          }
          if (!flag1 && !flag2) return;
        }
      }
    });
  }

  forwardBtn.addEventListener("click", (e) => {
    for (i = 0; i < btns.length; i++) {
      let btn = btns.item(i);
      if (btn.classList.contains("active")) {
        if (i < btns.length - 1) {
          btn.classList.remove("active");
          btns.item(i + 1).classList.add("active");
          if (i === 0) {
            backwardBtn.classList.remove("disabled");
          }
          if (i === btns.length - 2) {
            forwardBtn.classList.add("disabled");
          }
          let notedJ = i + 1;
          let searchWord = document.getElementById("search-word").textContent;
          console.log(`My Search word : ${searchWord}`);
          axios({
            method: "get",
            url: `/profiles/dashboard/views?searchWord=${searchWord}&page=${
              notedJ + 1
            }`,
            responseType: "json",
          })
            .then((res) => {
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
                if (res.data.data.courses) {
                  let searches = res.data.data.courses;
                  let html = "";
                  searches.forEach((course) => {
                    html += `
                    <div class="row w-100" style="border-bottom: 2px solid grey;">
                        <div
                        class="col-12 d-flex flex-xl-row flex-lg-row flex-column justify-content-center align-items-center">
                        <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 pl-auto course-card">
                            <div class="card-item card-preview tooltipstered">
                                <div class="preview-course-video">
                                    <a href="/courses/view/${course._id}">
                                        // <div class="mx-auto" style="width: 170px; height: 170px;">
                                        //     <img src="${
                                          course.picture
                                            ? course.picture
                                            : "picture"
                                        }"
                                        //         style="width: 100%; height: 100%;" alt="course-img">
                                        // </div>
                                        <div class="mx-auto" style="width: 170px;">
                                            <h5 class="card-text text-center mt-2"
                                                style="height: 3.2rem; -webkit-line-clamp: 2 !important;">
                                                ${course.title}
                                                </h5>
                                            </div>
                                        </a>
                                    </div><!-- end card-content -->
                                </div>
                            </div>
                                <div class="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12 pr-auto course-card d-flex flex-column align-items-center  justify-content-center">
                                    <p class="h5">All time views --> ${
                                      course.views
                                    }</p>
                                    <div class="row">
                                        <div class="col d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-row flex-column">
                                            <p class="h5">Last 30 days views :&nbsp;</p>
                                            <p class="h5"> (from  ${
                                              course.time
                                            }) --> ${
                      course.thirtyViews.views
                    }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                      btn1.classList.remove("d-none");
                    } else {
                      btn1.classList.add("d-none");
                    }
                  }
                }
                // console.log(`Start : ${start}\nEnd : ${end}\nvalue of notedJ : ${notedJ}`);
              }
            })
            .catch((err) => {
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
  });
  backwardBtn.addEventListener("click", (e) => {
    for (i = 0; i < btns.length; i++) {
      let btn = btns.item(i);
      if (btn.classList.contains("active")) {
        if (i > 0) {
          btn.classList.remove("active");
          btns.item(i - 1).classList.add("active");
          if (i === btns.length - 1) {
            forwardBtn.classList.remove("disabled");
          }
          if (i === 1) {
            backwardBtn.classList.add("disabled");
          }
          let notedJ = i - 1;
          let searchWord = document.getElementById("search-word").textContent;
          console.log(`My Search word : ${searchWord}`);
          axios({
            method: "get",
            url: `/profiles/dashboard/views?searchWord=${searchWord}&page=${
              notedJ + 1
            }`,
            responseType: "json",
          })
            .then((res) => {
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
                if (res.data.data.courses) {
                  let searches = res.data.data.courses;
                  let html = "";
                  searches.forEach((course) => {
                    html += `
                    <div class="row w-100" style="border-bottom: 2px solid grey;">
                    <div
                    class="col-12 d-flex flex-xl-row flex-lg-row flex-column justify-content-center align-items-center">
                    <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 pl-auto course-card">
                        <div class="card-item card-preview tooltipstered">
                            <div class="preview-course-video">
                                <a href="/courses/view/${course._id}">
                                    // <div class="mx-auto" style="width: 170px; height: 170px;">
                                    //     <img src="${
                                      course.picture
                                        ? course.picture
                                        : "picture"
                                    }"
                                    //         style="width: 100%; height: 100%;" alt="course-img">
                                    // </div>
                                    <div class="mx-auto" style="width: 170px;">
                                        <h5 class="card-text text-center mt-2"
                                            style="height: 3.2rem; -webkit-line-clamp: 2 !important;">
                                            ${course.title}
                                            </h5>
                                        </div>
                                    </a>
                                </div><!-- end card-content -->
                            </div>
                        </div>
                            <div class="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12 pr-auto course-card d-flex flex-column align-items-center  justify-content-center">
                                <p class="h5">All time views --> ${
                                  course.views
                                }</p>
                                <div class="row">
                                    <div class="col d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-row flex-column">
                                        <p class="h5">Last 30 days views :&nbsp;</p>
                                        <p class="h5"> (from  ${
                                          course.time
                                        }) --> ${course.thirtyViews.views}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                      btn1.classList.remove("d-none");
                    } else {
                      btn1.classList.add("d-none");
                    }
                  }
                }

                // console.log(`Start : ${start}\nEnd : ${end}\nvalue of notedJ : ${notedJ}`);
              }
            })
            .catch((err) => {
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
        console.log(i);
        break;
      }
    }
  });
});

function addNewStyle(newStyle) {
  var styleElement = document.getElementById("styles_js");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.id = "styles_js";
    document.getElementsByTagName("head")[0].appendChild(styleElement);
  }
  styleElement.appendChild(document.createTextNode(newStyle));
}
