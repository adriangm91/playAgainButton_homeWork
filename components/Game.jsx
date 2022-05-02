import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Number from "./Number";

export default Game = ({ randomNumbersCount, initialSeconds }) => {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [target, setTarget] = useState();
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [gameStatus, setGameStatus] = useState('PLAYING');
  const intervalId = useRef();
  
  const isNumberSelected = numberIndex => selectedNumbers.some(number => number === numberIndex); // de aqui obtenemos un booleano
  const selectNumber = number => setSelectedNumbers([...selectedNumbers, number]);

  //FUNCIONES

  //FUNCION BOTÓN
  const onPressedButton = () => {
    setSelectedNumbers([]);
    gameFunction();
    if (gameStatus !== 'PLAYING' || remainingSeconds === 0) {
      setGameStatus('PLAYING');
      setRemainingSeconds(initialSeconds);
    }
  };
  //FUNCION ESCONDER
  const hideButton = () => {
    if (gameStatus === 'PLAYING') {
      return 'HIDE'
    } else {
      return 'VISIBLE'
    };
  };
  const playAgainG = hideButton();
  //FUNCION GETGAME
  const getGameStatus = () => {
    const sumSelected = selectedNumbers.reduce((acc, curr) => acc + randomNumbers[curr], 0);
    if (remainingSeconds === 0 || sumSelected > target) {
      return 'LOST';
    } else if (sumSelected === target) {
      return 'WON';
    } else {
      return 'PLAYING';
    }
  };

  const gameFunction = () => {
    const numbers = Array.from({ length: randomNumbersCount }).map(() => 1 + Math.floor(10 * Math.random()));
    const target = numbers.slice(0, randomNumbersCount - 2).reduce((acc, cur) => acc + cur, 0);

    setRandomNumbers(numbers);
    setTarget(target);

    intervalId.current = setInterval(() => setRemainingSeconds(seconds => seconds - 1), 1000);
    return () => clearInterval(intervalId.current);
  };

  const timerFunction = () => {
    setGameStatus(() => getGameStatus());
    if (remainingSeconds === 0 || gameStatus !== 'PLAYING') {
      clearInterval(intervalId.current)
    }
  }
  //USEEFFECTS

  useEffect(() => console.log(selectedNumbers), [selectedNumbers]);

  useEffect(() => {
    hideButton()
  }, [gameStatus]);


  useEffect(() => {
    gameFunction();
  }, []);


  useEffect(() => {
    timerFunction();
  }, [remainingSeconds, selectedNumbers])

  // useEffect(()=>{
  //   onPressedButton();
  // },[pressButton])
  //const target = 10 + Math.floor(40 * Math.random());//math.random da un numero random entre 0 y 1
  //const numbers = Array.from({ length: randomNumbers}).map(()=> 1 + Math.floor(10 * Math.random()));
  //const target = numbers.slice(0,randomNumbers -2).reduce( (acc, cur)=> acc + cur, 0);

  // useEffect sin arreglo ejecuta todo el tiempo useEffect(() => {});
  // useEffect con arreglo vacio ejecuta solo una vez al inicio useEffect(() => {}, []);
  // useEffect con parametros dentro del arreglo entonces quiere decir que renderiza solo cuando lo que está adentro cambia useEffect(() => {}, [valor1 valor2, valor3...]);
  // useEffect con un return que devuelve la función es como el willDismount useEffect(() => { ejecutaAlgo return(()=>{}) }, []); 
  // tiene dos parametros, primero funcion tipo flecha y segundo es propiedad de control

  //Este es el useEffect que necesito para esconder el botón

  // useEffect(()=>{
  //   if (remainingSeconds === 0){
  //     clearInterval(intervalId.current);
  //   }
  // }, [remainingSeconds]);

  // const status = gameStatus();

  return (


    <View>
      <Text style={styles.target}>{target}</Text>
      <Text style={[styles.target, styles[gameStatus]]}>{gameStatus}</Text>
      <Text>{remainingSeconds}</Text>
      {/* Esto es nuevo. No cambia la propiedad con style={styles.buttonPlayAgain} si la pongo directo si  */}
      <Pressable onPress={onPressedButton} >
        <Text style={[styles[playAgainG]]}> Play Again </Text>
      </Pressable>


      <View style={styles.randomContainer}>
        {randomNumbers.map((number, index) => (
          <Number key={index}
            id={index}
            number={number}
            isSelected={isNumberSelected(index) || gameStatus !== 'PLAYING'}
            onSelected={selectNumber} />
        ))}
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  PLAYING: {
    backgroundColor: '#bbb'
  },
  LOST: {
    backgroundColor: '#b01818'
  },
  WON: {
    backgroundColor: 'green'
  },
  HIDE: {
    display: 'none'
    // backgroundColor: "rgba(0,0,0,0)",
    // color: "rgba(0,0,0,0)"
  },
  VISIBLE: {
    backgroundColor: "#FFF8DC",
    borderRadius: 6,
    fontSize: 30,
    textAlign: "center",
    color: '#474B4E'
  }
});

//Si está PLAYING el botón se esconde
//Si está WON el botón aparece
//Si está LOST el botón aparece

//Para Reload
//Si está WON/LOST debe reiniciar el contador
//Si está WON/LOST debe cambiar a PLAYING
