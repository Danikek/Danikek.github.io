
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. IGUDZIU DUOMENYS
    // ==========================================

    
const skills = [
    {
        name: "Elektros tinklų projektavimas",
        description: "Elektros tinklų schemų ir projektų rengimas.",
        status: "Planuojama",
        xp: 40
    },
    {
        name: "Energetikos sistemų automatizavimas",
        description: "Automatizuotų valdymo sistemų pažinimas.",
        status: "Planuojama",
        xp: 40
    },
    {
        name: "MATLAB",
        description: "Duomenų analizė, skaičiavimai ir grafikų braižymas.",
        status: "Mokomasi",
        xp: 40
    },
    {
        name: "AutoCAD",
        description: "Techninių ir elektros brėžinių braižymas.",
        status: "Mokomasi",
        xp: 40
    },
    {
        name: "Elektros energetikos sistemos",
        description: "Elektros energijos gamybos ir paskirstymo analizė.",
        status: "Mokomasi",
        xp: 40
    },
    {
        name: "HTML ir CSS",
        description: "Internetinių svetainių struktūros ir dizaino kūrimas.",
        status: "Atlikta",
        xp: 70
    },
    {
        name: "Excel",
        description: "Duomenų analizė ir diagramų sudarymas.",
        status: "Atlikta",
        xp: 60
    },
    {
        name: "Komandinis darbas",
        description: "Renginių organizavimas ir komandos koordinavimas.",
        status: "Atlikta",
        xp: 70
    },
    {
        name: "Python",
        description: "Programavimo pagrindai ir praktinis taikymas.",
        status: "Planuojama",
        xp: 30
    },
    {
        name: "KiCAD",
        description: "Elektroninių schemų ir spausdintinių plokščių projektavimas.",
        status: "Planuojama",
        xp: 40
    }
];


    // ==========================================
    // 2. LOCAL STORAGE - BUSENU IKELIMAS
    // ==========================================

    function loadSkillsFromStorage() {

        try {
            const savedSkills = localStorage.getItem("savedSkills");

            // Jeigu duomenu nera, paliekamos pradines busenos
            if (!savedSkills) {
                return;
            }

            const parsedSkills = JSON.parse(savedSkills);

            if (!Array.isArray(parsedSkills)) {
                return;
            }

            skills.forEach(function (skill) {

                const savedSkill = parsedSkills.find(function (item) {
                    return item.name === skill.name;
                });

                if (
                    savedSkill &&
                    ["Planuojama", "Mokomasi", "Atlikta"].includes(savedSkill.status)
                ) {
                    skill.status = savedSkill.status;
                }
            });

        } catch (error) {
            console.error("Nepavyko įkelti įgūdžių duomenų:", error);
        }
    }


    // ==========================================
    // 3. LOCAL STORAGE - BUSENU ISSAUGOJIMAS
    // ==========================================

    function saveSkillsToStorage() {

        try {
            localStorage.setItem(
                "savedSkills",
                JSON.stringify(skills)
            );

        } catch (error) {
            console.error("Nepavyko išsaugoti įgūdžių duomenų:", error);
        }
    }


    const statusSettings = {
        "Planuojama": {
            container: "planned-skills",
            className: "planned"
        },
        "Mokomasi": {
            container: "learning-skills",
            className: "learning"
        },
        "Atlikta": {
            container: "completed-skills",
            className: "completed"
        }
    };


    // ==========================================
    // 4. IGUDZIU KORTELIU ATVAIZDAVIMAS
    // ==========================================

    function createSkillCard(skill, index, editable) {

        const card = document.createElement("div");
        card.className = "col-lg-6 col-md-12 mb-3";

        const innerCard = document.createElement("div");
        innerCard.className = "skill-card";

        const title = document.createElement("h4");
        title.textContent = skill.name;

        const description = document.createElement("p");
        description.textContent = skill.description;

        const bottom = document.createElement("div");
        bottom.className = "skill-card-bottom";

        const status = document.createElement("span");
        status.className =
            "status " + statusSettings[skill.status].className;
        status.textContent = skill.status;

        const xp = document.createElement("span");
        xp.className = "xp";
        xp.textContent = skill.xp + " XP";

        bottom.appendChild(status);
        bottom.appendChild(xp);

        innerCard.appendChild(title);
        innerCard.appendChild(description);
        innerCard.appendChild(bottom);

        // Igudzio busenos keitimas
        if (editable) {

            const select = document.createElement("select");
            select.className = "form-select mt-3";

            ["Planuojama", "Mokomasi", "Atlikta"].forEach(function (optionText) {

                const option = document.createElement("option");
                option.value = optionText;
                option.textContent = optionText;

                if (skill.status === optionText) {
                    option.selected = true;
                }

                select.appendChild(option);
            });

            select.addEventListener("change", function () {

                // Pakeiciama igudzio busena
                skills[index].status = select.value;

                // Isaugoma pakeista busena
                saveSkillsToStorage();

                // Atnaujinamos visos skiltys
                renderEverything();
            });

            innerCard.appendChild(select);
        }

        card.appendChild(innerCard);

        return card;
    }


    // ==========================================
    // 5. IGUDZIU SKILCIU ATNAUJINIMAS
    // ==========================================

    function renderSkills() {

        Object.values(statusSettings).forEach(function (setting) {

            const container = document.getElementById(setting.container);

            if (container) {
                container.innerHTML = "";
            }
        });

        skills.forEach(function (skill, index) {

            const setting = statusSettings[skill.status];
            const container = document.getElementById(setting.container);

            if (container) {
                container.appendChild(
                    createSkillCard(skill, index, true)
                );
            }
        });
    }


    // ==========================================
    // 6. PROFESINIO TOBULEJIMO KANBAN
    // ==========================================

    function renderKanban() {

        const columns = {
            "Planuojama": document.querySelector("#modules .planned-column"),
            "Mokomasi": document.querySelector("#modules .learning-column"),
            "Atlikta": document.querySelector("#modules .completed-column")
        };

        Object.values(columns).forEach(function (column) {

            if (column) {
                column.querySelectorAll(".skill-card").forEach(function (card) {
                    card.remove();
                });
            }
        });

        skills.forEach(function (skill, index) {

            const column = columns[skill.status];

            if (column) {
                column.appendChild(
                    createSkillCard(skill, index, false)
                );
            }
        });
    }


    // ==========================================
    // 7. XP, LYGIS IR RANGAS
    // ==========================================

    function calculateProgress() {

        // Suskaiciuojami atlikti ir mokomi igudziai
        const completedSkills = skills.filter(function (skill) {
            return skill.status === "Atlikta";
        });

        const learningSkills = skills.filter(function (skill) {
            return skill.status === "Mokomasi";
        });

        // XP skaiciuojami tik uz atliktus igudzius
        const totalXP = completedSkills.reduce(function (sum, skill) {
            return sum + skill.xp;
        }, 0);

        let level;
        let rank;
        let progress;

        // 1 lygis: 0-49 XP
        if (totalXP < 50) {
            level = 1;
            rank = "Pradedantysis";
            progress = (totalXP / 50) * 100;

        // 2 lygis: 50-149 XP
        } else if (totalXP < 150) {
            level = 2;
            rank = "Praktikantas";
            progress = ((totalXP - 50) / 100) * 100;

        // 3 lygis: 150-299 XP
        } else if (totalXP < 300) {
            level = 3;
            rank = "Specialistas";
            progress = ((totalXP - 150) / 150) * 100;

        // 4 lygis: 300 ir daugiau XP
        } else {
            level = 4;
            rank = "Profesionalas";
            progress = 100;
        }

        return {
            totalXP: totalXP,
            level: level,
            rank: rank,
            progress: Math.min(100, Math.round(progress)),
            completed: completedSkills.length,
            learning: learningSkills.length,
            total: skills.length,
            completedPercentage: Math.round(
                (completedSkills.length / skills.length) * 100
            )
        };
    }


    // ==========================================
    // 8. STATISTIKOS ATNAUJINIMAS
    // ==========================================

    function updateStatistics() {

        const data = calculateProgress();

        // XP, lygis ir rangas
        const xpElement = document.querySelector("#modules .xp-box h3");
        const levelElement = document.querySelector("#modules .level-box h3");
        const rankElement = document.querySelector("#modules .rank-box h3");

        if (xpElement) {
            xpElement.textContent = data.totalXP + " XP";
        }

        if (levelElement) {
            levelElement.textContent = data.level + " lygis";
        }

        if (rankElement) {
            rankElement.textContent = data.rank;
        }

        // Progreso juostos atnaujinimas
        const progressSection = document.querySelector("#modules .total-progress");

        if (progressSection) {

            const progressTexts = progressSection.querySelectorAll(".d-flex strong");

            if (progressTexts.length > 1) {
                progressTexts[1].textContent = data.progress + "%";
            }

            const progressBar = progressSection.querySelector(".progress-fill");

            if (progressBar) {
                progressBar.style.width = data.progress + "%";
            }

            const track = progressSection.querySelector(".progress-track");

            if (track) {
                track.setAttribute("aria-valuenow", data.progress);
            }

            const labels = progressSection.querySelectorAll(".progress-labels span");

            if (labels.length > 1) {

                labels[0].textContent =
                    "Pasiekta: " + data.totalXP + " XP";

                if (data.level === 4) {
                    labels[1].textContent =
                        "Pasiektas aukščiausias lygis";
                } else {
                    labels[1].textContent =
                        "Iki kito lygio: " +
                        (getNextLevelXP(data.level) - data.totalXP) + " XP";
                }
            }
        }

        // Bendra statistika
        const summaryStats = document.querySelectorAll(
            "#modules .summary-stats span"
        );

        if (summaryStats.length >= 3) {

            summaryStats[0].innerHTML =
                '<i class="bi bi-code-slash"></i> Įgūdžiai: ' + data.total;

            summaryStats[1].innerHTML =
                '<i class="bi bi-check-circle"></i> Atlikta: ' + data.completed;

            summaryStats[2].innerHTML =
                '<i class="bi bi-clock"></i> Mokomasi: ' + data.learning;
        }

        // Igudziu pazangos statistikos korteles
        const totalStat = document.querySelector(
            "#modules .total-stat h4"
        );

        const completedStat = document.querySelector(
            "#modules .completed-stat h4"
        );

        const percentageStat = document.querySelector(
            "#modules .percentage-stat h4"
        );

        if (totalStat) {
            totalStat.textContent = data.total;
        }

        if (completedStat) {
            completedStat.textContent = data.completed;
        }

        if (percentageStat) {
            percentageStat.textContent =
                data.completedPercentage + "%";
        }

        // XP rodymas igudziu skiltyje
        const totalXPElement = document.getElementById("total-xp");

        if (totalXPElement) {
            totalXPElement.textContent =
                "Surinkta patirties taškų: " + data.totalXP + " XP";
        }
    }


    // ==========================================
    // 9. KITO LYGIO XP RIBA
    // ==========================================

    function getNextLevelXP(level) {

        const levels = {
            1: 50,
            2: 150,
            3: 300
        };

        return levels[level];
    }


    // ==========================================
    // 10. VISU SKILCIU ATNAUJINIMAS
    // ==========================================

    function renderEverything() {

        renderSkills();
        renderKanban();
        updateStatistics();
    }


    // Pirmiausia atkuriamos issaugotos busenos
    loadSkillsFromStorage();

    // Pradinis atvaizdavimas pagal atkurtas busenas
    renderEverything();


    // ==========================================
    // 11. TELEFONO NUMERIO FORMATAVIMAS
    // ==========================================

    const phoneInput = document.getElementById("phone");

    if (phoneInput) {

        phoneInput.addEventListener("input", function () {

            let digits = phoneInput.value.replace(/\D/g, "");

            if (digits.startsWith("370")) {
                digits = digits.substring(3);
            } else if (digits.startsWith("8")) {
                digits = digits.substring(1);
            }

            digits = digits.substring(0, 8);

            let formatted = "+370";

            if (digits.length > 0) {
                formatted += " " + digits.substring(0, 3);
            }

            if (digits.length > 3) {
                formatted += " " + digits.substring(3, 8);
            }

            phoneInput.value = formatted;
        });
    }


    // ==========================================
    // 12. VERTINIMO SLANKIKLIAI
    // ==========================================

    const ratingSliders = document.querySelectorAll(".rating-slider");

    ratingSliders.forEach(function (slider) {

        const outputId = slider.dataset.output;
        const output = document.getElementById(outputId);

        if (output) {
            slider.addEventListener("input", function () {
                output.textContent = slider.value;
            });
        }
    });


    // ==========================================
    // 13. KONTAKTU FORMOS VALIDACIJA
    // ==========================================

    const contactForm = document.getElementById("contactForm");
    const formResult = document.getElementById("formResult");
    const clearButton = document.getElementById("clearForm");

    function showError(input, message) {

        removeError(input);

        const error = document.createElement("small");
        error.className = "validation-error text-danger d-block mt-1";
        error.textContent = message;

        input.insertAdjacentElement("afterend", error);
    }


    function removeError(input) {

        const nextElement = input.nextElementSibling;

        if (
            nextElement &&
            nextElement.classList.contains("validation-error")
        ) {
            nextElement.remove();
        }
    }


    function validateField(input) {

        const value = input.value.trim();

        removeError(input);

        if (value === "") {
            showError(input, "Šis laukelis yra privalomas.");
            return false;
        }

        if (input.name === "firstName" || input.name === "lastName") {

            if (value.length < 2) {
                showError(input, "Įveskite bent 2 simbolius.");
                return false;
            }
        }

        if (input.name === "email") {

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(value)) {
                showError(input, "Įveskite galiojantį el. pašto adresą.");
                return false;
            }
        }

        if (input.name === "phone") {

            const digits = value.replace(/\D/g, "");

            if (!/^3706\d{7}$/.test(digits)) {
                showError(
                    input,
                    "Įveskite galiojantį numerį, pvz. +370 612 34567."
                );
                return false;
            }
        }

        if (input.name === "address" && value.length < 4) {
            showError(input, "Įveskite išsamesnį adresą.");
            return false;
        }

        return true;
    }


    if (contactForm) {

        const formInputs = contactForm.querySelectorAll(
            "input:not([type='range'])"
        );

        formInputs.forEach(function (input) {

            input.addEventListener("blur", function () {
                validateField(input);
            });

            input.addEventListener("input", function () {
                removeError(input);
            });
        });


        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            let formIsValid = true;

            formInputs.forEach(function (input) {

                if (!validateField(input)) {
                    formIsValid = false;
                }
            });

            if (!formIsValid) {

                const firstError = contactForm.querySelector(
                    ".validation-error"
                );

                if (firstError) {
                    firstError.previousElementSibling.focus();
                }

                return;
            }

            const formData = new FormData(contactForm);

            const firstName = formData.get("firstName");
            const lastName = formData.get("lastName");
            const email = formData.get("email");
            const phone = formData.get("phone");
            const address = formData.get("address");

            const rating1 = formData.get("rating1");
            const rating2 = formData.get("rating2");
            const rating3 = formData.get("rating3");

            if (formResult) {

                formResult.style.display = "block";
                formResult.className = "alert alert-success mt-4";

                formResult.innerHTML = "";

                const heading = document.createElement("h4");
                heading.textContent = "Forma užpildyta sėkmingai!";

                const details = document.createElement("p");
                details.textContent =
                    "Vardas: " + firstName + " " + lastName +
                    " | El. paštas: " + email +
                    " | Telefonas: " + phone +
                    " | Adresas: " + address;

                const ratings = document.createElement("p");
                ratings.textContent =
                    "Svetainės dizainas: " + rating1 + "/10; " +
                    "Informacijos aiškumas: " + rating2 + "/10; " +
                    "Bendra kokybė: " + rating3 + "/10.";

                formResult.appendChild(heading);
                formResult.appendChild(details);
                formResult.appendChild(ratings);
            }

            // Paruosiami duomenys el. laisko siuntimui
            const subject = encodeURIComponent(
                "Žinutė iš CV svetainės"
            );

            const body = encodeURIComponent(
                "Vardas: " + firstName + " " + lastName + "\n" +
                "El. paštas: " + email + "\n" +
                "Telefonas: " + phone + "\n" +
                "Adresas: " + address + "\n\n" +
                "Svetainės dizainas: " + rating1 + "/10\n" +
                "Informacijos aiškumas: " + rating2 + "/10\n" +
                "Bendra svetainės kokybė: " + rating3 + "/10"
            );

            // Atidaroma el. pasto programa
            window.location.href =
                "mailto:energetika@gmail.com?subject=" +
                subject + "&body=" + body;
        });
    }


    // ==========================================
    // 14. FORMOS ISVALYMAS
    // ==========================================

    if (clearButton && contactForm) {

        clearButton.addEventListener("click", function () {

            contactForm.reset();

            // Pasalinamos klaidos
            contactForm.querySelectorAll(
                ".validation-error"
            ).forEach(function (error) {
                error.remove();
            });

            // Grazinamos pradines slankikliu reiksmes
            ratingSliders.forEach(function (slider) {

                const output = document.getElementById(
                    slider.dataset.output
                );

                if (output) {
                    output.textContent = slider.value;
                }
            });

            // Paslepiamas rezultatas
            if (formResult) {
                formResult.style.display = "none";
                formResult.innerHTML = "";
            }
        });
    }

});
