document.addEventListener("DOMContentLoaded",function(){



  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle =document.querySelector(".easy-progress");
  const mediumProgressCircle =document.querySelector(".medium-progress");
  const hardProgressCircle =document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");
  

  



  // return true or false based regex
  function validateUsername(username){
       if(username.trim()===""){
          alert("username should not be empty");
          return false;
       }
       const regex = /^[a-zA-Z0-9_-]{1,15}$/;
       const isMatching = regex.test(username);
       if(!isMatching){
          alert("invalid username");
       }
       return isMatching;
  
  }
  
  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      statsContainer.classList.add("hidden");

      // const response = await fetch(url);
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";

      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "    query userSessionProgress($username: String!) {  allQuestionsCount {    difficulty    count  }  matchedUser(username: $username) {    submitStats {      acSubmissionNum {        difficulty        count        submissions      }      totalSubmissionNum {        difficulty        count        submissions      }    }  }}    ",
        variables: { username: `${username}` },
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
      };

      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        console.log(response);
        throw new Error("Unable to fetch the User details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      statsContainer.classList.remove("hidden");
    }
  }


  function updateProgress(solved, total, label, circle){
  const progressDegree  = (solved/total)*100;
  circle.style.setProperty("--progress-degree", `${progressDegree}%`);
  label.textContent = `${solved}/${total}`;
  }
  
  
  
   function displayUserData(parsedData){
  
      const totalQues = parsedData.data.allQuestionsCount[0].count;
  
      const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
      const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
      const totalHardQues = parsedData.data.allQuestionsCount[3].count;
  
      const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
      const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
      const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
      const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
  
  
      updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
      updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
      updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);
  
      const cardsData = [
        {label: "overall Submissions", value:  parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
        {label: "overall Easy Submissions", value:  parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
        {label: "overall Medium Submissions", value:  parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
        {label: "overall Hard Submissions", value:  parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}
      ];

      console.log("card data:", cardsData);

      cardStatsContainer.innerHTML = cardsData.map(
         data => 
           `
            <div class = "card">
              <h4> ${data.label}</h3>
              <p>${data.value}</p>
            </div>  
          `
         
      ).join("");
  
  }
  
  
  
  searchButton.addEventListener("click",function(){
  const username = usernameInput.value;
  console.log("username is:", username);
  if(validateUsername(username)){
      fetchUserDetails(username);
  }
  
  
  })
  
  
  })