const quizData = {
    html: {
        title: 'HTML Dasar',
        questions: [
            {
                q: 'Apa kepanjangan dari HTML?',
                options: [
                    'High Text Machine Language',
                    'Hyper Text Markup Language',
                    'Hyper Tool Multi Language',
                    'Home Text Markup Language'
                ],
                answer: 1
            },
            {
                q: 'Atribut yang digunakan untuk menentukan tujuan link pada tag <a> adalah...',
                options: ['src', 'href', 'link', 'url'],
                answer: 1
            },
            {
                q: 'Tag HTML yang digunakan untuk menampilkan gambar adalah...',
                options: ['<image>', '<pic>', '<img>', '<src>'],
                answer: 2
            }
        ]
    }
};

let currentTopic = null;
let currentIndex = 0;
let score = 0;
let answered = false;

function startQuiz(topic) {
    currentTopic = topic;
    currentIndex = 0;
    score = 0;
    answered = false;

    document.getElementById('quizPlay').style.display = 'block';
    document.getElementById('resultCard').style.display = 'none';
    document.getElementById('totalQ').textContent = quizData[topic].questions.length;
    document.getElementById('liveScore').textContent = '0';

    buildQuestions();
    showQuestion(0);
}

function buildQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    const questions = quizData[currentTopic].questions;

    questions.forEach((q, i) => {
        const card = document.createElement('div');
        card.className = 'question-card' + (i === 0 ? ' active' : '');
        card.id = 'question-' + i;

        card.innerHTML = `
            <div class="question-text fw-bold mb-4" style="font-size: 1.25rem;">${q.q}</div>
            <div class="option-list" id="options-${i}"></div>
            <div class="quiz-feedback" id="feedback-${i}" style="display:none"></div>
            <div class="quiz-nav mt-4">
                <button class="btn-quiz-nav" onclick="prevQuestion()" ${i === 0 ? 'disabled' : ''} id="prevBtn-${i}">
                    &larr; Sebelumnya
                </button>
                <button class="btn-quiz-nav" onclick="nextQuestion()" id="nextBtn-${i}" disabled>
                    ${i === questions.length - 1 ? 'Lihat Hasil' : 'Berikutnya &rarr;'}
                </button>
            </div>
        `;
        container.appendChild(card);

        const optList = document.getElementById('options-' + i);
        q.options.forEach((opt, oi) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => selectAnswer(i, oi, q.answer);
            optList.appendChild(btn);
        });
    });
}

function showQuestion(index) {
    document.querySelectorAll('.question-card').forEach(c => c.classList.remove('active'));
    document.getElementById('question-' + index).classList.add('active');
    document.getElementById('currentQ').textContent = index + 1;
    const total = quizData[currentTopic].questions.length;
    document.getElementById('quizProgressFill').style.width = ((index + 1) / total * 100) + '%';
}

function selectAnswer(questionIndex, chosenIndex, correctIndex) {
    const card = document.getElementById('question-' + questionIndex);
    const buttons = card.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback-' + questionIndex);
    const nextBtn = document.getElementById('nextBtn-' + questionIndex);

    if (buttons[0].disabled) return;

    buttons.forEach(btn => btn.disabled = true);

    if (chosenIndex === correctIndex) {
        buttons[chosenIndex].classList.add('correct');
        feedback.textContent = '✓ Jawaban benar! Bagus!';
        feedback.className = 'quiz-feedback correct-fb';
        score++;
        document.getElementById('liveScore').textContent = score;
    } else {
        buttons[chosenIndex].classList.add('wrong');
        buttons[correctIndex].classList.add('correct');
        feedback.textContent = '✗ Jawaban salah. Jawaban yang benar: ' + quizData[currentTopic].questions[questionIndex].options[correctIndex];
        feedback.className = 'quiz-feedback wrong-fb';
    }

    feedback.style.display = 'block';
    nextBtn.disabled = false;
}

function nextQuestion() {
    const total = quizData[currentTopic].questions.length;
    if (currentIndex < total - 1) {
        currentIndex++;
        showQuestion(currentIndex);
    } else {
        showResult();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion(currentIndex);
    }
}

function showResult() {
    document.querySelectorAll('.question-card').forEach(c => c.classList.remove('active'));
    const total = quizData[currentTopic].questions.length;
    const resultCard = document.getElementById('resultCard');
    const pct = Math.round(score / total * 100);

    document.getElementById('finalScore').textContent = score + '/' + total;
    document.getElementById('quizProgressFill').style.width = '100%';

    let msg = '';
    if (pct === 100) msg = 'Sempurna! Kamu menguasai topik ini! 🎉';
    else if (pct >= 80) msg = 'Sangat bagus! Terus tingkatkan kemampuanmu! 💪';
    else if (pct >= 60) msg = 'Cukup baik! Pelajari lagi materi yang kamu lewatkan.';
    else msg = 'Jangan menyerah! Ulangi materi dan coba lagi. 📖';

    document.getElementById('resultTitle').textContent = 'Quiz Selesai!';
    document.getElementById('resultMsg').textContent = msg;
    resultCard.style.display = 'block';
}

function retryQuiz() {
    startQuiz(currentTopic);
}

function backToSelection() {
    window.location.href = 'index.html';
}
