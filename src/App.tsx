import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import questions from './data/questions';
import 'animate.css';
import correctAnswer from './sounds/correctAnswer.mp3';

function App() {

  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(10);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Preguntas y Categorías
  const categoryQuestions = currentCategory ? questions[currentCategory] : null;
  const question = categoryQuestions && categoryQuestions[currentQuestion];

  const handleHint = () => {
    setShowHint(true);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (gameOver) {
      return; // Si el juego ha terminado, no realizar ninguna acción
    }

    if (question && selectedAnswer === question.answer) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('¡Respuesta correcta!');
      playCorrectSound();
      toast.success('¡Respuesta correcta!', { autoClose: 2000 });
    } else {
      setFeedback('Respuesta incorrecta');
    }

    const nextQuestion = currentQuestion + 1;
    if (categoryQuestions && nextQuestion < categoryQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeRemaining(10);
    } else {
      setGameOver(true);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentQuestion(0);
    setScore(0);
    setFeedback(null);
    setTimeRemaining(10);
    setShowHint(false);
    setGameOver(false);
  };

  const handleRestartGame = () => {
    setCurrentCategory(null);
    setCurrentQuestion(0);
    setScore(0);
    setFeedback(null);
    setTimeRemaining(10);
    setShowHint(false);
    setGameOver(false);
  };

  useEffect(() => {
    // Animaciones al cargar la página
    const animateElements = document.querySelectorAll('.animate__animated');

    const showElements = () => {
      animateElements.forEach((element) => {
        element.classList.add('visible');
      });
    };

    const hideElements = () => {
      animateElements.forEach((element) => {
        element.classList.remove('visible');
      });
    };

    // Mostrar elementos animados al cargar la página
    showElements();

    // Ocultar elementos animados después de 2 segundos
    setTimeout(hideElements, 2000);

    // Limpiar clases de animación al finalizar
    setTimeout(() => {
      animateElements.forEach((element) => {
        element.classList.remove('animate__animated', 'animate__fadeIn');
      });
    }, 3000);
  }, []);

  useEffect(() => {
    // Reproducir sonido cuando hay una respuesta correcta
    if (feedback === '¡Respuesta correcta!') {
      playCorrectSound();
    }
  }, [feedback]);

  useEffect(() => {
    // Temporizador de cuenta regresiva
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          handleAnswer(''); // Si el tiempo se agota, se considera una respuesta incorrecta
          return 0;
        } else {
          const newProgress = (prevTime / 10) * 100; // Calcula el progreso en base al tiempo restante
          setProgress(newProgress); // Actualiza el progreso de la barra
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  // Reproducir sonido de respuesta correcta
  const playCorrectSound = () => {
    const audio = new Audio(correctAnswer);
    audio.play();
  };

  
  return (
    <div className="App">
      <h1 className="animate__animated animate__fadeIn">Preguntados</h1>
      <ToastContainer />
      {currentCategory ? (
        <>
          {categoryQuestions && categoryQuestions.length > 0 && !gameOver ? (
            <div className="animate__animated animate__fadeIn">
              {question && (
                <div>
                  <h2>{question.question}</h2>
                  {showHint && (
                    <p className="hint animate__animated animate__fadeIn">Pista: {question.hint}</p>
                )}
                <ul>
                  {question.options.map((option: string, optionIndex: number) => (
                    <li
                      key={optionIndex}
                      onClick={() => handleAnswer(option)}
                      className="animate__animated animate__fadeIn"
                    >
                      {option}
                    </li>
                    ))}
                  </ul>
                </div>
              )}
              {!showHint && (
                <button onClick={handleHint} className="hint-question animate__animated animate__fadeIn">
                  Mostrar Pista
                </button>
              )}
              {feedback && <p className="animate__animated animate__fadeIn">{feedback}</p>}
              <p className="animate__animated animate__fadeIn">
                Tiempo restante: {timeRemaining} segundos
              </p>
              <div
                className="progress-bar animate__animated animate__fadeIn"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="animate__animated animate__fadeIn">Puntuación: {score}</p>
            </div>
          ) : (
            <div className="resultados animate__animated animate__fadeIn">
              <h2>Resultados</h2>
              <p>Puntuación final: {score}</p>
              <button className="btn-restart" onClick={handleRestartGame}>
                Reiniciar juego
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
              <h2 className="animate__animated animate__fadeIn">Elige una categoría</h2>
          <ul>
            <li
              onClick={() => handleCategoryChange('Geografía')}
              className="animate__animated animate__fadeIn"
            >
              Geografía
            </li>
            <li
              onClick={() => handleCategoryChange('Deportes')}
              className="animate__animated animate__fadeIn"
            >
              Deportes
            </li>
            <li
              onClick={() => handleCategoryChange('Historia')}
              className="animate__animated animate__fadeIn"
            >
              Historia
            </li>
            <li
              onClick={() => handleCategoryChange('Programación')}
              className="animate__animated animate__fadeIn"
            >
              Programación
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
