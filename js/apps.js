//load data 
const loadData = async () =>{
    toggleLoader(true)
    const url =`https://openapi.programming-hero.com/api/ai/tools`
     const res= await fetch(url);
     const data = await res.json();
     toggleLoader(false)
     displayCards(data.data, 6);
     //get sort-by-date and add addEventListener 
     const sortButton = document.getElementById('sort-by-date');
     sortButton.addEventListener('click', () => sortCardsByDate(data.data.tools));
}
const displayCards = (cards, visibleCardCount) => {
    const cardsContainer = document.getElementById('card-container');
    cardsContainer.innerHTML = '';
  
    cards.tools.slice(0, visibleCardCount).forEach(card =>  {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('col');
      cardDiv.innerHTML = `
        <div class="card h-100">
          <img src="${card.image}" class="card-img-top" alt="..." />
          <div class="card-body">
            <h4 class="card-title">Features</h4>
            <ol>
              ${card.features.map(feature => `<li>${feature}</li>`).join('')}
            </ol>
          </div>
          <div class="card-footer d-sm-flex flex-sm-col-reverse justify-content-sm-evenly d-lg-flex justify-content-lg-between align-items-lg-center">
            <div>
              <h4 class="card-title">${card.name}</h4>
              <i class="fa-solid fa-calendar-days"></i>
              <small class="text-muted fs-4">${card.published_in}</small>
            </div>
            <div>
              <i class="fa-solid fa-arrow-right bg-danger p-sm-4 p-lg-3 rounded-5 bg-opacity-50 text-dark" data-toggle="modal" onclick="cardId('${card.id}')" data-target="#myModal"></i>
            </div>
          </div>
        </div>
      `;
      cardsContainer.appendChild(cardDiv);
    });
    
    if (visibleCardCount < cards.tools.length) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show More';
      showMoreButton.classList.add('btn', 'btn-primary', 'mx-auto', 'my-4');
      showMoreButton.addEventListener('click', () => {
        displayCards(cards, cards.tools.length);
      });
      cardsContainer.appendChild(showMoreButton);
    }
  };
//sort by date function goes here
const sortCardsByDate = cards => {
    // start loader here 
    toggleLoader(true);
    const cardsContainer = document.getElementById('card-container');
    cards.sort((a, b) => {
      const dateA = new Date(a.published_in);
      const dateB = new Date(b.published_in);
      return dateA - dateB;
    });
    while (cardsContainer.firstChild) {
      cardsContainer.removeChild(cardsContainer.firstChild);
    }
    displayCards({ tools: cards });
    //stop loader
    toggleLoader(false);

}

    //loader function goes here 
  const toggleLoader = isLoading =>{
    const SpinnerLoaderDiv=document.getElementById('loader');
    if(isLoading){
        SpinnerLoaderDiv.classList.remove('d-none');
    }
    else{
        SpinnerLoaderDiv.classList.add('d-none')
    }
}

const cardId = async (id) =>{
    //start loader
    toggleLoader(true);
    const URL =`https://openapi.programming-hero.com/api/ai/tool/${id}`
    const res= await fetch(URL);
    const data = await res.json();
    showModalDetails(data.data);
    //stop loader
    toggleLoader(false);
}

const showModalDetails = (detail) =>{
//  console.log(detail);
const ModalDiv =document.getElementById('modal-body');
    ModalDiv.innerHTML = `
        <div class="row  px-3 gap-0 ">
        <div class="col-md-6 bg-success-subtle p-5 rounded-2">
            <h4>${detail?.description
            ? detail.description
            : "Not Found"
            }</h4>
            <div class="row ps-2">
                    <div class="col-md-4 my-4 ">
                    <div class="box mx-3 py-4 text-center mx-auto fw-bold px-3 bg-body-secondary fs-4 rounded-3 ">
                    ${
                        detail?.pricing[1]
                        ? detail.pricing[1].price
                        : "Free of cost"
                        }
                    </div>
                    </div>
                        <div class="col-md-4 my-4">
                        <div class="box mx-3 py-4 text-center mx-auto fw-bold px-3 bg-body-secondary fs-4 rounded-3 ">
                        ${
                            detail?.pricing[1]
                            ? detail.pricing[1].price
                            : "Free of cost"
                            }
                        </div>
                </div>
    <div class="col-md-4 my-4">
      <div class="box mx-3 text-center mx-auto fw-bold py-3 bg-body-secondary fs-4 rounded-3 ">
      ${
        detail?.pricing[2]
          ? detail.pricing[2].price
          : "Free of cost"
        }
      </div>
    </div>
  </div>
        <div class="row">
            <div class="col-md-6 ">
                        <h4>Features</h4>
                    <ol>
                        <li>
                        ${
                            detail.features["1"]
                            ? detail.features["1"].feature_name
                            : "Data not found"
                        }
                        </li>
                        <li>
                        ${
                            detail.features["2"]
                            ? detail.features["2"].feature_name
                            : "Data not found"
                        }
                        </li>
                        <li>
                        ${
                            detail.features["3"]
                            ? detail.features["3"].feature_name
                            : "Data not found"
                        }
                        </li>
                    </ol>
                    </div>
                    <div class="col-md-6">
                    <h4>Integrations</h4>
                    <ol>
                        <li>
                        ${
                            detail?.integrations[0]
                            ? detail.integrations[0]
                            : "Data not found"
                            }
                        </li>
                        <li>
                        ${
                            detail?.integrations[1]
                            ? detail.integrations[1]
                            : "Data not found"
                        }
                        </li>
                        <li>
                        ${
                            detail?.integrations[2]
                            ? detail.integrations[2]
                            : "Data not found"
                        }
                        </li>
                    </ol>
                    </div>
           </div>
       </div>
             <div class="col-md-6 rounded-2 bg-body-secondary ">
                    <img src="${detail?.image_link[0]}" alt="Image" class="img-responsive p-3 "><h6 style="position: absolute; top: 0; right: 0; id="none" class="bg-danger me-2 accuracy-text text-white p-3 rounded-2 mb-5">${
                        detail?.accuracy?.score
                        ? Math.round(detail.accuracy.score * 100)
                        : "No "
                    } accuracy</h6>
                    <h3 class="card-title text-center my-3">
                    ${
                        detail?.input_output_examples[0]?.input
                    }
                    </h3>
                    <p>
                    ${
                        detail?.input_output_examples[0]
                        ? detail.input_output_examples[0].output
                        : "No! Not yet! Take a break!!!"
                    }
                    </p>
                </div>
    </div>
  `;
};  
loadData();