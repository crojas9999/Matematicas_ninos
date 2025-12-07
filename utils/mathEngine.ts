import { MathProblem, OperationType, LEVELS } from '../types';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOptions = (answer: number, range: number): number[] => {
  const options = new Set<number>();
  options.add(answer);

  // Generate wider range for distractors based on difficulty range
  const spread = Math.max(5, Math.floor(range * 0.2));

  while (options.size < 4) {
    const offset = getRandomInt(1, spread);
    const direction = Math.random() > 0.5 ? 1 : -1;
    let option = answer + (offset * direction);
    
    // Ensure non-negative options and simple fallback
    if (option < 0 || option === answer) {
        option = getRandomInt(0, answer + 10);
    }
    
    options.add(option);
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateProblem = (level: number, activeOps: OperationType[]): MathProblem => {
  // Default to level 1 if invalid
  const config = LEVELS[level as keyof typeof LEVELS] || LEVELS[1];
  
  const operation = activeOps.length > 0 
    ? activeOps[Math.floor(Math.random() * activeOps.length)] 
    : '+';
  
  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  switch (operation) {
    case '+':
      num1 = getRandomInt(1, config.range);
      num2 = getRandomInt(1, config.range);
      answer = num1 + num2;
      break;
      
    case '-':
      num1 = getRandomInt(2, config.range);
      num2 = getRandomInt(1, num1);
      answer = num1 - num2;
      break;
      
    case '×':
      num1 = getRandomInt(2, config.mulRange);
      num2 = getRandomInt(2, config.mulRange);
      answer = num1 * num2;
      break;
      
    case '÷':
      // Ensure clean division
      answer = getRandomInt(2, config.mulRange); // Result
      num2 = getRandomInt(2, Math.min(10, config.mulRange)); // Divisor
      num1 = answer * num2; // Dividend
      break;
  }

  return {
    num1,
    num2,
    operation,
    answer,
    options: generateOptions(answer, config.range),
  };
};