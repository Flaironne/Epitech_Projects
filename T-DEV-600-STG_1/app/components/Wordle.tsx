import React, { createRef, forwardRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

import { words } from "@/mocks";

const array = (length: number = 5): string[] =>
  [...Array(length)].map((a) => "");

const isLetterContained = (
  word: string,
  letter: string,
  position: number
): boolean => word.includes(letter) && word.indexOf(letter) !== position;

const isLetterGuessed = (
  word: string,
  letter: string,
  position: number
): boolean => word.split("")[position] === letter;

enum GameStatus {
  Waiting,
  Playing,
  Lost,
  Win,
}

interface WordleProps {
  wordsLength?: 4 | 5;
  tries?: number;
}

export const Wordle: React.FC<WordleProps> = (props: WordleProps) => {
  const { wordsLength = 5, tries = 5 } = props;
  const playedWords: string[] = [];

  if (![4, 5].includes(wordsLength))
    throw new Error("The word length must be 4 or 5");

  if (tries < 1) throw new Error("The number of tries must be greater than 0");

  const [word, setWord] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Waiting);
  const [remainingTries, setRemainingTries] = useState<number>(tries);
  const [score, setScore] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [timer, setTimer] = useState<number>(0);

  const updateScore = (guess: string[]) => {
    let correctsLetters = guess.filter(
      (letter, i) => word[i] === letter && !guesses.some((g) => g[i] === letter)
    ).length;

    let wrongLetters = guess.filter(
      (letter, i) => word[i] !== letter && word.includes(letter)
    ).length;

    if (correctsLetters === 0 && wrongLetters === 0) return;

    setScore(
      Math.max(
        10 * remainingTries +
          10 * timer +
          5 * correctsLetters -
          5 * wrongLetters,
        0
      )
    );
  };

  const restart = () => {
    setGuesses([]);
    setRemainingTries(tries);
    setScore(0);
    setTimer(0);
    setGameStatus(GameStatus.Waiting);
  };

  const randomize = () =>
    words[wordsLength][Math.floor(Math.random() * words[wordsLength].length)];

  useEffect(() => {
    if (gameStatus !== GameStatus.Waiting) return;

    let currentWord = randomize();

    while (playedWords.includes(currentWord)) {
      currentWord = randomize();
    }

    setWord(currentWord);
    setGameStatus(GameStatus.Playing);
    setIsLoading(false);
    
  }, [gameStatus]);

  useEffect(() => {
    if (guesses.length === 0) return;

    const lastGuess = guesses[guesses.length - 1];

    if (lastGuess.join("") === word) {
      setScore((prev) => prev + 10 * remainingTries + 10 * timer);
      setGameStatus(GameStatus.Win);
    }

    if (remainingTries === 0) {
      setScore((prev) => prev - 10 * timer);
      setGameStatus(GameStatus.Lost);
    }

    updateScore(lastGuess);
  }, [guesses]);

  const isPlaying = gameStatus === GameStatus.Playing;
  const isLost = gameStatus === GameStatus.Lost;
  const isWin = gameStatus === GameStatus.Win;
  const remainingRows = Math.max(0, remainingTries - (isPlaying ? 1 : 0));

  return (
    <ScrollView style={styles.scrollView} id="wordle">
      <View style={styles.container}>
        {isLoading ? (
          <Text style={styles.text}>Loading...</Text>
        ) : (
          <>
            <Score score={score} />
            {isPlaying && <Timer timer={timer} setTimer={setTimer} />}
            <View style={styles.wordle}>
              <>
                {guesses.map((guess, i) => {
                  return (
                    <Row
                      key={`guesses-${i}`}
                      guess={guess}
                      word={word}
                      submitted
                    />
                  );
                })}

                {isPlaying && (
                  <Row
                    word={word}
                    wordsLength={wordsLength}
                    setGuesses={setGuesses}
                    setRemainingTries={setRemainingTries}
                    isCurrentLine
                  />
                )}

                {[...Array(remainingRows)]?.map((_, i) => (
                  <Row key={`remaining-tries-${i}`} word={word} disabled />
                ))}

                {isLost && (
                  <GameOver
                    score={score}
                    time={timer}
                    word={word}
                    restart={restart}
                  />
                )}
                {isWin && <Win score={score} restart={restart} />}
              </>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

interface TimerProps {
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
}

const Timer: React.FC<TimerProps> = (props: TimerProps) => {
  const { timer, setTimer } = props;

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <></>;
};

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = (props: ScoreProps) => {
  const { score } = props;

  useEffect(() => {
    return () => {};
  }, [score]);

  return <Text style={styles.score}>{score} points</Text>;
};

interface RowProps {
  word: string;
  wordsLength?: number;
  guess?: string[];
  isCurrentLine?: boolean;
  submitted?: boolean;
  disabled?: boolean;
  setGuesses?: React.Dispatch<React.SetStateAction<string[][]>>;
  setRemainingTries?: React.Dispatch<React.SetStateAction<number>>;
}

const Row: React.FC<RowProps> = (props: RowProps) => {
  const {
    word,
    wordsLength,
    setGuesses,
    setRemainingTries,
    guess = array(wordsLength),
    submitted = false,
    disabled = false,
    isCurrentLine = false,
  } = props;

  const [letters, setLetters] = useState<string[]>([]);
  const refs = [...Array(wordsLength)].map(() => createRef<TextInput>());

  useEffect(() => {
    if (!isCurrentLine) return;

    if (letters.length === wordsLength) {
      refs.forEach((ref) => {
        ref.current?.clear();
      });
      setLetters([]);
      refs[0].current?.focus();
    }
  }, [letters]);

  const onChange = (letter: string, i: number) => {
    if (!isCurrentLine) return;

    if (!letter || !/^[a-zA-Z]*$/.test(letter)) return;

    refs[i + 1]?.current?.focus();

    let _letters = [...letters, letter.toUpperCase()];

    if (_letters.length === wordsLength) {
      setGuesses?.((prev) => [...prev, _letters]);
      setRemainingTries?.((prev) => prev - 1);
    }

    setLetters(_letters);
  };

  const onKeyPress = (e: any, i: number) => {
    if (!isCurrentLine) return;

    if (e.nativeEvent.key === "Backspace") {
      if (i !== 0 && letters[i] === "") {
        refs[i - 1]?.current?.focus();
        return;
      }

      let _letters = [...letters];
      _letters.pop();
      setLetters(_letters);
    }
  };

  const isCurrentInput = (i: number) => isCurrentLine && i === letters.length;

  return (
    <View style={styles.row}>
      {guess.map((letter, i) => {
        return disabled || (submitted && letter !== "") ? (
          <Letter
            key={i}
            letter={letter}
            isContained={!disabled && isLetterContained(word, letter, i)}
            isGuessed={!disabled && isLetterGuessed(word, letter, i)}
          />
        ) : (
          <Input
            key={`letter-input-${i}`}
            isCurrent={isCurrentInput(i)}
            value={letters[i] || ""}
            onChange={(letter: string) => onChange(letter, i)}
            onKeyPress={(e: any) => onKeyPress(e, i)}
            ref={refs[i]}
          />
        );
      })}
    </View>
  );
};

interface LetterProps {
  letter: string;
  isContained: boolean;
  isGuessed: boolean;
}

const Letter: React.FC<LetterProps> = (props: LetterProps) => {
  const { letter, isContained, isGuessed } = props;

  let backgroundColor = isGuessed
    ? "#3eaa42"
    : isContained
    ? "#cd8729"
    : "#3a3a3c";

  return (
    <View
      style={{
        ...styles.letterContainer,
        backgroundColor,
      }}
    >
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

interface InputProps {
  isCurrent: boolean;
  value: string;
  onChange: (e: any) => void;
  onKeyPress: (e: any) => void;
}

const Input: React.FC<InputProps & React.RefAttributes<TextInput>> = forwardRef(
  (props, ref) => {
    const { isCurrent, value, onChange, onKeyPress } = props;

    return (
      <View
        style={{
          ...styles.letterContainer,
          borderColor: isCurrent ? "white" : "transparent",
          borderWidth: isCurrent ? 2 : 0,
        }}
      >
        <TextInput
          ref={ref}
          style={styles.letter}
          maxLength={1}
          focusable={true}
          textAlign="center"
          value={value}
          autoFocus={isCurrent}
          cursorColor={"transparent"}
          selectionColor={"transparent"}
          onKeyPress={onKeyPress}
          onChangeText={onChange}
        />
      </View>
    );
  }
);

interface EndScreenProps {
  score: number;
  restart: () => void;
}

interface GameOverProps {
  time: number;
  word: string;
}

const GameOver: React.FC<GameOverProps & EndScreenProps> = (
  props: GameOverProps & EndScreenProps
) => {
  const { restart, score, time, word } = props;

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <View style={styles.modal}>
        <View>
          <Text
            style={{
              ...styles.word,
              backgroundColor: "rgba(14, 14, 15, 0.96)",
              padding: 20,
              borderRadius: 20,
              shadowColor: "#171717",
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              marginBottom: 50,
            }}
          >
            {word.split("").map((letter, i) => (
              <Text
                key={i}
                style={{
                  ...styles.letter,
                  fontSize: 50,
                  color: Math.random() >= 0.5 ? "orange" : "green",
                }}
              >
                {letter}
              </Text>
            ))}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 50,
          }}
        >
          <Text style={styles.text}>
            You lost in{" "}
            <Text style={{ color: "orange", fontWeight: "bold" }}>{time}</Text>{" "}
            seconds...
          </Text>
        </View>
        <Restart restart={restart} />
      </View>
    </Modal>
  );
};

const Win: React.FC<EndScreenProps> = (props: EndScreenProps) => {
  const { restart, score } = props;

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <View
        style={{
          ...styles.modal,
          gap: 100,
        }}
      >
        <View>
          <Text style={styles.text}>Congratulations!</Text>
          <Text style={styles.text}>You scored {score} points</Text>
        </View>
        <Restart restart={restart} />
      </View>
    </Modal>
  );
};

interface RestartProps {
  restart: () => void;
}

const Restart: React.FC<RestartProps> = (props: RestartProps) => {
  const { restart } = props;

  return (
    <View
      style={{
        gap: 20,
      }}
    >
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={restart}
      >
        <Text style={styles.text}>Play again</Text>
      </TouchableOpacity>
      <Text
        style={{
          ...styles.text,
          textTransform: "none",
          fontSize: 20,
        }}
        onPress={() => router.push("/pages/home")}
      >
        Or quit ?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "rgba(14, 14, 15, 0.92)",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 999,
    gap: 10,
  },
  button: {
    backgroundColor: "#3a3a3c",
    padding: 20,
    borderRadius: 20,
  },
  word: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    backgroundColor: "#0e0e0f",
    display: "flex",
  },
  container: {
    backgroundColor: "#0e0e0f",
    borderBlockStartColor: "#434D57",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginBottom: 100,
    paddingTop: 100,
  },
  text: {
    color: "white",
    fontSize: 20,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  wordle: {
    marginTop: 60,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    marginLeft: "auto",
    marginRight: 20,
  },
  row: {
    flexDirection: "row",
  },
  letterContainer: {
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#3a3a3c",
    width: 55,
    height: 55,
    display: "flex",
    margin: 5,
    justifyContent: "center",
    borderRadius: 8,
    alignItems: "center",
  },
  letter: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
  },
  guessedLetter: {
    fontSize: 30,
    fontWeight: "bold",
    color: "green",
    margin: 10,
  },
  wrongLetter: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
    margin: 10,
  },
  score: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: -30,
  },
});
