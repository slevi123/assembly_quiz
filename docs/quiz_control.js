async function load_round_templates()
{
    // simple round ----------------------------------------------------
    // load simple templates
    const simple_templates = await load_json('./round_templates/simple_rounds.json');
    
    let generators = []

    // convert simple_round_templates into round generator functions
    for (let i = simple_templates.length - 1; i >= 0; i--)
            generators.push(
                ()=>simple_round_loader(simple_templates[i])
            )

    generators.push(idiv_round_generator )
    console.log(generators)

    next_round.round_generators = generators
}

function simple_round_loader(round_template)
{
    let round = round_template



    shuffle_array(round.answers)

    return round;
}

function idiv_round_generator()
{
    round = 
    {
        question: [],
        answers: ["a","b","c"],
        explanation: "vau"
    }

    operand = random_element(["b", "c"])
    
    nullazo = random_element([
        (operand_name)=>`xor ${operand_name}, ${operand_name}`,
        (operand_name)=>`mov ${operand_name}, 0`,
    ])

    osztando = ~~(Math.random() * 256)
    oszto = ~~(Math.random() * 11)

    negativ_eredmeny = ~~(Math.random() * 2) // 0 or 1

    let operand_size = Math.pow(2, ~~(Math.random() * 3 + 3))    // 8 or 16 or 32

    if (operand_size == 8)
        {
            round.question.push(`Mi lesz az al értéke a következő kódrészlet végrehajtása után?`)
            round.question.push(nullazo(`${operand}h`))
            round.question.push(`mov ah, ${osztando}`)
            round.question.push(`mov ${operand}h, ${oszto}`)
            round.question.push(`div ${operand}h`)

            // valaszok.push({ text: `117`, correct: true})
            // valaszok.push({ text: `${oszta}`, correct: true})

        }
        else if (operand_size == 16)
        {
            round.question.push(`Mi lesz az ax értéke a következő kódrészlet végrehajtása után?`)
            round.question.push(nullazo(`dx`))
            round.question.push(`mov ax, ${osztando}`)
            round.question.push(`mov ${operand}x, ${oszto}`)
            round.question.push(`div ${operand}x`)
        }
        else
        {
            round.question.push(`Mi lesz az eax értéke a következő kódrészlet végrehajtása után?`)
            round.question.push(nullazo(`edx`))
            round.question.push(`mov eax, ${osztando}`)
            round.question.push(`mov e${operand}x, ${oszto}`)
            round.question.push(`div e${operand}x`)
        }

    return round
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
                uj_szoveg_dom = document.createElement("pre")
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
        uj_szoveg_dom = document.createElement("pre")
        uj_szoveg_dom.textContent = quiz_round.explanation
        explanation_dom.appendChild(uj_szoveg_dom)
    }

    if (Array.isArray(quiz_round.explanation))
        {
            quiz_round.explanation.forEach((explanation_row)=>{
                uj_szoveg_dom = document.createElement("pre")
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
        uj_szoveg_dom.innerText = answer.text
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

    document.getElementsByTagName('body')[0].focus()
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

    // adding enter key
    document.addEventListener("keyup", event => {
        console.log("fired")
        if (event.key === 'Enter') {
            document.getElementById("next-button").onclick = ()=>{next_round()}
        }
    });

    //
    document.getElementsByTagName('body')[0].focus()
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