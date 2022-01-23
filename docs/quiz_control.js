async function load_round_templates()
{
    // simple round ----------------------------------------------------
    // load simple templates
    const simple_templates = await load_json('./round_templates/simple_rounds.json');
    
    simple_rounds = []

    // convert simple_round_templates into round generator functions
    for (let i = simple_templates.length - 1; i >= 0; i--)
            simple_rounds.push(
                ()=>simple_round_loader(simple_templates[i])
            )

    console.log(simple_rounds)

    next_round.round_generators = simple_rounds
}

function simple_round_loader(round_template)
{
    let round = round_template



    shuffle_array(round.answers)

    return round;
}

function is_string(value) {
	return typeof value === 'string' || value instanceof String;
}

function load_round_into_dom(quiz_round)
{
    // question ---------------------------------------
    question_dom = document.getElementById("kerdes")

    // remove old question
    while (question_dom.firstChild) {
        question_dom.firstChild.remove()
    }

    // add new question
    if (is_string(quiz_round.question))
        {
            uj_szoveg_dom = document.createElement("p")
            uj_szoveg_dom.textContent = quiz_round.question
            question_dom.appendChild(uj_szoveg_dom)
        }

    if (Array.isArray(quiz_round.question))
        {
            quiz_round.question.forEach((question_row)=>{
                uj_szoveg_dom = document.createElement("p")
                uj_szoveg_dom.textContent = question_row
                question_dom.appendChild(uj_szoveg_dom)
            })

        }
    // update explanation -------------------------------

    
    explanation_dom = document.getElementById("explanation")
    
    // remove old question
    while (explanation_dom.firstChild) {
        explanation_dom.firstChild.remove()
    }

    if (is_string(quiz_round.explanation))
    {
        uj_szoveg_dom = document.createElement("p")
        uj_szoveg_dom.textContent = quiz_round.explanation
        explanation_dom.appendChild(uj_szoveg_dom)
    }

    if (Array.isArray(quiz_round.explanation))
        {
            quiz_round.explanation.forEach((explanation_row)=>{
                uj_szoveg_dom = document.createElement("p")
                uj_szoveg_dom.textContent = explanation_row
                explanation_dom.appendChild(uj_szoveg_dom)
            })

        }

    // answers -----------------------------------------

    answers_dom = document.getElementById("valasz-container")

    // remove answers
    while(answers_dom.firstChild)
        answers_dom.firstChild.remove()

    // add new answer
    quiz_round.answers.forEach(answer => {
        let uj_szoveg_dom = document.createElement("p")
        uj_szoveg_dom.classList.add("valasz")
        uj_szoveg_dom.textContent = answer.text
        uj_szoveg_dom.setAttribute("correct", answer.correct)
        uj_szoveg_dom.addEventListener("click", ()=>{answer_chosen(uj_szoveg_dom)})
        answers_dom.appendChild(uj_szoveg_dom)
    });
}

function answer_chosen(answer_dom)
{
    if (!answer_chosen.function_block)
    {
        document.getElementById("explanation").style.display = "block"

        answer_chosen.function_block = true;

        correct = answer_dom.getAttribute("correct")
        if (correct == 'true')
            answer_dom.classList.add("correct")
        else
            answer_dom.classList.add("incorrect")
    }
}

function next_round()
{
    console.log("next, please")

    answer_chosen.function_block = false
    document.getElementById("explanation").style.display = "none"

     
    let round_generator = random_element(next_round.round_generators)
    
    console.log(round_generator)
    load_round_into_dom(round_generator())
}


window.onload = async (ev)=>{
    await load_round_templates()
    next_round()

    document.getElementById("next-button").onclick = ()=>{next_round()}
}

function random_element(array)
{
    let random_index = ~~(Math.random() * array.length)

    return array[random_index]
}

async function load_json(url)
{
    response = await fetch(url)
    
    return response.json()
}

// others

function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}