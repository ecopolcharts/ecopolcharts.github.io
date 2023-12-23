maxQs = 13

COLORS={maroon:"#cd5d7d",red:"#fb8072",orange:"#fdb462",yellow:"#ffffb3",green:"#7bf1a8",mint:"#60d394",aqua:"#8dd3c7",blue:"#80b1d3",cyan:"#9bf6ff",purple:"#bdb2ff",royal:"#9381ff",pink:"#ffc6ff",black:"#000000",grey:"#888888",white:"#dddddd"}
ID2C = {"nota": "black", "idc": "grey", "com": "maroon", "soc": "red", "socdem": "pink", "cent": "white", "clas": "blue", "class": "blue", "ordo": "aqua", "cap": "yellow", "opt": "green", "marksoc": "orange", "prog": "cyan", "trad": "purple", "free": "yellow", "just": "pink", "justi": "pink", "perf": "orange", "sec": "blue", "secu": "blue", "athe": "red", "athei": "red", "athe*":"orange", "athei*":"orange", "theo": "purple", "theoc": "purple", "hybr": "cyan","dir":"mint","dir*":"cyan", "rep":"pink", "repub": "blue", "republ": "blue", "repub*":"purple","auth":"orange", "auth*":"royal","techno":"aqua", "anar":"red", "plut":"yellow", "strato":"green", "rep*":"maroon", "repr*":"maroon", "asim": "purple", "glob": "pink","glob*": "cyan", "pop": "mint", "sov": "blue", "iso": "orange", "nat": "maroon", "nat*": "royal","open": "aqua", "open*": "yellow","proced":"aqua","procedu":"aqua","decn":"yellow","lao":"blue","hum":"pink","hum*":"red","prot":"maroon","prote":"maroon","prot*"

//create boxes statically once so call stack doesn't grow infinitely every time you click something
function renderFormat() {
    quizAnswers = []

    for (var i = 0; i < maxQs; i++) {
        quizAnswers.push(createQuizAnswer().datum(i).on("click", d => {
            if (ANSWERS[d] === "prev") previous(d)
            else Answers[questionindex] = d

            d3.selectAll(".quiz__answer").classed("is-expanded", false)
            d3.select(quizAnswers[d].node().parentNode).classed("is-expanded", true)
        }))
    }
}

function renderQuestion(selected) {
    Selected = selected
    QUESTION = Qs[questionindex].key
    ANSWERS = []

    for (var i = 0; i < Qs[questionindex].order.length; i++) {
        ANSWERS.push(QUESTION + Qs[questionindex].order[i])
    }

    ANSWERS.push("o")
    ANSWERS.push("a")
    OMIT_N = 2

    if (questionindex > 0) {
        ANSWERS.push("prev")
        OMIT_N = 3
    }

    d3.select(".wikicharts__title").text((LANGUAGES[QUESTION] || ({ curlang: "ERROR" }))[curlang])

    d3.select(".wikicharts__footer-count-number--current").text(questionindex + 1)
    d3.select(".wikicharts__footer-count-number--all").text(Qs.length)
    d3.select(".wikicharts__footer-progress-bar").attr("max", Qs.length).attr("value", questionindex + 1)

    // SIZE = 1000
    // Q = []

    d3.selectAll(".quiz__answer .buttons-container").remove()

    d3.selectAll(".quiz__answer.is-visible")
        .classed("is-visible", false)
        .classed("is-expanded", false)
        .select(".quiz__answer-button")
        .classed("previous", false)
        .classed("not-agree", false)
        .classed("not-interested", false)

    for (var i = 0; i < ANSWERS.length; i++) {
        d3.select(quizAnswers[i].node().parentNode).classed("is-visible", true)
        quizAnswers[i].text((LANGUAGES[ANSWERS[i]] || ({ curlang: "ERROR" }))[curlang])

        let buttonsContainer = d3.select(quizAnswers[i].node().parentNode).append("div").classed("buttons-container", true)

        switch (ANSWERS[i]) {
            case "prev":
                quizAnswers[i].classed("previous", true)
                break
            case "a":
                quizAnswers[i].classed("not-interested", true)

                buttonsContainer.append("button").classed("buttons-container__button rightbox", true).text("Предпочтение определённо").on("click", d => {
                    (Selected < ANSWERS.length - OMIT_N) ? next(1.5) : next(1)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                })
                break
            case "o":
                quizAnswers[i].classed("not-agree", true)

                buttonsContainer.append("button").classed("buttons-container__button rightbox", true).text("Предпочтение определённо").on("click", d => {
                    (Selected < ANSWERS.length - OMIT_N) ? next(1.5) : next(1)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                })
                break
            default:
                buttonsContainer.append("button").classed("buttons-container__button leftbox", true).text("Предпочтение незначительно").on("click", (d) => {
                    next(1)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                })

                buttonsContainer.append("button").classed("buttons-container__button rightbox", true).text("Предпочтение определённо").on("click", d => {
                    (Selected < ANSWERS.length - OMIT_N) ? next(1.5) : next(1)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                })
        }
    }
}

function renderChart(box, result) {
    pct = 1000
    for (var i = result.length - 1; i >= 0; i--) {
        createSemicircle(box, pct).attr('fill', COLORS[ID2C[result[i][0]]])
        pct -= result[i][1]
    }
}

function renderInfoBox(box, result) {
    createBox(box).attr('fill', COLORS[ID2C[result[0]]])
    createLineText([box[0] + 10, box[1] + 10, box[2] - ResultPercentWidth + 8, ResultPercentHeight], (result[1] / 10) + "% " + LANGUAGES[result[0]][curlang]).attr('fill', result[0] == "nota" ? "white" : "black")
    createText([box[0] + 10, box[1] + 20 + ResultPercentHeight, box[2] - ResultPercentWidth + 8, box[3] - 30 - ResultPercentHeight], result[0] + "desc", 0, result[0] == "nota" ? "white" : "black")
}

function renderResult(box, result, label) {
    textg = svg
    renderChart([box[0], box[1] + ResultLabelheight, box[3] - ResultLabelheight, box[3] - ResultLabelheight], result)
    createLineText([box[0], box[1] - 10, box[3] - ResultLabelheight, ResultLabelheight], LANGUAGES[label][curlang]).attr("fill", 'white')
    var width = (box[2] - box[3] + ResultLabelheight) / 3
    for (var k = 0; k < result.length; k++)
        renderInfoBox([box[0] + box[3] + Boxpadding + k * width, box[1] + ResultLabelheight, width - Boxpadding, box[3] - ResultLabelheight], result[k])
}

function createPieChart(index, chartData) {
    let id;
    switch (index) {
        case 0: id = "economy"; break;
        case 1: id = "politics"; break;
        case 2: id = "society"; break;
        case 3: id = "religion"; break;
        case 4: id = "extpolitics"; break;
        case 5: id = "safety"; break;
        default: return;
    }

    let valuesListElement = document.querySelector(`.chartlist__item--${id} .chartlist__right`);
    
    console.log(chartData);

    let chartLabels = [],
        chartValues = [],
        chartColors = [];

    chartData.forEach(el => {
        chartLabels.push(LANGUAGES[el[0]][curlang]);
        chartValues.push(el[1] / 10);
        chartColors.push(COLORS[ID2C[el[0]]]);

        let valueElement = document.createElement("div");
        valueElement.classList.add("chartlist__value");
        valueElement.style.backgroundColor = COLORS[ID2C[el[0]]];

        let valueElement_title = document.createElement("h3");
        valueElement_title.classList.add("chartlist__value-title");

        let valueElement_percentage = document.createElement("div");
        valueElement_percentage.classList.add("chartlist__value-percentage");
        valueElement_percentage.innerHTML = (el[1] / 10).toLocaleString() + "<sup>%</sup>";

        valueElement_title.append(valueElement_percentage);

        let valueElement_label = document.createElement("span");
        valueElement_label.classList.add("chartlist__value-label");
        valueElement_label.innerText = LANGUAGES[el[0]][curlang];

        valueElement_title.append(valueElement_label);

        valueElement.append(valueElement_title);

        let valueElement_content = document.createElement("div");
        valueElement_content.classList.add("chartlist__value-content");
        valueElement_content.innerText = LANGUAGES[el[0] + "desc"][curlang];

        valueElement.append(valueElement_content);

        valuesListElement.append(valueElement);
    })

    new Chart(document.getElementById("results-chart-" + id), {
        type: "pie",
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartValues,
                backgroundColor: chartColors
            }]
        }
    });
}
