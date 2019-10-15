/* Inspired by https://www.freecodecamp.org/news/parsing-math-expressions-with-javascript-7e8f5572276e/ */

function eval() {
    // Do not use eval!!!
    return;
}

const separatorsExpr = /[-+/*()]/g;
const precedence = {'*' : 3,  '/' : 3,  '+' : 2,  '-' : 2 };
/*association array not needed because all operations are left-associative*/


/*assume that expression is valid */
function expressionCalculator(expr) {
  let tokenizedExpr = tokenize(expr);
  let postfixExpr = tokensToRPN(tokenizedExpr);
  let result = computeRPN(postfixExpr);
  return result;
}

function computeRPN(postfixExpr) {
  let exprToCompute = postfixExpr.reverse();
  let args = [];
  while (exprToCompute.length>0){
    let token = exprToCompute.pop();
    if (precedence[token]!==undefined) {
      let arg2 = args.pop();
      let arg1 = args.pop();
      args.push(computeBinary(arg1,arg2,token));
    } else {
      args.push(token);
    }
  }
  return args[0];
}

/* Implements a shunting yard algorithm https://en.wikipedia.org/wiki/Shunting-yard_algorithm*/
/* 
/* This implementation does not implement composite functions,functions with variable number of arguments, and unary operators. */
/*
/* while there are tokens to be read do:
/*     read a token.
/*     if the token is a number, then:
/*         push it to the output queue.
/*     if the token is a function then:
/*         push it onto the operator stack 
/*     if the token is an operator, then:
/*         while ((there is a function at the top of the operator stack)
/*                or (there is an operator at the top of the operator stack with greater precedence)
/*                or (the operator at the top of the operator stack has equal precedence and is left associative))
/*               and (the operator at the top of the operator stack is not a left parenthesis):
/*             pop operators from the operator stack onto the output queue.
/*         push it onto the operator stack.
/*     if the token is a left paren (i.e. "("), then:
/*         push it onto the operator stack.
/*     if the token is a right paren (i.e. ")"), then:
/*         while the operator at the top of the operator stack is not a left paren:
/*             pop the operator from the operator stack onto the output queue.
/*         /* if the stack runs out without finding a left paren, then there are mismatched parentheses.*/
/*         if there is a left paren at the top of the operator stack, then:
/*             pop the operator from the operator stack and discard it
/* after while loop, if operator stack not null, pop everything to output queue
/* if there are no more tokens to read then:
/*     while there are still operator tokens on the stack:
/*         /* if the operator token on the top of the stack is a paren, then there are mismatched parentheses.*/
/*         pop the operator from the operator stack onto the output queue.
/* exit.
*/
function tokensToRPN(tokenizedExpr) {
  let operatorsStack=[];
  let outputQueue=[];
  for (let i=0;i<tokenizedExpr.length;i++){
    let token = tokenizedExpr[i];
    if (Object.keys(precedence).includes(token)){
      if (operatorsStack.length == 0) {
        operatorsStack.push(token);
        continue;
      }
      let tokenPrecedence = precedence[token];
      while ( (precedence[operatorsStack[operatorsStack.length-1]] >= tokenPrecedence) && 
              (operatorsStack[operatorsStack.length-1] != '(' )){
        let topToken = operatorsStack.pop();
        outputQueue.push(topToken);
      }
      operatorsStack.push(token);
      continue;
    }
    if (token == '('){
      operatorsStack.push(token);
      continue;
    }
    if (token == ')'){
      while ( (operatorsStack.length > 0) && (operatorsStack[operatorsStack.length-1] != '(') ) {
        let topToken = operatorsStack.pop();
        outputQueue.push(topToken);
      }
      if (operatorsStack.length == 0) {
        throw new Error("ExpressionError: Brackets must be paired");
      }
      if (operatorsStack[operatorsStack.length-1] == '('){
        operatorsStack.pop();
      }
      continue;
    }
    outputQueue.push(token);
  }
  while (operatorsStack.length>0){
    let topToken = operatorsStack.pop();
    if (topToken == '('){ 
      throw new Error("ExpressionError: Brackets must be paired");
    }
    outputQueue.push(topToken);
  }
  return outputQueue;
}

function computeBinary (arg1,arg2, operator){
  switch(operator) {
    case '+':
      return Number(arg1) + Number(arg2);
    case '-':
      return Number(arg1) - Number(arg2);
    case '/':
      if(Number(arg2)==0) {
        throw new TypeError("TypeError: Division by zero.");
      }
      return Number(arg1)/Number(arg2);
    case '*':
      return Number(arg1)*Number(arg2);
  }
}

function tokenize (expr){
  let preparedExpr = expr.replace(separatorsExpr, match => '$' + match + '$');
  let tokenizedExpr = preparedExpr.split('$');
  tokenizedExpr = tokenizedExpr.map(function(e){return e.trim();});
  tokenizedExpr = tokenizedExpr.filter(function(e){return e!="";});
  return tokenizedExpr;
}


module.exports = {expressionCalculator}