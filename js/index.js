const hamburger = document.querySelector(".menu-icon");

function toggleNav() {
  document.querySelector(".header-item.main-nav").classList.toggle("show");
}


// toggle navigation items with children
window.addEventListener("click", (e) => {
    document.querySelectorAll('.children').forEach(ele => {
        ele.classList.remove('show')
    })
    
    if(e.target.closest('.has-children')) {
        const navButton = e.target.closest('.has-children')
        navButton.querySelector('.children').classList.toggle('show')
    }
});



const URL = "https://api.github.com/graphql";
fetch(URL, {
  method: "POST",
  headers: {
    Authorization: "Bearer f8850285eb0a83df2a983ee609754e66a0e9778c",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `{
      viewer {
          login
          avatarUrl
          bio
          websiteUrl
          name
          location
          followers {
              totalCount
          }
          following {
              totalCount
          }
          repositories (first: 20) {
              totalCount
              nodes {
                  name
                  nameWithOwner
                  description
                  updatedAt
                  url
                  languages(orderBy:{field: SIZE, direction: DESC}, first: 1) {
                      nodes {
                          name
                          color
                      }
                  }
              }
          }
      }
  }`,
  }),
})
  .then((res) => res.json())
  .then((res) => {
    const {
      name,
      location,
      avatarUrl,
      bio,
      websiteUrl,
      followers,
      following,
      login,
      repositories,
    } = res.data.viewer;
    const userInfoContainer = document.querySelector(".user-info");

    //  Set the avatar(s) on the navigation bar
    document.querySelectorAll(".avi").forEach((avi) => {
      avi.setAttribute("src", avatarUrl);
    });

    userInfoContainer
      .querySelector(".image img")
      .setAttribute("src", avatarUrl);
    userInfoContainer.querySelector(".username").textContent = name;
    userInfoContainer.querySelector(".userhandle").textContent = login;
    userInfoContainer.querySelector(".userdesc").textContent = bio;
    userInfoContainer.querySelector(".following").textContent =
      following.totalCount;
    userInfoContainer.querySelector(".followers").textContent =
      followers.totalCount;
    userInfoContainer.querySelector(".location").textContent = location;
    userInfoContainer
      .querySelector(".websiteUrl")
      .setAttribute("href", "//" + websiteUrl);

    const allRepos = repositories.nodes
      .map((repo) => {
        return ` <div class="a-repo">
          <div class="repo__info">
            <a href="${repo.url}" target="_blank" class="link-title">${
          repo.name
        }</a>
            <p class="repo__desc">${repo.description || ""}</p>
            <p class="color-update"><span class="repo__color" style="background-color: ${
              repo.languages.nodes[0].color
            };"></span> ${
          repo.languages.nodes[0].name
        }  <span class="update">Updated on ${new Date(
          repo.updatedAt
        ).toLocaleString("default", {
          month: "long",
          day: "numeric",
        })}</span></p>
          </div>

          <a href="#" class="star btn"><i class="fas fa-star"></i> Star</a>
        </div>`;
      })
      .join("");

    document.querySelector(".repos .container").innerHTML =
      document.querySelector(".repos .container").innerHTML + allRepos;
  });
