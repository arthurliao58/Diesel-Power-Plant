/**
 * Interactive Knowledge Assessment Module
 * Chapter quizzes, score tracking, detailed engineering explanations and persistence
 */

class PlantQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeFilter = "all";
    this.userAnswers = {}; // { questionIndex: selectedOptionIndex }
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  filterQuestions(chapterId) {
    this.activeFilter = chapterId;
    this.render();
    this.attachEvents();
  }

  getFilteredQuestions() {
    if (this.activeFilter === "all") {
      return QUIZ_QUESTIONS;
    }
    return QUIZ_QUESTIONS.filter(q => q.chapterId === this.activeFilter);
  }

  render() {
    const questions = this.getFilteredQuestions();
    let answeredCount = 0;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const globalIdx = QUIZ_QUESTIONS.indexOf(q);
      if (this.userAnswers[globalIdx] !== undefined) {
        answeredCount++;
        if (this.userAnswers[globalIdx] === q.answer) {
          correctCount++;
        }
      }
    });

    const percent = answeredCount > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    this.container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-header">
          <div class="quiz-title-group">
            <h3><i class="fas fa-graduation-cap"></i> 柴油發電廠工程技術自我評測</h3>
            <p>檢驗對柴油機發電廠 9 大系統、熱力循環、燃燒室、潤滑冷卻與調速機制的理解深度</p>
          </div>
          <div class="quiz-score-pill">
            <span class="score-label">測驗得分:</span>
            <span class="score-val">${correctCount} / ${questions.length}</span>
            <span class="score-pct">(${percent}%)</span>
          </div>
        </div>

        <div class="quiz-chapter-tabs">
          <button class="quiz-tab-btn ${this.activeFilter === 'all' ? 'active' : ''}" data-chap="all">全部章節綜合評測</button>
          <button class="quiz-tab-btn ${this.activeFilter === 'chap-layout' ? 'active' : ''}" data-chap="chap-layout">Ch.1 電廠佈局</button>
          <button class="quiz-tab-btn ${this.activeFilter === 'chap-engine-basics' ? 'active' : ''}" data-chap="chap-engine-basics">Ch.2 內燃機原理</button>
          <button class="quiz-tab-btn ${this.activeFilter === 'chap-lub-cool' ? 'active' : ''}" data-chap="chap-lub-cool">Ch.3 潤滑與冷卻</button>
          <button class="quiz-tab-btn ${this.activeFilter === 'chap-gov-ign' ? 'active' : ''}" data-chap="chap-gov-ign">Ch.4 調速與點火</button>
          <button class="quiz-tab-btn ${this.activeFilter === 'chap-supercharger' ? 'active' : ''}" data-chap="chap-supercharger">Ch.6 增壓系統</button>
        </div>

        <div class="quiz-questions-list">
          ${questions.map((q, localIdx) => {
            const globalIdx = QUIZ_QUESTIONS.indexOf(q);
            const userAns = this.userAnswers[globalIdx];
            const isAnswered = userAns !== undefined;
            const isCorrect = isAnswered && userAns === q.answer;

            return `
              <div class="quiz-card ${isAnswered ? (isCorrect ? 'card-correct' : 'card-incorrect') : ''}" data-idx="${globalIdx}">
                <div class="quiz-q-num">問題 ${localIdx + 1}</div>
                <div class="quiz-q-text">${q.question}</div>

                <div class="quiz-options-group">
                  ${q.options.map((opt, optIdx) => {
                    let optClass = "quiz-opt-btn";
                    if (isAnswered) {
                      if (optIdx === q.answer) {
                        optClass += " opt-correct";
                      } else if (optIdx === userAns) {
                        optClass += " opt-wrong";
                      } else {
                        optClass += " opt-disabled";
                      }
                    }
                    return `
                      <button class="${optClass}" data-global-idx="${globalIdx}" data-opt-idx="${optIdx}" ${isAnswered ? 'disabled' : ''}>
                        <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
                        <span class="opt-text">${opt}</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                ${isAnswered ? `
                  <div class="quiz-explanation-box ${isCorrect ? 'exp-correct' : 'exp-wrong'}">
                    <div class="exp-title">
                      <i class="fas ${isCorrect ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'}"></i>
                      ${isCorrect ? '回答正確！' : '回答錯誤！正確答案是：' + String.fromCharCode(65 + q.answer)}
                    </div>
                    <div class="exp-body">${q.explanation}</div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="quiz-footer">
          <button class="btn btn-outline" id="btn-reset-quiz"><i class="fas fa-redo"></i> 重設所有題目重測</button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Chapter filter tabs
    this.container.querySelectorAll(".quiz-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const chap = btn.dataset.chap;
        this.filterQuestions(chap);
      });
    });

    // Option buttons
    this.container.querySelectorAll(".quiz-opt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const globalIdx = parseInt(btn.dataset.globalIdx, 10);
        const optIdx = parseInt(btn.dataset.optIdx, 10);
        this.userAnswers[globalIdx] = optIdx;
        this.render();
        this.attachEvents();
      });
    });

    // Reset button
    const resetBtn = this.container.querySelector("#btn-reset-quiz");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("確定要重設本測驗的所有回答記錄嗎？")) {
          this.userAnswers = {};
          this.render();
          this.attachEvents();
        }
      });
    }
  }
}
