import React, {useState} from 'react';
import { fetchQuizQuestions } from './API';
//components
import QuestionCard from './components/QuestionCard';
//Types
import { QuestionState, Difficulty }  from './API';
//Style
import {GlobalStyle, Wrapper } from './App.style';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;

}

const TOTAL_QUESTION =10;


const App = () => {
   const [loading, setLoading] = useState(false);
   const [questions, setQuestions] = useState<QuestionState[]>([]);
   const [number, setNumber] = useState(0);
   const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
   const [score, setScore] = useState(0);
   const [gameOver, setGameOver] = useState(true);


//From console log
//fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY)
  //  console.log(questions);



  const startTrivia = async () => {

    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);

  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
      if(!gameOver) {
        //user answers
        const answer = e.currentTarget.value;
        // check answer against correct answer
        const correct = questions[number].correct_answer === answer;
        //Add  score if answer is correct
        if (correct) setScore(prev => prev +1);
        //Ssave answer in the array for user answer
        const AnswerObject = {
          question: questions[number].question,
          answer,
          correct,
          correctAnswer: questions[number].correct_answer,
        };
        setUserAnswer(prev => [...prev, AnswerObject])
      }

  };


  const nextQuestion = () => {
    //Move on to the next question if not the last question
    const nextQuestion = number +1;

    if( nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }

  };


    return (
      <>
      <GlobalStyle />
    <Wrapper>
      <h1>REACT QUIZ</h1>
      {gameOver || userAnswer.length === TOTAL_QUESTION ?(
      <button className='start' onClick={startTrivia}>
       Start
      </button>
      ): null}
      { !gameOver ? <p className='score'>Score: {score} </p> : null}
      {loading && <p>Loading Question ..... </p>}
     {!loading && !gameOver && (
        <QuestionCard 
              questionNr={number + 1}
              totalQuestions={TOTAL_QUESTION}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswer ? userAnswer[number] : undefined}
              callback={checkAnswer}
     />
     )}
     {!gameOver &&
      !loading && 
      userAnswer.length ===  number +1 && 
      number !== TOTAL_QUESTION -1 ? (
      <button className='next' onClick={nextQuestion}>
        Next 
      </button>
     ) : null}
      </Wrapper>
      </>
    )
  };


export default App;
